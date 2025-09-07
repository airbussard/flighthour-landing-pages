import { createClient, SupabaseClient as SupabaseClientType } from '@supabase/supabase-js'

// Lazy initialization to handle build-time when env vars might not be available
let supabaseClient: SupabaseClientType | null = null

export function getSupabaseClient(): SupabaseClientType | null {
  // During build time, return null
  if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('[Supabase] Skipping initialization during build time')
    return null
  }

  // Check if env vars are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('[Supabase] Missing environment variables:', {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlValue: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
      keyValue: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...'
    })
    
    // Check for placeholder values
    if (process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === 'placeholder') {
      console.error('[Supabase] Placeholder values detected! Please set real Supabase credentials in CapRover environment variables.')
    }
    
    return null
  }

  // Initialize client if not already done
  if (!supabaseClient) {
    console.log('[Supabase] Initializing client with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    console.log('[Supabase] Client initialized successfully')
  }

  return supabaseClient
}

// Export for backward compatibility, but might be null during build
export const supabase = getSupabaseClient()

export type SupabaseClient = SupabaseClientType