import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Basic connection test
    console.log('Test 1: Basic connection');
    const { data: basicTest, error: basicError } = await supabase
      .from('parts')
      .select('id')
      .limit(1);
    
    console.log('Basic test result:', { data: basicTest, error: basicError });
    
    // Test 2: Count test
    console.log('Test 2: Count test');
    const { count, error: countError } = await supabase
      .from('parts')
      .select('*', { count: 'exact', head: true });
    
    console.log('Count test result:', { count, error: countError });
    
    // Test 3: Full fetch test
    console.log('Test 3: Full fetch test');
    const { data: fullData, error: fullError } = await supabase
      .from('parts')
      .select('*')
      .limit(10);
    
    console.log('Full fetch result:', { 
      dataLength: fullData?.length, 
      error: fullError,
      sampleProduct: fullData?.[0]?.name 
    });
    
    return NextResponse.json({
      success: true,
      tests: {
        basicConnection: { data: !!basicTest, error: basicError },
        count: { count, error: countError },
        fullFetch: { dataLength: fullData?.length, error: fullError }
      },
      message: 'All connection tests completed'
    });
    
  } catch (error: any) {
    console.error('Test error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      message: error.message
    });
  }
}