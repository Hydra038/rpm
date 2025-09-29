import { supabase } from './client';

export interface OrderItem {
  part_id: string;
  quantity: number;
  price: number;
}

export interface CreateOrderParams {
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress?: any;
  billingAddress?: any;
  notes?: string;
}

export async function createOrder({ 
  userId, 
  items, 
  totalAmount, 
  shippingAddress, 
  billingAddress, 
  notes 
}: CreateOrderParams) {
  // Create the order
  const { data: order, error } = await supabase
    .from('orders')
    .insert({ 
      user_id: userId, 
      total_amount: totalAmount, 
      status: 'pending',
      payment_status: 'pending',
      shipping_address: shippingAddress,
      billing_address: billingAddress,
      notes: notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) throw error;
  
  // Create order items
  const orderItems = items.map(item => ({ 
    order_id: order.id, 
    part_id: item.part_id,
    quantity: item.quantity,
    price: item.price
  }));
  
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);
    
  if (itemsError) throw itemsError;
  
  return order;
}

// Legacy function for backward compatibility
export async function createOrderLegacy(userId: string, items: { part_id: string; quantity: number; price: number }[], totalAmount: number) {
  return createOrder({
    userId,
    items,
    totalAmount
  });
}

export async function updateOrderStatus(orderId: string, status: string, trackingNumber?: string) {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString()
  };
  
  if (trackingNumber) {
    updateData.tracking_number = trackingNumber;
  }
  
  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', orderId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function getOrdersByUser(userId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        parts (
          name,
          image_url,
          category
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function getOrderById(orderId: string, userId?: string) {
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id,
        quantity,
        price,
        parts (
          name,
          image_url,
          category,
          description
        )
      )
    `)
    .eq('id', orderId);
    
  if (userId) {
    query = query.eq('user_id', userId);
  }
  
  const { data, error } = await query.single();
  
  if (error) throw error;
  return data;
}
