import { NextRequest, NextResponse } from 'next/server'
import { SearchService } from '@eventhour/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const params = {
      query: searchParams.get('q') || undefined,
      categories: searchParams.getAll('category'),
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      duration: searchParams.getAll('duration'),
      rating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
      location: searchParams.get('location') || undefined,
      radius: searchParams.get('radius') ? Number(searchParams.get('radius')) : undefined,
      partnerId: searchParams.get('partnerId') || undefined,
      sortBy: searchParams.get('sortBy') as any || 'relevance',
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : 20,
    }

    const results = await SearchService.searchExperiences(params)

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}