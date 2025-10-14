# Fix Supabase Storage Upload Issues

## The Problem
Getting "new row violates row-level security policy" when uploading images to Supabase Storage.

## Multiple Solutions (Try in Order)

### Solution 1: Run the Updated SQL Script
Run the updated `setup-supabase-storage.sql` in your Supabase SQL Editor. This creates a permissive policy for the product-images bucket.

### Solution 2: Manual Bucket Setup via Dashboard
1. Go to Supabase Dashboard → Storage
2. Create bucket named `product-images`
3. Make it **Public**
4. Go to Storage → Policies
5. Create a new policy:
   - **Policy name**: `Allow all operations on product-images`
   - **Allowed operation**: `All`
   - **Target roles**: `public`
   - **Policy definition**: `bucket_id = 'product-images'`

### Solution 3: Environment Variable Check
Make sure your `.env.local` file has:
```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

The service role key should start with `eyJ` and be much longer than the anon key.

### Solution 4: Alternative Upload API (Bypass RLS completely)
If the above doesn't work, I can create a version that uploads using the service role bypass method.

### Solution 5: Temporary RLS Disable
As a last resort, you can temporarily disable RLS on storage.objects:
```sql
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

## How to Test
1. Try uploading an image through the admin dashboard
2. Check the console for debug messages showing:
   - "Upload API called with admin client"
   - "Service role key available: true"
   - Any detailed error messages

## Expected Result
- Successful image upload
- Public URL returned
- Image accessible via the URL
- No RLS policy violations

Let me know which solution works or if you need me to implement Solution 4!