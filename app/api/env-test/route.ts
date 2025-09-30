import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const envStatus = {
      supabaseUrl: !!supabaseUrl,
      serviceRoleKey: !!serviceRoleKey,
      anonKey: !!anonKey,
      hasAnyKey: !!(serviceRoleKey || anonKey)
    };

    if (!supabaseUrl || !envStatus.hasAnyKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing environment variables',
        envStatus,
        instructions: [
          '1. Check your .env.local file',
          '2. Ensure NEXT_PUBLIC_SUPABASE_URL is set',
          '3. Ensure either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY is set',
          '4. Restart your development server after adding environment variables'
        ]
      });
    }

    // Test database connection
    const supabase = createClient(
      supabaseUrl,
      serviceRoleKey || anonKey!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Test basic connection
    const { data, error } = await supabase
      .from('parts')
      .select('id')
      .limit(1);

    const connectionTest = {
      connected: !error,
      error: error?.message,
      keyType: serviceRoleKey ? 'service_role' : 'anon'
    };

    // Test order creation capability (check if orders table exists)
    const { data: ordersTest, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    const ordersTableTest = {
      exists: !ordersError,
      error: ordersError?.message
    };

    return NextResponse.json({
      success: true,
      message: 'Environment and database connection test',
      envStatus,
      connectionTest,
      ordersTableTest,
      recommendations: !serviceRoleKey ? [
        'Consider adding SUPABASE_SERVICE_ROLE_KEY for better order creation capabilities',
        'Service role key allows bypassing RLS policies for server-side operations'
      ] : []
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      message: error.message
    });
  }
}