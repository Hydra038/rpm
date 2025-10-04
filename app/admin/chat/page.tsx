"use client";
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, MessageCircle, User, Clock, Search } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Message {
  id: string;
  user_id: string;
  message: string;
  is_admin: boolean;
  created_at: string;
  user_profiles?: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

interface Conversation {
  user_id: string;
  user_email: string;
  user_name: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
  is_admin_last: boolean;
}

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    setupRealtimeSubscription();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadMessages(selectedUserId);
      markAsRead(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async () => {
    // First get all unique user IDs from support_messages
    const { data: messageData, error: messageError } = await supabase
      .from('support_messages')
      .select('user_id, message, is_admin, created_at')
      .order('created_at', { ascending: false });

    if (!messageError && messageData) {
      // Get unique user IDs
      const userIds = [...new Set(messageData.map(msg => msg.user_id))];
      
      // Get user profiles for these IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')
        .select('user_id, email, first_name, last_name')
        .in('user_id', userIds);

      const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]) || []);

      // Group messages by user_id and get latest message for each user
      const conversationMap = new Map<string, Conversation>();
      
      messageData.forEach(msg => {
        const userId = msg.user_id;
        const profile = profilesMap.get(userId);
        const userEmail = profile?.email || 'Unknown';
        const userName = profile?.first_name 
          ? `${profile.first_name} ${profile.last_name || ''}`.trim()
          : userEmail.split('@')[0];

        if (!conversationMap.has(userId)) {
          conversationMap.set(userId, {
            user_id: userId,
            user_email: userEmail,
            user_name: userName,
            last_message: msg.message,
            last_message_time: msg.created_at,
            unread_count: 0,
            is_admin_last: msg.is_admin
          });
        }

        // Count unread messages (non-admin messages)
        const conv = conversationMap.get(userId)!;
        if (!msg.is_admin) {
          conv.unread_count++;
        }
      });

      setConversations(Array.from(conversationMap.values()));
    }
  };

  const loadMessages = async (userId: string) => {
    const { data, error } = await supabase
      .from('support_messages')
      .select(`
        id,
        user_id,
        message,
        is_admin,
        created_at
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    } else if (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markAsRead = async (userId: string) => {
    // Update conversations to mark as read
    setConversations(prev => 
      prev.map(conv => 
        conv.user_id === userId 
          ? { ...conv, unread_count: 0 }
          : conv
      )
    );
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('admin_support_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_messages'
        },
        (payload) => {
          console.log('Admin real-time payload:', payload);
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as Message;
            
            // If it's for the currently selected user, add to messages
            if (selectedUserId === newMsg.user_id) {
              setMessages(prev => {
                // Avoid duplicates
                if (prev.some(msg => msg.id === newMsg.id)) {
                  return prev;
                }
                return [...prev, newMsg];
              });
            }
            
            // Update conversations list
            loadConversations();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId || loading) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('support_messages')
      .insert({
        user_id: selectedUserId,
        message: newMessage.trim(),
        is_admin: true
      });

    if (!error) {
      setNewMessage('');
      // Update conversation to show admin was last
      setConversations(prev =>
        prev.map(conv =>
          conv.user_id === selectedUserId
            ? { ...conv, is_admin_last: true, last_message: newMessage.trim(), last_message_time: new Date().toISOString() }
            : conv
        )
      );
    }
    
    setLoading(false);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.user_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = conversations.find(conv => conv.user_id === selectedUserId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Support Chat Management</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Conversations</span>
              <Badge variant="secondary">{conversations.length}</Badge>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map((conv) => (
                  <div
                    key={conv.user_id}
                    onClick={() => setSelectedUserId(conv.user_id)}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                      selectedUserId === conv.user_id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-sm">{conv.user_name}</span>
                      </div>
                      {conv.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conv.unread_count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{conv.user_email}</p>
                    <p className="text-sm text-gray-700 truncate mb-1">
                      {conv.is_admin_last ? '↩ ' : ''}
                      {conv.last_message}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {formatTime(conv.last_message_time)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Messages */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                {selectedConversation ? (
                  <>
                    <User className="w-5 h-5" />
                    <div>
                      <span>{selectedConversation.user_name}</span>
                      <p className="text-sm font-normal text-gray-600">
                        {selectedConversation.user_email}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5" />
                    Select a conversation
                  </>
                )}
              </CardTitle>
            </CardHeader>
            
            {selectedUserId ? (
              <>
                <CardContent className="flex-1 overflow-y-auto p-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>No messages in this conversation</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.is_admin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.is_admin
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <div className="flex items-center gap-1 mb-1">
                              <span className="text-xs opacity-75">
                                {message.is_admin ? 'You' : message.user_profiles?.first_name || 'Customer'}
                              </span>
                              <span className="text-xs opacity-75">
                                {formatTime(message.created_at)}
                              </span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </CardContent>
                
                <div className="p-4 border-t">
                  <form onSubmit={sendMessage} className="flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your response..."
                      disabled={loading}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={loading || !newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-semibold mb-2">Select a Conversation</h3>
                  <p>Choose a conversation from the list to start responding to customer messages</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}