import { supabase } from './client';

export async function createOrder(userId: string, items: { part_id: string; quantity: number; price: number }[], totalAmount: number) {
  const { data: order, error } = await supabase.from('orders').insert({ user_id: userId, total_amount: totalAmount, status: 'pending' }).select().single();
  if (error) throw error;
  const orderId = order.id;
  const orderItems = items.map(item => ({ order_id: orderId, ...item }));
  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;
  return order;
}
