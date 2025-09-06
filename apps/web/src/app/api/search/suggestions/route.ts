import { NextRequest, NextResponse } from 'next/server'
import { SearchService } from '@eventhour/database'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 5

    if (query.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = await SearchService.getSuggestions(query, limit)

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Suggestions error:', error)
    return NextResponse.json({ error: 'Failed to get suggestions' }, { status: 500 })
  }
}
