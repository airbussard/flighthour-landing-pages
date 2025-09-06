import { createClient, SupabaseClient as SupabaseClientType } from '@supabase/supabase-js'

// Lazy initialization to handle build-time when env vars might not be available
let supabaseClient: SupabaseClientType | null = null

export function getSupabaseClient(): SupabaseClientType | null {
  // During build time, return null
  if (typeof window === 'undefined' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return null
  }

  // Initialize client if not already done and env vars are available
  if (
    !supabaseClient &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }

  return supabaseClient
}

// Export for backward compatibility, but might be null during build
export const supabase = getSupabaseClient()

export type SupabaseClient = SupabaseClientType
