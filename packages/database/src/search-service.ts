import { getSupabaseClient } from './supabase'
import type { Experience } from './types'
import { GeocodingService } from './geocoding-service'

export interface SearchParams {
  query?: string
  categories?: string[]
  minPrice?: number
  maxPrice?: number
  duration?: string[]
  rating?: number
  location?: string
  radius?: number
  partnerId?: string
  sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest'
  page?: number
  limit?: number
}

export interface ExperienceWithDistance extends Experience {
  distance?: number // Distance in kilometers
  withinRadius?: boolean
}

export interface SearchResult {
  experiences: ExperienceWithDistance[]
  total: number
  page: number
  totalPages: number
  filters: {
    categories: Array<{ id: string; name: string; count: number }>
    priceRange: { min: number; max: number }
    durations: Array<{ value: string; label: string; count: number }>
  }
  searchLocation?: {
    query: string
    coordinates?: { lat: number; lng: number }
    radius?: number
  }
}

export class SearchService {
  static async searchExperiences(params: SearchParams): Promise<SearchResult> {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    const {
      query,
      categories = [],
      minPrice,
      maxPrice,
      duration = [],
      location,
      radius,
      partnerId,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
    } = params

    try {
      // Build the query
      let queryBuilder = supabase
        .from('experiences')
        .select(`
          *,
          partners!experiences_partner_id_fkey (*),
          categories!experiences_category_id_fkey (*),
          experience_images!left (
            filename,
            alt_text,
            sort_order
          )
        `, { count: 'exact' })
        .eq('is_active', true)

      // Apply search query
      if (query) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,description.ilike.%${query}%,short_description.ilike.%${query}%,search_keywords.ilike.%${query}%`
        )
      }

      // Apply category filter
      if (categories.length > 0) {
        queryBuilder = queryBuilder.in('category_id', categories)
      }

      // Apply price filters
      if (minPrice !== undefined) {
        queryBuilder = queryBuilder.gte('retail_price', minPrice * 100) // Convert to cents
      }
      if (maxPrice !== undefined) {
        queryBuilder = queryBuilder.lte('retail_price', maxPrice * 100) // Convert to cents
      }

      // Apply duration filters
      if (duration.length > 0) {
        const durationConditions = duration.map(d => {
          switch (d) {
            case 'short': return { min: 0, max: 120 } // Up to 2 hours
            case 'medium': return { min: 120, max: 360 } // 2-6 hours
            case 'long': return { min: 360, max: 1440 } // 6-24 hours
            case 'multi_day': return { min: 1440, max: null } // More than 24 hours
            default: return null
          }
        }).filter(Boolean)

        if (durationConditions.length > 0) {
          const orConditions = durationConditions.map(cond => {
            if (cond?.max === null) {
              return `duration.gte.${cond.min}`
            }
            return `duration.gte.${cond?.min},duration.lte.${cond?.max}`
          }).join(',')
          queryBuilder = queryBuilder.or(orConditions)
        }
      }

      // Note: Location filtering is now handled post-query for distance calculation
      // We fetch all results and filter/sort by distance after

      // Apply partner filter
      if (partnerId) {
        queryBuilder = queryBuilder.eq('partner_id', partnerId)
      }

      // Apply sorting
      switch (sortBy) {
        case 'price_asc':
          queryBuilder = queryBuilder.order('retail_price', { ascending: true })
          break
        case 'price_desc':
          queryBuilder = queryBuilder.order('retail_price', { ascending: false })
          break
        case 'newest':
          queryBuilder = queryBuilder.order('created_at', { ascending: false })
          break
        case 'relevance':
        default:
          if (query) {
            // For relevance, we order by popularity score when there's a search query
            queryBuilder = queryBuilder.order('popularity_score', { ascending: false })
          } else {
            queryBuilder = queryBuilder.order('created_at', { ascending: false })
          }
          break
      }

      // Apply pagination
      const skip = (page - 1) * limit
      queryBuilder = queryBuilder.range(skip, skip + limit - 1)

      // Execute query
      const { data, error, count } = await queryBuilder

      if (error) throw error

      // Transform data
      let experiences: ExperienceWithDistance[] = (data || []).map((exp: any) => ({
        ...exp,
        partner: exp.partners,
        category: exp.categories,
      }))

      // Apply location-based filtering and distance calculation
      let searchLocationResult = undefined
      if (location && location.trim().length > 0) {
        const geocodingResult = await GeocodingService.geocodeWithFallback(location, 'DE')

        if (geocodingResult.coordinates) {
          const userCoords = geocodingResult.coordinates
          searchLocationResult = {
            query: location,
            coordinates: userCoords,
            radius: radius || 50 // Default radius 50km
          }

          // Calculate distances for all experiences
          experiences = experiences.map(exp => {
            if (exp.latitude && exp.longitude) {
              const distance = GeocodingService.calculateDistance(
                userCoords,
                { lat: exp.latitude, lng: exp.longitude }
              )
              return {
                ...exp,
                distance,
                withinRadius: radius ? distance <= radius : true
              }
            }
            return exp
          })

          // Sort by distance if location search is active
          if (sortBy === 'relevance' || sortBy === 'distance') {
            experiences.sort((a, b) => {
              // First show experiences within radius
              if (a.withinRadius && !b.withinRadius) return -1
              if (!a.withinRadius && b.withinRadius) return 1

              // Then sort by distance
              const distA = a.distance ?? 999999
              const distB = b.distance ?? 999999
              return distA - distB
            })
          }
        }
      }

      // Get filter aggregations (simplified version)
      // In a production system, you might want to use separate aggregate queries
      const filters = {
        categories: [],
        priceRange: { min: 0, max: 1000 },
        durations: [
          { value: 'short', label: 'Bis 2 Stunden', count: 0 },
          { value: 'medium', label: '2-6 Stunden', count: 0 },
          { value: 'long', label: '6-24 Stunden', count: 0 },
          { value: 'multi_day', label: 'Mehrtägig', count: 0 },
        ],
      }

      return {
        experiences,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit),
        filters,
        searchLocation: searchLocationResult,
      }
    } catch (error) {
      console.error('Search error:', error)
      throw error
    }
  }

  static async getSuggestions(query: string): Promise<string[]> {
    const supabase = getSupabaseClient()
    if (!supabase) throw new Error('Database connection not available')

    if (!query || query.length < 2) {
      return []
    }

    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('title')
        .eq('is_active', true)
        .ilike('title', `%${query}%`)
        .limit(10)

      if (error) throw error

      return (data || []).map(exp => exp.title)
    } catch (error) {
      console.error('Suggestions error:', error)
      return []
    }
  }

  static async getPopularSearches(): Promise<string[]> {
    // This could be implemented with a search_logs table
    // For now, return static popular searches
    return [
      'Flugsimulator',
      'Wellness',
      'Dinner',
      'Escape Room',
      'Fotoshooting',
      'Kochkurs',
    ]
  }
}