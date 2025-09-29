import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export function createServerSupabaseClient() {
  const cookieStore = cookies()
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        getUser: async () => {
          // Get the session from cookies
          const accessToken = cookieStore.get('sb-access-token')?.value
          const refreshToken = cookieStore.get('sb-refresh-token')?.value
          
          if (!accessToken) {
            return { data: { user: null }, error: null }
          }

          // Create a temporary client to verify the token
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
          )

          // Set the session manually
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          })

          if (error) {
            return { data: { user: null }, error }
          }

          return { data: { user: data.user }, error: null }
        }
      }
    }
  )
}