import { prisma } from './client'
import { Experience, Prisma } from '@prisma/client'

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

export interface SearchResult {
  experiences: Experience[]
  total: number
  page: number
  totalPages: number
  facets: {
    categories: { name: string; count: number }[]
    priceRanges: { range: string; count: number }[]
    durations: { duration: string; count: number }[]
  }
}

export class SearchService {
  static async searchExperiences(params: SearchParams): Promise<SearchResult> {
    const {
      query,
      categories,
      minPrice,
      maxPrice,
      duration,
      rating,
      location,
      radius,
      partnerId,
      sortBy = 'relevance',
      page = 1,
      limit = 20,
    } = params

    // Build where clause
    const where: Prisma.ExperienceWhereInput = {
      AND: [
        // Text search
        query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { shortDescription: { contains: query, mode: 'insensitive' } },
                { highlights: { hasSome: [query] } },
              ],
            }
          : {},
        // Category filter
        categories && categories.length > 0
          ? { category: { in: categories } }
          : {},
        // Price range
        minPrice !== undefined ? { price: { gte: minPrice } } : {},
        maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
        // Duration filter
        duration && duration.length > 0
          ? { duration: { in: duration } }
          : {},
        // Rating filter
        rating !== undefined ? { averageRating: { gte: rating } } : {},
        // Partner filter
        partnerId ? { partnerId } : {},
        // Only active experiences
        { isActive: true },
      ],
    }

    // Build order by
    let orderBy: Prisma.ExperienceOrderByWithRelationInput = {}
    switch (sortBy) {
      case 'price_asc':
        orderBy = { price: 'asc' }
        break
      case 'price_desc':
        orderBy = { price: 'desc' }
        break
      case 'rating':
        orderBy = { averageRating: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      default:
        // For relevance, we'll order by rating and review count
        orderBy = [
          { averageRating: 'desc' },
          { reviewCount: 'desc' },
        ] as any
    }

    // Execute search with pagination
    const skip = (page - 1) * limit
    const [experiences, total] = await Promise.all([
      prisma.experience.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          partner: {
            select: {
              id: true,
              businessName: true,
              logo: true,
            },
          },
          images: {
            take: 1,
            orderBy: { order: 'asc' },
          },
        },
      }),
      prisma.experience.count({ where }),
    ])

    // Calculate facets (for filters)
    const facets = await this.calculateFacets(where)

    return {
      experiences,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      facets,
    }
  }

  static async getSuggestions(query: string, limit = 5): Promise<string[]> {
    if (!query || query.length < 2) return []

    const experiences = await prisma.experience.findMany({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [
              { title: { contains: query, mode: 'insensitive' } },
              { category: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: {
        title: true,
        category: true,
      },
      take: limit * 2, // Get more to filter duplicates
    })

    // Extract unique suggestions
    const suggestions = new Set<string>()
    experiences.forEach((exp) => {
      if (exp.title.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(exp.title)
      }
      if (exp.category.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(exp.category)
      }
    })

    return Array.from(suggestions).slice(0, limit)
  }

  static async getPopularSearches(limit = 10): Promise<string[]> {
    // In a real app, this would track actual search queries
    // For now, return popular categories
    const categories = await prisma.experience.groupBy({
      by: ['category'],
      where: { isActive: true },
      _count: { category: true },
      orderBy: { _count: { category: 'desc' } },
      take: limit,
    })

    return categories.map((c) => c.category)
  }

  static async getNearbyExperiences(
    lat: number,
    lng: number,
    radiusKm = 50,
    limit = 20
  ): Promise<Experience[]> {
    // For a production app, you'd use PostGIS or similar for proper geo queries
    // This is a simplified version using location strings
    const experiences = await prisma.experience.findMany({
      where: {
        isActive: true,
        // In production, you'd have lat/lng columns and use proper distance calculation
      },
      orderBy: {
        averageRating: 'desc',
      },
      take: limit,
      include: {
        partner: {
          select: {
            id: true,
            businessName: true,
            logo: true,
          },
        },
        images: {
          take: 1,
          orderBy: { order: 'asc' },
        },
      },
    })

    return experiences
  }

  private static async calculateFacets(
    baseWhere: Prisma.ExperienceWhereInput
  ) {
    const [categories, priceData, durations] = await Promise.all([
      // Category facets
      prisma.experience.groupBy({
        by: ['category'],
        where: baseWhere,
        _count: { category: true },
        orderBy: { _count: { category: 'desc' } },
      }),
      // Price statistics
      prisma.experience.aggregate({
        where: baseWhere,
        _min: { price: true },
        _max: { price: true },
        _avg: { price: true },
      }),
      // Duration facets
      prisma.experience.groupBy({
        by: ['duration'],
        where: baseWhere,
        _count: { duration: true },
        orderBy: { _count: { duration: 'desc' } },
      }),
    ])

    // Calculate price ranges
    const priceRanges = []
    if (priceData._min?.price && priceData._max?.price) {
      const min = priceData._min.price
      const max = priceData._max.price
      const ranges = [
        { label: 'Unter 50€', min: 0, max: 50 },
        { label: '50€ - 100€', min: 50, max: 100 },
        { label: '100€ - 200€', min: 100, max: 200 },
        { label: '200€ - 500€', min: 200, max: 500 },
        { label: 'Über 500€', min: 500, max: 999999 },
      ]

      for (const range of ranges) {
        if (range.max >= min && range.min <= max) {
          const count = await prisma.experience.count({
            where: {
              ...baseWhere,
              price: { gte: range.min, lt: range.max },
            },
          })
          if (count > 0) {
            priceRanges.push({ range: range.label, count })
          }
        }
      }
    }

    return {
      categories: categories.map((c) => ({
        name: c.category,
        count: c._count.category,
      })),
      priceRanges,
      durations: durations.map((d) => ({
        duration: d.duration,
        count: d._count.duration,
      })),
    }
  }

  static async getExperienceBySlug(slug: string): Promise<Experience | null> {
    return prisma.experience.findFirst({
      where: {
        slug,
        isActive: true,
      },
      include: {
        partner: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })
  }

  static async getRelatedExperiences(
    experienceId: string,
    limit = 4
  ): Promise<Experience[]> {
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
      select: { category: true, price: true },
    })

    if (!experience) return []

    return prisma.experience.findMany({
      where: {
        AND: [
          { id: { not: experienceId } },
          { isActive: true },
          { category: experience.category },
          {
            price: {
              gte: experience.price * 0.5,
              lte: experience.price * 1.5,
            },
          },
        ],
      },
      orderBy: [
        { averageRating: 'desc' },
        { reviewCount: 'desc' },
      ],
      take: limit,
      include: {
        partner: {
          select: {
            id: true,
            businessName: true,
            logo: true,
          },
        },
        images: {
          take: 1,
          orderBy: { order: 'asc' },
        },
      },
    })
  }
}

export default SearchService