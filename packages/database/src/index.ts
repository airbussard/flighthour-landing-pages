// Export Supabase-based services
export { AdminService } from './admin-service-supabase'
export { SearchService } from './search-service'
export type { SearchParams, SearchResult, ExperienceWithDistance } from './search-service'
export { PartnerService } from './partner-service'
export { GeocodingService } from './geocoding-service'

// Export Supabase client
export { getSupabaseClient } from './supabase'
// Server-only exports - should only be imported in API routes
// export { createServerSupabaseClient } from './supabase-server'
// export { createServiceSupabaseClient } from './supabase-service'

// Export types
export * from './types'

// Export utilities
export { convertKeysToCamelCase, convertKeysToSnakeCase } from './utils'