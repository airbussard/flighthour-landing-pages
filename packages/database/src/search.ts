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
                { searchKeywords: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {},
        // Category filter
        categories && categories.length > 0 ? { category: { name: { in: categories } } } : {},
        // Price range
        minPrice !== undefined ? { retailPrice: { gte: minPrice * 100 } } : {},
        maxPrice !== undefined ? { retailPrice: { lte: maxPrice * 100 } } : {},
        // Duration filter
        duration && duration.length > 0
          ? { duration: { in: duration.map((d) => parseInt(d)) } }
          : {},
        // Popularity filter (using popularityScore instead of rating)
        rating !== undefined ? { popularityScore: { gte: rating * 20 } } : {},
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
        orderBy = { retailPrice: 'asc' }
        break
      case 'price_desc':
        orderBy = { retailPrice: 'desc' }
        break
      case 'rating':
        orderBy = { popularityScore: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      default:
        // For relevance, we'll order by popularity score
        orderBy = { popularityScore: 'desc' }
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
              companyName: true,
            },
          },
          images: {
            take: 1,
            orderBy: { sortOrder: 'asc' },
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
              { category: { name: { contains: query, mode: 'insensitive' } } },
            ],
          },
        ],
      },
      select: {
        title: true,
        category: {
          select: {
            name: true,
          },
        },
      },
      take: limit * 2, // Get more to filter duplicates
    })

    // Extract unique suggestions
    const suggestions = new Set<string>()
    experiences.forEach((exp) => {
      if (exp.title.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(exp.title)
      }
      if (exp.category?.name && exp.category.name.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(exp.category.name)
      }
    })

    return Array.from(suggestions).slice(0, limit)
  }

  static async getPopularSearches(limit = 10): Promise<string[]> {
    // In a real app, this would track actual search queries
    // For now, return popular categories
    const categories = await prisma.category.findMany({
      where: {
        experiences: {
          some: { isActive: true },
        },
      },
      orderBy: {
        experiences: {
          _count: 'desc',
        },
      },
      take: limit,
      select: {
        name: true,
      },
    })

    return categories.map((c) => c.name)
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
        popularityScore: 'desc',
      },
      take: limit,
      include: {
        partner: {
          select: {
            id: true,
            companyName: true,
          },
        },
        images: {
          take: 1,
          orderBy: { sortOrder: 'asc' },
        },
      },
    })

    return experiences
  }

  private static async calculateFacets(baseWhere: Prisma.ExperienceWhereInput) {
    const [categories, priceData, durations] = await Promise.all([
      // Category facets
      prisma.category.findMany({
        where: {
          experiences: {
            some: baseWhere,
          },
        },
        select: {
          name: true,
          _count: {
            select: {
              experiences: {
                where: baseWhere,
              },
            },
          },
        },
      }),
      // Price statistics
      prisma.experience.aggregate({
        where: baseWhere,
        _min: { retailPrice: true },
        _max: { retailPrice: true },
        _avg: { retailPrice: true },
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
    if (priceData._min?.retailPrice && priceData._max?.retailPrice) {
      const min = priceData._min.retailPrice / 100 // Convert from cents to euros
      const max = priceData._max.retailPrice / 100
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
              retailPrice: { gte: range.min * 100, lt: range.max * 100 }, // Convert to cents
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
        name: c.name,
        count: c._count.experiences,
      })),
      priceRanges,
      durations: durations.map((d) => ({
        duration: String(d.duration),
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
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
  }

  static async getRelatedExperiences(experienceId: string, limit = 4): Promise<Experience[]> {
    const experience = await prisma.experience.findUnique({
      where: { id: experienceId },
      select: { categoryId: true, retailPrice: true },
    })

    if (!experience) return []

    return prisma.experience.findMany({
      where: {
        AND: [
          { id: { not: experienceId } },
          { isActive: true },
          { categoryId: experience.categoryId },
          {
            retailPrice: {
              gte: Math.floor(experience.retailPrice * 0.5),
              lte: Math.floor(experience.retailPrice * 1.5),
            },
          },
        ],
      },
      orderBy: {
        popularityScore: 'desc',
      },
      take: limit,
      include: {
        partner: {
          select: {
            id: true,
            companyName: true,
          },
        },
        images: {
          take: 1,
          orderBy: { sortOrder: 'asc' },
        },
      },
    })
  }
}

export default SearchService
