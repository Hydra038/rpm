# 🔑 Supabase API Keys Setup Guide

## ❌ Current Issue
Your API keys are invalid or expired, causing "Invalid API key" errors.

## ✅ How to Fix

### Step 1: Get Your API Keys
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `mhfdvmeaipmuowjujyrc`
3. Go to **Settings** → **API**
4. Copy both keys:
   - **anon public** key
   - **service_role** key (⚠️ Keep this secret!)

### Step 2: Update .env.local
Replace the placeholder keys in your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://mhfdvmeaipmuowjujyrc.supabase.co

# Replace with your actual anon key from Supabase Dashboard
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here

# Replace with your actual service role key from Supabase Dashboard
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

### Step 3: Restart Development Server
```bash
npm run dev
```

## 🔍 Test Your Setup
Visit: http://localhost:3000/api/env-test

## 🚨 Security Notes
- Never commit the service_role key to Git
- The .env.local file is already in .gitignore
- Service role key bypasses all security rules

## 📞 Need Help?
If you can't find your keys, you can regenerate them in the Supabase Dashboard under Settings → API.