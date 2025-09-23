import { supabase } from './client';

export async function seedData() {
  // Brands
  const brands = [
    { id: 1, name: 'Ford', country: 'USA', logo_url: '' },
    { id: 2, name: 'Toyota', country: 'Japan', logo_url: '' },
    { id: 3, name: 'Isuzu', country: 'Japan', logo_url: '' },
    { id: 4, name: 'Mitsubishi', country: 'Japan', logo_url: '' },
    { id: 5, name: 'Mazda', country: 'Japan', logo_url: '' },
    { id: 6, name: 'Honda', country: 'Japan', logo_url: '' },
    { id: 7, name: 'VW', country: 'Germany', logo_url: '' },
    { id: 8, name: 'Nissan', country: 'Japan', logo_url: '' },
    { id: 9, name: 'Hyundai', country: 'Korea', logo_url: '' },
    { id: 10, name: 'Kia', country: 'Korea', logo_url: '' },
    { id: 11, name: 'Renault', country: 'France', logo_url: '' },
    { id: 12, name: 'Peugeot', country: 'France', logo_url: '' },
    { id: 13, name: 'BMW', country: 'Germany', logo_url: '' },
    { id: 14, name: 'Mercedes-Benz', country: 'Germany', logo_url: '' },
    { id: 15, name: 'Audi', country: 'Germany', logo_url: '' },
    { id: 16, name: 'Porsche', country: 'Germany', logo_url: '' },
    { id: 17, name: 'Tesla', country: 'USA', logo_url: '' },
    { id: 18, name: 'BYD', country: 'China', logo_url: '' },
    { id: 19, name: 'MG', country: 'China', logo_url: '' },
  ];
  await supabase.from('brands').upsert(brands, { onConflict: 'id' });

  // Vehicles
  const vehicles = [
    // Trucks / Utes / Pickups
    { id: 1, brand_id: 1, model: 'F-Series', year_start: 2015, year_end: 2025, category: 'truck' },
    { id: 2, brand_id: 2, model: 'HiLux', year_start: 2010, year_end: 2025, category: 'truck' },
    { id: 3, brand_id: 1, model: 'Ranger', year_start: 2012, year_end: 2025, category: 'truck' },
    { id: 4, brand_id: 3, model: 'D-Max', year_start: 2010, year_end: 2025, category: 'truck' },
    { id: 5, brand_id: 4, model: 'Triton', year_start: 2010, year_end: 2025, category: 'truck' },
    { id: 6, brand_id: 5, model: 'BT-50', year_start: 2010, year_end: 2025, category: 'truck' },
    // SUVs / Crossovers
    { id: 7, brand_id: 2, model: 'RAV4', year_start: 2015, year_end: 2025, category: 'suv' },
    { id: 8, brand_id: 6, model: 'CR-V', year_start: 2012, year_end: 2025, category: 'suv' },
    { id: 9, brand_id: 7, model: 'T-Roc', year_start: 2018, year_end: 2025, category: 'suv' },
    { id: 10, brand_id: 7, model: 'Tiguan', year_start: 2016, year_end: 2025, category: 'suv' },
    { id: 11, brand_id: 8, model: 'Rogue', year_start: 2014, year_end: 2025, category: 'suv' },
    { id: 12, brand_id: 8, model: 'X-Trail', year_start: 2014, year_end: 2025, category: 'suv' },
    { id: 13, brand_id: 9, model: 'Tucson', year_start: 2015, year_end: 2025, category: 'suv' },
    { id: 14, brand_id: 10, model: 'Sportage', year_start: 2015, year_end: 2025, category: 'suv' },
    // Compact / Small Cars
    { id: 15, brand_id: 7, model: 'Golf', year_start: 2010, year_end: 2025, category: 'compact' },
    { id: 16, brand_id: 11, model: 'Clio', year_start: 2010, year_end: 2025, category: 'compact' },
    { id: 17, brand_id: 12, model: '208', year_start: 2012, year_end: 2025, category: 'compact' },
    { id: 18, brand_id: 2, model: 'Yaris', year_start: 2010, year_end: 2025, category: 'compact' },
    { id: 19, brand_id: 2, model: 'Yaris Cross', year_start: 2020, year_end: 2025, category: 'compact' },
    { id: 20, brand_id: 1, model: 'Fiesta', year_start: 2010, year_end: 2023, category: 'compact' },
    { id: 21, brand_id: 1, model: 'Focus', year_start: 2010, year_end: 2023, category: 'compact' },
    // Luxury / Premium
    { id: 22, brand_id: 13, model: '3-Series', year_start: 2010, year_end: 2025, category: 'luxury' },
    { id: 23, brand_id: 13, model: '5-Series', year_start: 2010, year_end: 2025, category: 'luxury' },
    { id: 24, brand_id: 13, model: 'X5', year_start: 2010, year_end: 2025, category: 'luxury' },
    { id: 25, brand_id: 14, model: 'C-Class', year_start: 2010, year_end: 2025, category: 'luxury' },
    { id: 26, brand_id: 14, model: 'E-Class', year_start: 2010, year_end: 2025, category: 'luxury' },
    { id: 27, brand_id: 14, model: 'GLC', year_start: 2015, year_end: 2025, category: 'luxury' },
    { id: 28, brand_id: 15, model: 'A3', year_start: 2010, year_end: 2025, category: 'luxury' },
    { id: 29, brand_id: 15, model: 'A4', year_start: 2010, year_end: 2025, category: 'luxury' },
    { id: 30, brand_id: 15, model: 'Q5', year_start: 2010, year_end: 2025, category: 'luxury' },
    { id: 31, brand_id: 16, model: 'Macan', year_start: 2014, year_end: 2025, category: 'luxury' },
    { id: 32, brand_id: 16, model: 'Cayenne', year_start: 2010, year_end: 2025, category: 'luxury' },
    // Electric / Hybrid
    { id: 33, brand_id: 17, model: 'Model 3', year_start: 2017, year_end: 2025, category: 'ev' },
    { id: 34, brand_id: 17, model: 'Model Y', year_start: 2020, year_end: 2025, category: 'ev' },
    { id: 35, brand_id: 2, model: 'Prius', year_start: 2010, year_end: 2025, category: 'ev' },
    { id: 36, brand_id: 2, model: 'Corolla Hybrid', year_start: 2018, year_end: 2025, category: 'ev' },
    { id: 37, brand_id: 2, model: 'RAV4 Hybrid', year_start: 2018, year_end: 2025, category: 'ev' },
    { id: 38, brand_id: 13, model: 'i3', year_start: 2013, year_end: 2022, category: 'ev' },
    { id: 39, brand_id: 13, model: 'iX', year_start: 2021, year_end: 2025, category: 'ev' },
    { id: 40, brand_id: 18, model: 'Atto 3', year_start: 2022, year_end: 2025, category: 'ev' },
    { id: 41, brand_id: 19, model: 'MG4 EV', year_start: 2022, year_end: 2025, category: 'ev' },
    { id: 42, brand_id: 8, model: 'Leaf', year_start: 2010, year_end: 2025, category: 'ev' },
  ];
  await supabase.from('vehicles').upsert(vehicles, { onConflict: 'id' });

  // Parts (sample for each category)
  const parts = [
    // Trucks
    { vehicle_id: 1, name: 'Suspension Kit', description: 'Heavy duty suspension kit for Ford F-Series', category: 'suspension', price: 1200, stock: 10, image_url: '' },
    { vehicle_id: 1, name: 'Air Filter', description: 'OEM air filter for Ford F-Series', category: 'filter', price: 40, stock: 50, image_url: '' },
    { vehicle_id: 2, name: 'Drivetrain Part', description: 'OEM drivetrain part for Toyota HiLux', category: 'drivetrain', price: 800, stock: 15, image_url: '' },
    { vehicle_id: 2, name: '4x4 Component', description: '4x4 off-road component for HiLux', category: '4x4', price: 950, stock: 8, image_url: '' },
    { vehicle_id: 3, name: 'Brake Kit', description: 'Performance brake kit for Ford Ranger', category: 'brake', price: 600, stock: 12, image_url: '' },
    { vehicle_id: 3, name: 'Turbocharger', description: 'Turbocharger for Ford Ranger', category: 'turbo', price: 1500, stock: 5, image_url: '' },
    { vehicle_id: 4, name: 'Clutch Kit', description: 'Clutch kit for Isuzu D-Max', category: 'clutch', price: 700, stock: 10, image_url: '' },
    { vehicle_id: 5, name: 'Leaf Spring', description: 'Leaf spring for Mitsubishi Triton', category: 'suspension', price: 350, stock: 20, image_url: '' },
    { vehicle_id: 6, name: 'Fuel Injector', description: 'Fuel injector for Mazda BT-50', category: 'fuel', price: 120, stock: 30, image_url: '' },
    // SUVs
    { vehicle_id: 7, name: 'Shock Absorber', description: 'Shock absorber for Toyota RAV4', category: 'suspension', price: 200, stock: 25, image_url: '' },
    { vehicle_id: 8, name: 'Brake Pad', description: 'Brake pad for Honda CR-V', category: 'brake', price: 90, stock: 40, image_url: '' },
    { vehicle_id: 9, name: 'Electronic Module', description: 'Electronics for VW T-Roc', category: 'electronics', price: 400, stock: 10, image_url: '' },
    { vehicle_id: 10, name: 'LED Headlight', description: 'LED headlight for VW Tiguan', category: 'lighting', price: 350, stock: 15, image_url: '' },
    { vehicle_id: 11, name: 'CV Axle', description: 'CV axle for Nissan Rogue', category: 'cv axle', price: 220, stock: 18, image_url: '' },
    { vehicle_id: 13, name: 'Ignition Coil', description: 'Ignition coil for Hyundai Tucson', category: 'ignition', price: 60, stock: 22, image_url: '' },
    // Compact
    { vehicle_id: 15, name: 'Turbocharger', description: 'Turbocharger for VW Golf', category: 'turbo', price: 1300, stock: 7, image_url: '' },
    { vehicle_id: 16, name: 'Clutch', description: 'Clutch for Renault Clio', category: 'clutch', price: 400, stock: 14, image_url: '' },
    { vehicle_id: 17, name: 'Injector', description: 'Injector for Peugeot 208', category: 'injector', price: 110, stock: 18, image_url: '' },
    { vehicle_id: 18, name: 'Hybrid Battery', description: 'Hybrid battery for Toyota Yaris', category: 'hybrid', price: 2500, stock: 3, image_url: '' },
    { vehicle_id: 20, name: 'Suspension Arm', description: 'Suspension arm for Ford Fiesta', category: 'suspension', price: 180, stock: 20, image_url: '' },
    // Luxury
    { vehicle_id: 22, name: 'Control Arm', description: 'Control arm for BMW 3-Series', category: 'suspension', price: 350, stock: 10, image_url: '' },
    { vehicle_id: 25, name: 'Air Suspension', description: 'Air suspension for Mercedes C-Class', category: 'suspension', price: 2200, stock: 4, image_url: '' },
    { vehicle_id: 28, name: 'Turbocharger', description: 'Turbocharger for Audi A3', category: 'turbo', price: 1400, stock: 6, image_url: '' },
    { vehicle_id: 31, name: 'Brake Kit', description: 'Performance brake kit for Porsche Macan', category: 'brake', price: 1800, stock: 2, image_url: '' },
    // EV/Hybrid
    { vehicle_id: 33, name: 'Charging Cable', description: 'Charging cable for Tesla Model 3', category: 'charging', price: 250, stock: 15, image_url: '' },
    { vehicle_id: 35, name: 'Hybrid Battery', description: 'Hybrid battery for Toyota Prius', category: 'hybrid', price: 3000, stock: 2, image_url: '' },
    { vehicle_id: 38, name: 'Charging Port', description: 'Charging port for BMW i3', category: 'charging', price: 500, stock: 5, image_url: '' },
    { vehicle_id: 40, name: 'EV Motor', description: 'EV motor for BYD Atto 3', category: 'ev motor', price: 3500, stock: 1, image_url: '' },
    { vehicle_id: 42, name: 'Inverter Part', description: 'Inverter part for Nissan Leaf', category: 'inverter', price: 900, stock: 3, image_url: '' },
  ];
  await supabase.from('parts').insert(parts);
}
