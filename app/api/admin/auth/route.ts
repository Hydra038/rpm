import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Create server-side Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Regular client for user verification
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// This endpoint will be used to check if a user is an admin
export async function GET(request: Request) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ isAdmin: false, error: 'No authorization token' })
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Verify the token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      return NextResponse.json({ isAdmin: false, error: 'Invalid token' })
    }

    // Check if user has admin role in user_profiles table using admin client
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('role, first_name, last_name')
      .eq('user_id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      // Profile doesn't exist, create a customer profile using admin client
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: user.id,
          email: user.email || '',
          role: 'customer'
        })
        .select('role, first_name, last_name')
        .single()

      if (createError) {
        console.error('Profile creation error:', createError)
        return NextResponse.json({ isAdmin: false, error: 'Profile creation failed' })
      }

      return NextResponse.json({ 
        isAdmin: false, 
        user: user.email,
        role: 'customer',
        profile: newProfile
      })
    }

    const isAdmin = profile?.role === 'admin'

    return NextResponse.json({ 
      isAdmin, 
      user: user.email,
      role: profile?.role || 'customer',
      profile
    })
  } catch (error: any) {
    return NextResponse.json(
      { isAdmin: false, error: error.message },
      { status: 500 }
    )
  }
}

// This endpoint will be used to set up admin role
export async function POST(request: Request) {
  try {
    const { email, action, token } = await request.json()
    
    if (action === 'setup_initial_admin' && email === 'support@rpmgenuineautoparts.info') {
      // Verify the user token using regular client
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)
      
      if (authError || !user || user.email !== email) {
        return NextResponse.json(
          { error: 'Must be logged in as the admin user to set up admin access' },
          { status: 401 }
        )
      }

      // Check if profile exists using admin client
      const { data: existingProfile, error: checkError } = await supabaseAdmin
        .from('user_profiles')
        .select('id, role')
        .eq('user_id', user.id)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        return NextResponse.json(
          { error: 'Profile check failed: ' + checkError.message },
          { status: 500 }
        )
      }

      if (!existingProfile) {
        // Create new admin profile using admin client to bypass RLS
        const { data: newProfile, error: createError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email || '',
            role: 'admin'
          })
          .select()
          .single()

        if (createError) {
          return NextResponse.json(
            { error: 'Failed to create admin profile: ' + createError.message },
            { status: 500 }
          )
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Admin access granted',
          profile: newProfile 
        })
      } else if (existingProfile.role !== 'admin') {
        // Update existing profile to admin using admin client
        const { data: updatedProfile, error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({ role: 'admin' })
          .eq('user_id', user.id)
          .select()
          .single()

        if (updateError) {
          return NextResponse.json(
            { error: 'Failed to update admin role: ' + updateError.message },
            { status: 500 }
          )
        }

        return NextResponse.json({ 
          success: true, 
          message: 'Admin access granted',
          profile: updatedProfile 
        })
      } else {
        return NextResponse.json({ 
          success: true, 
          message: 'Already has admin access' 
        })
      }
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}