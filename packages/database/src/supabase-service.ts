import 'server-only'
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient as SupabaseClientType } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with Service Role Key
 * WICHTIG: Nur für Server-seitige Admin-Operationen verwenden!
 * Dieser Client umgeht alle RLS-Policies.
 */
export function createServiceSupabaseClient(): SupabaseClientType | null {
  // Check if env vars are available
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[Supabase Service] Missing environment variables for service client')
    return null
  }

  console.log('[Supabase Service] Creating service role client for admin operations')

  // Create client with service role key - bypasses all RLS
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    }
  )
}