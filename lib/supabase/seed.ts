import { supabase } from './client';import { supabase } from './client';



export async function seedData() {export async function seedData() {

  try {  try {

    console.log('Starting to seed database...');    console.log('Starting to seed database...');

    

    // Clear existing data        

    console.log('Clearing existing parts...');

    const { error: deleteError } = await supabase    // Clear existing products first    // Clear existing products first

      .from('parts')

      .delete()    const { error: deleteError } = await supabase    const { error: deleteError } = await supabase

      .neq('id', 0);

          .from('parts')      .from('parts')

    if (deleteError && deleteError.code !== 'PGRST116') {

      console.error('Error clearing parts:', deleteError);      .delete()      .delete()

      return;

    }      .neq('id', 0);      .neq('id', 0);

    

    console.log('Existing parts cleared.');            

    

    // Sample products data    if (deleteError) {    if (deleteError) {

    const products = [

      // Engine Parts      console.log('Note: Could not clear existing parts:', deleteError.message);      console.log('Note: Could not clear existing parts:', deleteError.message);

      { name: 'Spark Plugs Set', category: 'Engine Parts', price: 45.99, description: 'High-performance spark plugs for optimal ignition.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b069d?w=400' },

      { name: 'Engine Oil Filter', category: 'Engine Parts', price: 12.99, description: 'Premium oil filter for engine protection.', image_url: 'https://images.unsplash.com/photo-1632823469636-538c0fac0b3b?w=400' },    }    }

      { name: 'Air Filter', category: 'Engine Parts', price: 19.99, description: 'High-flow air filter for improved performance.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },

      { name: 'Timing Belt', category: 'Engine Parts', price: 89.99, description: 'Durable timing belt for precise engine timing.', image_url: 'https://images.unsplash.com/photo-1606016284894-15f4bbbc8a7c?w=400' },

      { name: 'Radiator', category: 'Engine Parts', price: 159.99, description: 'Aluminum radiator for efficient cooling.', image_url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400' },

          // Sample products with categories    // Sample products with categories

      // Brake System

      { name: 'Brake Pads Front', category: 'Brake System', price: 65.99, description: 'Ceramic brake pads for superior stopping power.', image_url: 'https://images.unsplash.com/photo-1609981204061-5d7b84e6a2f6?w=400' },    const products = [    const products = [

      { name: 'Brake Discs Rear', category: 'Brake System', price: 89.99, description: 'Ventilated brake discs for consistent performance.', image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400' },

      { name: 'Brake Fluid', category: 'Brake System', price: 15.99, description: 'DOT 4 brake fluid for reliable braking.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b069d?w=400' },      { name: 'High Performance Air Filter', category: 'Engine Parts', price: 38.99, description: 'Premium cotton air filter for improved airflow and engine performance.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=1' },      { name: 'High Performance Air Filter', category: 'Engine Parts', price: 38.99, description: 'Premium cotton air filter for improved airflow and engine performance.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=1' },

      { name: 'Brake Lines Kit', category: 'Brake System', price: 75.99, description: 'Stainless steel brake lines for improved feel.', image_url: 'https://images.unsplash.com/photo-1632823469636-538c0fac0b3b?w=400' },

            { name: 'Spark Plug Set (4-Pack)', category: 'Engine Parts', price: 27.50, description: 'Iridium spark plugs for enhanced ignition and fuel efficiency.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=2' },      { name: 'Spark Plug Set (4-Pack)', category: 'Engine Parts', price: 27.50, description: 'Iridium spark plugs for enhanced ignition and fuel efficiency.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=2' },

      // Suspension

      { name: 'Shock Absorbers Front', category: 'Suspension', price: 125.99, description: 'Gas-filled shock absorbers for smooth ride.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },      { name: 'Engine Oil Filter', category: 'Engine Parts', price: 10.99, description: 'OEM-quality oil filter for optimal engine protection.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=3' },      { name: 'Engine Oil Filter', category: 'Engine Parts', price: 10.99, description: 'OEM-quality oil filter for optimal engine protection.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=3' },

      { name: 'Coil Springs', category: 'Suspension', price: 95.99, description: 'Progressive rate coil springs for handling.', image_url: 'https://images.unsplash.com/photo-1606016284894-15f4bbbc8a7c?w=400' },

      { name: 'Sway Bar Links', category: 'Suspension', price: 35.99, description: 'Heavy-duty sway bar links for stability.', image_url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400' },      { name: 'Timing Belt Kit', category: 'Engine Parts', price: 159.99, description: 'Complete timing belt replacement kit with tensioner and pulleys.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=4' },      { name: 'Timing Belt Kit', category: 'Engine Parts', price: 159.99, description: 'Complete timing belt replacement kit with tensioner and pulleys.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=4' },

      { name: 'Ball Joints', category: 'Suspension', price: 55.99, description: 'Precision ball joints for steering control.', image_url: 'https://images.unsplash.com/photo-1609981204061-5d7b84e6a2f6?w=400' },

            { name: 'Fuel Injector Set', category: 'Engine Parts', price: 235.00, description: 'Professional-grade fuel injectors for improved fuel delivery.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=5' },      { name: 'Fuel Injector Set', category: 'Engine Parts', price: 235.00, description: 'Professional-grade fuel injectors for improved fuel delivery.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=5' },

      // Electrical

      { name: 'Alternator', category: 'Electrical', price: 185.99, description: 'High-output alternator for reliable charging.', image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400' },      { name: 'Turbocharger', category: 'Engine Parts', price: 1249.99, description: 'High-performance turbocharger for increased power output.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=6' },      { name: 'Turbocharger', category: 'Engine Parts', price: 1249.99, description: 'High-performance turbocharger for increased power output.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=6' },

      { name: 'Car Battery', category: 'Electrical', price: 129.99, description: 'Maintenance-free car battery with warranty.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b069d?w=400' },

      { name: 'LED Headlight Bulbs', category: 'Electrical', price: 79.99, description: 'Bright LED headlight bulbs for visibility.', image_url: 'https://images.unsplash.com/photo-1632823469636-538c0fac0b3b?w=400' },            

      { name: 'Ignition Coil', category: 'Electrical', price: 89.99, description: 'High-performance ignition coil for spark.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },

            { name: 'Ceramic Brake Pads Front', category: 'Brake System', price: 76.99, description: 'Low-dust ceramic brake pads for superior stopping power.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=7' },      { name: 'Ceramic Brake Pads Front', category: 'Brake System', price: 76.99, description: 'Low-dust ceramic brake pads for superior stopping power.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=7' },

      // Body Parts

      { name: 'Side Mirror Left', category: 'Body Parts', price: 65.99, description: 'Power-adjustable side mirror with heating.', image_url: 'https://images.unsplash.com/photo-1606016284894-15f4bbbc8a7c?w=400' },      { name: 'Brake Rotor Set (2-Pack)', category: 'Brake System', price: 133.00, description: 'Vented brake rotors for enhanced heat dissipation.', image_url: 'https://images.unsplash.com/photo-1582996542635-e48f80a3e5ab?w=400&h=300&fit=crop&random=8' },      { name: 'Brake Rotor Set (2-Pack)', category: 'Brake System', price: 133.00, description: 'Vented brake rotors for enhanced heat dissipation.', image_url: 'https://images.unsplash.com/photo-1582996542635-e48f80a3e5ab?w=400&h=300&fit=crop&random=8' },

      { name: 'Bumper Cover Front', category: 'Body Parts', price: 199.99, description: 'OEM-style front bumper cover.', image_url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400' },

      { name: 'Door Handle Set', category: 'Body Parts', price: 45.99, description: 'Chrome door handle set for style.', image_url: 'https://images.unsplash.com/photo-1609981204061-5d7b84e6a2f6?w=400' },      { name: 'Brake Fluid DOT 4', category: 'Brake System', price: 7.99, description: 'High-performance brake fluid for all weather conditions.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=9' },      { name: 'Brake Fluid DOT 4', category: 'Brake System', price: 7.99, description: 'High-performance brake fluid for all weather conditions.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=9' },

      { name: 'Taillight Assembly', category: 'Body Parts', price: 85.99, description: 'LED taillight assembly for safety.', image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400' },

            { name: 'Brake Caliper Rebuild Kit', category: 'Brake System', price: 36.50, description: 'Complete rebuild kit with seals and hardware.', image_url: 'https://images.unsplash.com/photo-1582996542635-e48f80a3e5ab?w=400&h=300&fit=crop&random=10' },      { name: 'Brake Caliper Rebuild Kit', category: 'Brake System', price: 36.50, description: 'Complete rebuild kit with seals and hardware.', image_url: 'https://images.unsplash.com/photo-1582996542635-e48f80a3e5ab?w=400&h=300&fit=crop&random=10' },

      // Interior

      { name: 'Floor Mats Set', category: 'Interior', price: 39.99, description: 'All-weather floor mats for protection.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b069d?w=400' },      { name: 'Anti-Lock Brake Sensor', category: 'Brake System', price: 67.99, description: 'ABS wheel speed sensor for precise brake control.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=11' },      { name: 'Anti-Lock Brake Sensor', category: 'Brake System', price: 67.99, description: 'ABS wheel speed sensor for precise brake control.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=11' },

      { name: 'Seat Covers', category: 'Interior', price: 125.99, description: 'Leather-style seat covers for comfort.', image_url: 'https://images.unsplash.com/photo-1632823469636-538c0fac0b3b?w=400' },

      { name: 'Steering Wheel Cover', category: 'Interior', price: 25.99, description: 'Ergonomic steering wheel cover.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },      { name: 'Performance Brake Lines', category: 'Brake System', price: 55.50, description: 'Stainless steel braided brake lines for improved pedal feel.', image_url: 'https://images.unsplash.com/photo-1582996542635-e48f80a3e5ab?w=400&h=300&fit=crop&random=12' },      { name: 'Performance Brake Lines', category: 'Brake System', price: 55.50, description: 'Stainless steel braided brake lines for improved pedal feel.', image_url: 'https://images.unsplash.com/photo-1582996542635-e48f80a3e5ab?w=400&h=300&fit=crop&random=12' },

      { name: 'Dashboard Trim Kit', category: 'Interior', price: 75.99, description: 'Carbon fiber dashboard trim kit.', image_url: 'https://images.unsplash.com/photo-1606016284894-15f4bbbc8a7c?w=400' },

                  

      // Exhaust

      { name: 'Muffler', category: 'Exhaust', price: 89.99, description: 'Performance muffler for better sound.', image_url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400' },      { name: 'Shock Absorber Set', category: 'Suspension', price: 209.99, description: 'Gas-filled shock absorbers for smooth ride comfort.', image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop&random=13' },      { name: 'Shock Absorber Set', category: 'Suspension', price: 209.99, description: 'Gas-filled shock absorbers for smooth ride comfort.', image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop&random=13' },

      { name: 'Catalytic Converter', category: 'Exhaust', price: 299.99, description: 'High-flow catalytic converter.', image_url: 'https://images.unsplash.com/photo-1609981204061-5d7b84e6a2f6?w=400' },

      { name: 'Exhaust Pipe', category: 'Exhaust', price: 65.99, description: 'Stainless steel exhaust pipe.', image_url: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400' },      { name: 'Coil Spring Pair', category: 'Suspension', price: 107.99, description: 'Heavy-duty coil springs for load support and stability.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=14' },      { name: 'Coil Spring Pair', category: 'Suspension', price: 107.99, description: 'Heavy-duty coil springs for load support and stability.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=14' },

      { name: 'Exhaust Tip', category: 'Exhaust', price: 35.99, description: 'Chrome exhaust tip for style.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b069d?w=400' },

            { name: 'Sway Bar Links', category: 'Suspension', price: 29.99, description: 'Stabilizer bar end links for reduced body roll.', image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop&random=15' },      { name: 'Sway Bar Links', category: 'Suspension', price: 29.99, description: 'Stabilizer bar end links for reduced body roll.', image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop&random=15' },

      // Filters

      { name: 'Cabin Air Filter', category: 'Filters', price: 18.99, description: 'HEPA cabin air filter for clean air.', image_url: 'https://images.unsplash.com/photo-1632823469636-538c0fac0b3b?w=400' },      { name: 'Control Arm Bushing Kit', category: 'Suspension', price: 57.50, description: 'Polyurethane bushings for precise handling.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=16' },      { name: 'Control Arm Bushing Kit', category: 'Suspension', price: 57.50, description: 'Polyurethane bushings for precise handling.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=16' },

      { name: 'Fuel Filter', category: 'Filters', price: 22.99, description: 'Inline fuel filter for clean fuel.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },

      { name: 'Transmission Filter', category: 'Filters', price: 29.99, description: 'Transmission filter with gasket.', image_url: 'https://images.unsplash.com/photo-1606016284894-15f4bbbc8a7c?w=400' },      { name: 'Air Suspension Compressor', category: 'Suspension', price: 334.99, description: 'OEM replacement air suspension compressor.', image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop&random=17' },      { name: 'Air Suspension Compressor', category: 'Suspension', price: 334.99, description: 'OEM replacement air suspension compressor.', image_url: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=300&fit=crop&random=17' },

      { name: 'Breather Filter', category: 'Filters', price: 9.99, description: 'Crankcase breather filter for emission control.', image_url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400' }

    ];      { name: 'Strut Mount Assembly', category: 'Suspension', price: 72.50, description: 'Complete strut mount with bearing assembly.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=18' },      { name: 'Strut Mount Assembly', category: 'Suspension', price: 72.50, description: 'Complete strut mount with bearing assembly.', image_url: 'https://images.unsplash.com/photo-1625328303518-8d84a7d60d73?w=400&h=300&fit=crop&random=18' },

    

    console.log(`Seeding ${products.length} products...`);            

    

    // Insert products in batches      { name: 'Car Battery 12V', category: 'Electrical', price: 110.99, description: 'Maintenance-free lead-acid battery with 3-year warranty.', image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&random=19' },      { name: 'Car Battery 12V', category: 'Electrical', price: 110.99, description: 'Maintenance-free lead-acid battery with 3-year warranty.', image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&random=19' },

    const batchSize = 10;

    for (let i = 0; i < products.length; i += batchSize) {      { name: 'Alternator 140A', category: 'Electrical', price: 169.99, description: 'High-output alternator for reliable charging system.', image_url: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&h=300&fit=crop&random=20' },      { name: 'Alternator 140A', category: 'Electrical', price: 169.99, description: 'High-output alternator for reliable charging system.', image_url: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&h=300&fit=crop&random=20' },

      const batch = products.slice(i, i + batchSize);

            { name: 'LED Headlight Bulbs', category: 'Electrical', price: 56.99, description: 'Bright LED headlight conversion kit with cooling fan.', image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&random=21' },      { name: 'LED Headlight Bulbs', category: 'Electrical', price: 56.99, description: 'Bright LED headlight conversion kit with cooling fan.', image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&random=21' },

      const { data, error } = await supabase

        .from('parts')      { name: 'Window Motor Assembly', category: 'Electrical', price: 74.99, description: 'Power window motor with regulator assembly.', image_url: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&h=300&fit=crop&random=22' },      { name: 'Window Motor Assembly', category: 'Electrical', price: 74.99, description: 'Power window motor with regulator assembly.', image_url: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&h=300&fit=crop&random=22' },

        .insert(batch);

            { name: 'Ignition Coil Pack', category: 'Electrical', price: 46.99, description: 'Direct-fit ignition coil for reliable engine starting.', image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&random=23' },      { name: 'Ignition Coil Pack', category: 'Electrical', price: 46.99, description: 'Direct-fit ignition coil for reliable engine starting.', image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&random=23' },

      if (error) {

        console.error(`Error inserting batch ${i/batchSize + 1}:`, error);      { name: 'Starter Motor', category: 'Electrical', price: 152.99, description: 'High-torque starter motor for reliable engine cranking.', image_url: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&h=300&fit=crop&random=24' },      { name: 'Starter Motor', category: 'Electrical', price: 152.99, description: 'High-torque starter motor for reliable engine cranking.', image_url: 'https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&h=300&fit=crop&random=24' },

        throw error;

      }      { name: 'Wiring Harness', category: 'Electrical', price: 124.50, description: 'OEM replacement wiring harness for electrical connections.', image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&random=25' },      { name: 'Wiring Harness', category: 'Electrical', price: 124.50, description: 'OEM replacement wiring harness for electrical connections.', image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop&random=25' },

      

      // Add delay between batches to avoid rate limits            

      await new Promise(resolve => setTimeout(resolve, 100));

            { name: 'Front Bumper Cover', category: 'Body Parts', price: 189.99, description: 'OEM-style front bumper cover with fog light openings.', image_url: 'https://images.unsplash.com/photo-1627634377411-8da5f4f09cd8?w=400&h=300&fit=crop&random=26' },      { name: 'Front Bumper Cover', category: 'Body Parts', price: 189.99, description: 'OEM-style front bumper cover with fog light openings.', image_url: 'https://images.unsplash.com/photo-1627634377411-8da5f4f09cd8?w=400&h=300&fit=crop&random=26' },

      console.log(`Inserted batch ${i/batchSize + 1} of ${Math.ceil(products.length/batchSize)}`);

    }      { name: 'Side Mirror Assembly', category: 'Body Parts', price: 87.50, description: 'Complete side mirror with heating and indicator.', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&random=27' },      { name: 'Side Mirror Assembly', category: 'Body Parts', price: 87.50, description: 'Complete side mirror with heating and indicator.', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&random=27' },

    

    console.log(`Successfully seeded ${products.length} products!`);      { name: 'Rear Spoiler', category: 'Body Parts', price: 145.99, description: 'ABS plastic rear spoiler for improved aerodynamics.', image_url: 'https://images.unsplash.com/photo-1627634377411-8da5f4f09cd8?w=400&h=300&fit=crop&random=28' },      { name: 'Rear Spoiler', category: 'Body Parts', price: 145.99, description: 'ABS plastic rear spoiler for improved aerodynamics.', image_url: 'https://images.unsplash.com/photo-1627634377411-8da5f4f09cd8?w=400&h=300&fit=crop&random=28' },

    

    const categories = ['Engine Parts', 'Brake System', 'Suspension', 'Electrical', 'Body Parts', 'Interior', 'Exhaust', 'Filters'];      { name: 'Door Handle Set', category: 'Body Parts', price: 42.99, description: 'Chrome door handle set for enhanced exterior styling.', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&random=29' },      { name: 'Door Handle Set', category: 'Body Parts', price: 42.99, description: 'Chrome door handle set for enhanced exterior styling.', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&random=29' },

    console.log('\nProducts by category:');

    categories.forEach(cat => {      { name: 'Front Grille', category: 'Body Parts', price: 124.99, description: 'Black mesh front grille for aggressive styling.', image_url: 'https://images.unsplash.com/photo-1627634377411-8da5f4f09cd8?w=400&h=300&fit=crop&random=30' },      { name: 'Front Grille', category: 'Body Parts', price: 124.99, description: 'Black mesh front grille for aggressive styling.', image_url: 'https://images.unsplash.com/photo-1627634377411-8da5f4f09cd8?w=400&h=300&fit=crop&random=30' },

      const count = products.filter(p => p.category === cat).length;

      console.log(`  ${cat}: ${count} products`);      { name: 'Side Skirts', category: 'Body Parts', price: 167.50, description: 'Fiberglass side skirts for sport appearance.', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&random=31' },      { name: 'Side Skirts', category: 'Body Parts', price: 167.50, description: 'Fiberglass side skirts for sport appearance.', image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop&random=31' },

    });

          { name: 'Tail Light Assembly', category: 'Body Parts', price: 95.99, description: 'LED tail light assembly with dynamic indicators.', image_url: 'https://images.unsplash.com/photo-1627634377411-8da5f4f09cd8?w=400&h=300&fit=crop&random=32' },      { name: 'Tail Light Assembly', category: 'Body Parts', price: 95.99, description: 'LED tail light assembly with dynamic indicators.', image_url: 'https://images.unsplash.com/photo-1627634377411-8da5f4f09cd8?w=400&h=300&fit=crop&random=32' },

    console.log('\n✅ Database seeding completed successfully!');

                

  } catch (error) {

    console.error('❌ Error seeding database:', error);      { name: 'Leather Seat Covers', category: 'Interior', price: 78.99, description: 'Premium leather seat covers with custom fit.', image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&random=33' },      { name: 'Leather Seat Covers', category: 'Interior', price: 78.99, description: 'Premium leather seat covers with custom fit.', image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&random=33' },

    throw error;

  }      { name: 'All-Weather Floor Mats', category: 'Interior', price: 34.99, description: 'Heavy-duty rubber floor mats for year-round protection.', image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop&random=34' },      { name: 'All-Weather Floor Mats', category: 'Interior', price: 34.99, description: 'Heavy-duty rubber floor mats for year-round protection.', image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop&random=34' },

}

      { name: 'Steering Wheel Cover', category: 'Interior', price: 19.99, description: 'Ergonomic steering wheel cover for improved grip.', image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&random=35' },      { name: 'Steering Wheel Cover', category: 'Interior', price: 19.99, description: 'Ergonomic steering wheel cover for improved grip.', image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&random=35' },

// Run if called directly

if (require.main === module) {      { name: 'Gear Shift Knob', category: 'Interior', price: 28.50, description: 'Weighted aluminium gear shift knob for precise shifts.', image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop&random=36' },      { name: 'Gear Shift Knob', category: 'Interior', price: 28.50, description: 'Weighted aluminium gear shift knob for precise shifts.', image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop&random=36' },

  seedData().then(() => process.exit(0));

}      { name: 'Cup Holder Insert', category: 'Interior', price: 15.99, description: 'Replacement cup holder insert with anti-slip coating.', image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&random=37' },      { name: 'Cup Holder Insert', category: 'Interior', price: 15.99, description: 'Replacement cup holder insert with anti-slip coating.', image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&random=37' },



export { seedData as seedProducts };      { name: 'Centre Console Organizer', category: 'Interior', price: 24.99, description: 'Multi-compartment console organizer for storage.', image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop&random=38' },      { name: 'Centre Console Organizer', category: 'Interior', price: 24.99, description: 'Multi-compartment console organizer for storage.', image_url: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop&random=38' },

      { name: 'Sunroof Switch', category: 'Interior', price: 45.99, description: 'OEM replacement sunroof control switch.', image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&random=39' },      { name: 'Sunroof Switch', category: 'Interior', price: 45.99, description: 'OEM replacement sunroof control switch.', image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&random=39' },

            

      { name: 'Performance Exhaust System', category: 'Exhaust', price: 299.99, description: 'Cat-back exhaust system for improved sound and performance.', image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop&random=40' },      { name: 'Performance Exhaust System', category: 'Exhaust', price: 299.99, description: 'Cat-back exhaust system for improved sound and performance.', image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop&random=40' },

      { name: 'Catalytic Converter', category: 'Exhaust', price: 234.99, description: 'High-flow catalytic converter meeting Euro 6 standards.', image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&random=41' },      { name: 'Catalytic Converter', category: 'Exhaust', price: 234.99, description: 'High-flow catalytic converter meeting Euro 6 standards.', image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&random=41' },

      { name: 'Exhaust Tips Pair', category: 'Exhaust', price: 45.99, description: 'Stainless steel exhaust tips for enhanced appearance.', image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop&random=42' },      { name: 'Exhaust Tips Pair', category: 'Exhaust', price: 45.99, description: 'Stainless steel exhaust tips for enhanced appearance.', image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop&random=42' },

      { name: 'Manifold Gasket Set', category: 'Exhaust', price: 18.50, description: 'Complete manifold gasket set for leak-free sealing.', image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&random=43' },      { name: 'Manifold Gasket Set', category: 'Exhaust', price: 18.50, description: 'Complete manifold gasket set for leak-free sealing.', image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&random=43' },

      { name: 'Resonator Delete Pipe', category: 'Exhaust', price: 67.99, description: 'Straight-through pipe for enhanced exhaust note.', image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop&random=44' },      { name: 'Resonator Delete Pipe', category: 'Exhaust', price: 67.99, description: 'Straight-through pipe for enhanced exhaust note.', image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop&random=44' },

      { name: 'Exhaust Clamp Set', category: 'Exhaust', price: 12.99, description: 'Stainless steel clamp set for secure connections.', image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&random=45' },      { name: 'Exhaust Clamp Set', category: 'Exhaust', price: 12.99, description: 'Stainless steel clamp set for secure connections.', image_url: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=400&h=300&fit=crop&random=45' },

      { name: 'Heat Shield', category: 'Exhaust', price: 32.99, description: 'Thermal barrier heat shield for exhaust components.', image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop&random=46' },      { name: 'Heat Shield', category: 'Exhaust', price: 32.99, description: 'Thermal barrier heat shield for exhaust components.', image_url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop&random=46' },

            

      { name: 'Engine Oil Filter', category: 'Filters', price: 8.99, description: 'High-efficiency oil filter for extended engine life.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=47' },      { name: 'Engine Oil Filter', category: 'Filters', price: 8.99, description: 'High-efficiency oil filter for extended engine life.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=47' },

      { name: 'Cabin Air Filter', category: 'Filters', price: 14.99, description: 'HEPA cabin air filter for clean interior air.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=48' },      { name: 'Cabin Air Filter', category: 'Filters', price: 14.99, description: 'HEPA cabin air filter for clean interior air.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=48' },

      { name: 'Fuel Filter', category: 'Filters', price: 16.50, description: 'Inline fuel filter for clean fuel delivery.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=49' },      { name: 'Fuel Filter', category: 'Filters', price: 16.50, description: 'Inline fuel filter for clean fuel delivery.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=49' },

      { name: 'Transmission Filter Kit', category: 'Filters', price: 24.99, description: 'Complete transmission filter and gasket kit.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=50' },      { name: 'Transmission Filter Kit', category: 'Filters', price: 24.99, description: 'Complete transmission filter and gasket kit.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=50' },

      { name: 'Hydraulic Filter', category: 'Filters', price: 21.99, description: 'Power steering hydraulic filter for smooth operation.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=51' },      { name: 'Hydraulic Filter', category: 'Filters', price: 21.99, description: 'Power steering hydraulic filter for smooth operation.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=51' },

      { name: 'Coolant Filter', category: 'Filters', price: 11.50, description: 'Engine coolant filter for clean cooling system.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=52' },      { name: 'Coolant Filter', category: 'Filters', price: 11.50, description: 'Engine coolant filter for clean cooling system.', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&random=52' },

      { name: 'Breather Filter', category: 'Filters', price: 9.99, description: 'Crankcase breather filter for emission control.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=53' }      { name: 'Breather Filter', category: 'Filters', price: 9.99, description: 'Crankcase breather filter for emission control.', image_url: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop&random=53' }

    ];    ];



    // Insert products in batches    // Insert products in batches

    const batchSize = 10;    const batchSize = 10;

    for (let i = 0; i < products.length; i += batchSize) {    for (let i = 0; i < products.length; i += batchSize) {

      const batch = products.slice(i, i + batchSize);      const batch = products.slice(i, i + batchSize);

            

      const { data, error } = await supabase      const { data, error } = await supabase

        .from('parts')        .from('parts')

        .insert(batch);        .insert(batch);



      if (error) {      if (error) {

        console.error(`Error inserting batch ${i/batchSize + 1}:`, error);        console.error(Error inserting batch :, error);

        throw error;        throw error;

      }      }

            

      console.log(`Inserted batch ${i/batchSize + 1} of ${Math.ceil(products.length/batchSize)}`);      console.log(Inserted batch  of );

    }    }



    console.log(`Successfully seeded ${products.length} products!`);    console.log(Successfully seeded  products!);

    const categories = ['Engine Parts', 'Brake System', 'Suspension', 'Electrical', 'Body Parts', 'Interior', 'Exhaust', 'Filters'];    const categories = ['Engine Parts', 'Brake System', 'Suspension', 'Electrical', 'Body Parts', 'Interior', 'Exhaust', 'Filters'];

    categories.forEach(cat => {    categories.forEach(cat => {

      const count = products.filter(p => p.category === cat).length;      const count = products.filter(p => p.category === cat).length;

      console.log(`  ${cat}: ${count} products`);      console.log(  :  products);

    });    });

        

  } catch (error) {  } catch (error) {

    console.error('Error seeding database:', error);    console.error('Error seeding database:', error);

    throw error;    throw error;

  }  }

}}



export { seedData as seedProducts };export { seedData as seedProducts };
