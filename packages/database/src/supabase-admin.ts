import { createClient, SupabaseClient as SupabaseClientType } from '@supabase/supabase-js'

// Admin client for server-side operations with full access
let supabaseAdminClient: SupabaseClientType | null = null

/**
 * Get Supabase Admin Client with Service Role Key
 * WARNING: Only use server-side! Never expose to browser!
 */
export function getSupabaseAdminClient(): SupabaseClientType | null {
  // Check if we're in the browser - this should NEVER happen
  if (typeof window !== 'undefined') {
    console.error('[Supabase Admin] CRITICAL: Attempting to use admin client in browser!')
    throw new Error('Admin client can only be used server-side')
  }

  // During build time, return null
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('[Supabase Admin] Skipping initialization during build time')
    return null
  }

  // Check if env vars are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[Supabase Admin] Missing environment variables:', {
      url: !!supabaseUrl,
      serviceKey: !!serviceRoleKey,
    })
    
    // Fall back to anon key if service role key not available
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (anonKey) {
      console.warn('[Supabase Admin] Falling back to anon key - limited permissions!')
      
      if (!supabaseAdminClient) {
        supabaseAdminClient = createClient(supabaseUrl, anonKey)
      }
      return supabaseAdminClient
    }
    
    return null
  }

  // Initialize admin client if not already done
  if (!supabaseAdminClient) {
    console.log('[Supabase Admin] Initializing admin client with service role key')
    supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    console.log('[Supabase Admin] Admin client initialized successfully')
  }

  return supabaseAdminClient
}

export type SupabaseAdminClient = SupabaseClientType