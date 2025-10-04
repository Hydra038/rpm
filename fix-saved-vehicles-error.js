require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAndFixSavedVehicles() {
  console.log('🔍 Checking saved_vehicles table status...\n');
  
  try {
    // Test if table exists
    const { data, error } = await supabase
      .from('saved_vehicles')
      .select('*')
      .limit(1);
      
    if (error && error.code === 'PGRST205') {
      console.log('❌ saved_vehicles table does not exist');
      console.log('📋 Table creation required in Supabase dashboard');
      
      console.log('\n🛠️  MANUAL SETUP REQUIRED:');
      console.log('============================================================');
      console.log('1. Go to Supabase Dashboard → SQL Editor');
      console.log('2. Run the contents of database-saved-vehicles.sql');
      console.log('3. Or copy this basic table creation:');
      console.log('');
      console.log('CREATE TABLE saved_vehicles (');
      console.log('  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,');
      console.log('  user_id UUID NOT NULL,');
      console.log('  vin VARCHAR(17) NOT NULL,');
      console.log('  nickname VARCHAR(100),');
      console.log('  vehicle_info JSONB,');
      console.log('  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone(\'utc\'::text, now()),');
      console.log('  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone(\'utc\'::text, now())');
      console.log(');');
      console.log('');
      console.log('ALTER TABLE saved_vehicles ENABLE ROW LEVEL SECURITY;');
      console.log('');
      console.log('CREATE POLICY "Users can access own vehicles" ON saved_vehicles');
      console.log('  USING (auth.uid() = user_id);');
      
    } else if (error) {
      console.log('❌ Other error accessing saved_vehicles:', error.message);
    } else {
      console.log('✅ saved_vehicles table exists and is accessible');
      console.log('   Current records:', data ? data.length : 0);
    }
    
    // Meanwhile, let's fix the VinLookup component to handle the missing table gracefully
    console.log('\n🔧 TEMPORARY FIX:');
    console.log('============================================================');
    console.log('Will update VinLookup component to handle missing table gracefully');
    
  } catch (err) {
    console.log('❌ Unexpected error:', err);
  }
}

checkAndFixSavedVehicles().catch(console.error);