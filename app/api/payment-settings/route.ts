import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Use service role to get payment settings (public info for checkout)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: settings, error } = await supabase
      .from('payment_settings')
      .select('paypal_email, bank_name, account_holder_name, account_number, sort_code, swift_code, bank_address, payment_instructions')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching payment settings:', error);
      throw error;
    }

    // Return default settings if none exist
    const defaultSettings = {
      paypal_email: 'payments@rpmgenuineautoparts.info',
      bank_name: 'Barclays Bank UK',
      account_holder_name: 'RPM Genuine Auto Parts Ltd',
      account_number: '12345678',
      sort_code: '20-00-00',
      swift_code: 'BARCGB22',
      bank_address: '1 Churchill Place, London E14 5HP, UK',
      payment_instructions: 'Please include your order number as payment reference. For bank transfers, allow 1-2 business days for processing.'
    };

    return NextResponse.json({ 
      settings: settings || defaultSettings 
    });

  } catch (error: any) {
    console.error('Error in payment settings GET:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment settings: ' + error.message },
      { status: 500 }
    );
  }
}