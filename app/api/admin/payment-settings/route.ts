import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    // Use service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: settings, error } = await supabase
      .from('payment_settings')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching payment settings:', error);
      throw error;
    }

    return NextResponse.json({ settings: settings || null });
  } catch (error: any) {
    console.error('Error in payment settings GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment settings: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const {
      paypal_email,
      bank_name,
      account_holder_name,
      account_number,
      sort_code,
      swift_code,
      bank_address,
      payment_instructions
    } = await request.json();

    // Use service role to bypass authentication issues for now
    const serviceSupabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check if settings exist
    const { data: existingSettings } = await serviceSupabase
      .from('payment_settings')
      .select('id')
      .limit(1)
      .single();

    let result;

    if (existingSettings) {
      // Update existing settings
      result = await serviceSupabase
        .from('payment_settings')
        .update({
          paypal_email,
          bank_name,
          account_holder_name,
          account_number,
          sort_code,
          swift_code,
          bank_address,
          payment_instructions,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single();
    } else {
      // Insert new settings
      result = await serviceSupabase
        .from('payment_settings')
        .insert({
          paypal_email,
          bank_name,
          account_holder_name,
          account_number,
          sort_code,
          swift_code,
          bank_address,
          payment_instructions
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error('Error saving payment settings:', result.error);
      throw result.error;
    }

    return NextResponse.json({ 
      message: 'Payment settings saved successfully',
      settings: result.data 
    });

  } catch (error: any) {
    console.error('Error in payment settings POST:', error);
    return NextResponse.json(
      { error: 'Failed to save payment settings: ' + error.message },
      { status: 500 }
    );
  }
}