import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url_value: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
      service_key_value: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set',
      anon_key_value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
    };

    return NextResponse.json({
      success: true,
      environment: envCheck
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: 'Environment check failed: ' + error.message },
      { status: 500 }
    );
  }
}