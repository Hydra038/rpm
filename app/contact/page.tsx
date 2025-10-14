"use client";
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, MessageCircle, Phone, Mail, MapPin, Clock, User, Bot } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { getUser } from '@/lib/supabase/auth';

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
  user_email?: string;
}

interface ChatUser {
  id: string;
  email: string;
}

export default function ContactPage() {
  const [user, setUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeUser();
  }, []);

  useEffect(() => {
    if (user && chatOpen) {
      loadMessages();
      setupRealtimeSubscription();
    }
  }, [user, chatOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeUser = async () => {
    const result = await getUser();
    if (result.user) {
      setUser({
        id: result.user.id,
        email: result.user.email || ''
      });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('support_messages')
      .select(`
        id,
        user_id,
        message,
        is_admin,
        created_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setMessages(data);
    } else if (error) {
      console.error('Error loading messages:', error);
    }
  };

  const setupRealtimeSubscription = () => {
    if (!user) return;

    const channel = supabase
      .channel('support_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_messages',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time payload:', payload);
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as Message;
            setMessages(prev => {
              // Avoid duplicates
              if (prev.some(msg => msg.id === newMsg.id)) {
                return prev;
              }
              return [...prev, newMsg];
            });
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
    if (!newMessage.trim() || !user || loading) return;

    setLoading(true);
    
    const { error } = await supabase
      .from('support_messages')
      .insert({
        user_id: user.id,
        message: newMessage.trim(),
        is_admin: false
      });

    if (!error) {
      setNewMessage('');
    }
    
    setLoading(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <main className="container mx-auto px-2 sm:px-4 py-4 space-y-6 sm:space-y-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center sm:text-left">Contact Us</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Contact Information */}
          <div className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-blue-900 text-sm sm:text-base">WhatsApp</p>
                    <p className="text-blue-700 text-sm break-all">+44 7723832186</p>
                    <p className="text-xs text-blue-600">WhatsApp messages only</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-green-900 text-sm sm:text-base">Email Support</p>
                    <p className="text-green-700 text-sm break-all">support@rpmgenuineautoparts.info</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-purple-900">Facebook</p>
                    <a href="https://web.facebook.com/profile.php?id=61563129454615" target="_blank" rel="noopener noreferrer" className="text-purple-700 hover:underline">
                      Visit our page
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-gray-700">Norwich, UK</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-semibold text-orange-900">Business Hours</p>
                    <p className="text-orange-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-orange-700">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-orange-700">Sunday: Closed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Live Chat Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Live Support Chat
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold mb-2">Sign in to Chat</h3>
                    <p className="text-gray-600 mb-4">Please log in to start a conversation with our support team</p>
                    <Button asChild>
                      <a href="/login">Sign In</a>
                    </Button>
                  </div>
                ) : !chatOpen ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-16 h-16 mx-auto mb-4 text-blue-500" />
                    <h3 className="text-lg font-semibold mb-2">Start Live Chat</h3>
                    <p className="text-gray-600 mb-4">Get instant help from our support team</p>
                    <Button onClick={() => setChatOpen(true)} className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Start Chat
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Chat Messages */}
                    <div className="h-96 border rounded-lg p-4 overflow-y-auto bg-gray-50">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-500 mt-8">
                          <Bot className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>Start a conversation! Our support team will respond shortly.</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${message.is_admin ? 'justify-start' : 'justify-end'}`}
                            >
                              <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                  message.is_admin
                                    ? 'bg-white border border-gray-200'
                                    : 'bg-blue-500 text-white'
                                }`}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  {message.is_admin ? (
                                    <Bot className="w-3 h-3 text-gray-500" />
                                  ) : (
                                    <User className="w-3 h-3" />
                                  )}
                                  <span className="text-xs opacity-75">
                                    {message.is_admin ? 'Support' : 'You'}
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
                    </div>
                    
                    {/* Message Input */}
                    <form onSubmit={sendMessage} className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={loading}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={loading || !newMessage.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                    
                    <div className="text-xs text-gray-500 text-center">
                      Our support team typically responds within a few minutes during business hours.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}