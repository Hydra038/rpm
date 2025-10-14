# Order Access Diagnosis

## Current Issue
Existing orders in database are not visible in admin dashboard due to RLS policies.

## Diagnostic Steps

### 1. **CRITICAL - Run RLS Fix Script**
You MUST run the `fix-account-orders.sql` script in your Supabase SQL Editor first:

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste the entire contents of `fix-account-orders.sql`
3. Click "Run" to execute the script
4. This will fix RLS policies blocking order access

### 2. **Check Environment Variables**
Ensure your `.env.local` has the service role key:
```
SUPABASE_SERVICE_ROLE_KEY=eyJ... (your actual service role key)
```

### 3. **Test Admin Dashboard**
After running the SQL script:
1. Go to admin dashboard (`/admin`)
2. Click "View Orders" 
3. Check browser console for debug messages
4. Should see existing orders displayed

### 4. **Expected Debug Output**
You should see console messages like:
```
=== ADMIN ORDERS DEBUG ===
Service role key available: true
Using key type: service_role
Total orders count: X
Basic orders fetch: { found: X, error: null }
Final orders query result: { ordersFound: X, error: null }
```

### 5. **If Still No Orders Visible**
Check these possibilities:
- Service role key not configured properly
- RLS policies still blocking access
- Orders exist but in different format than expected
- Foreign key relationships broken

## Quick Test Query
You can also test directly in Supabase SQL Editor:
```sql
-- Check if orders exist
SELECT COUNT(*) as total_orders FROM orders;

-- Check order structure
SELECT id, user_id, status, created_at, total_amount 
FROM orders 
LIMIT 5;

-- Check order items
SELECT oi.*, p.name as product_name 
FROM order_items oi 
LEFT JOIN parts p ON oi.part_id = p.id 
LIMIT 5;
```

The main issue is almost certainly RLS policies blocking access - run the SQL script first!