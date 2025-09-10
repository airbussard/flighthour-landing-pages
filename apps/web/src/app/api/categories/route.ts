import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@eventhour/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    // Fetch categories with experience count
    const { data: categories, error } = await supabase
      .from('categories')
      .select(`
        *,
        experiences!experiences_category_id_fkey (
          id
        )
      `)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }

    // Transform and count experiences per category
    const transformedCategories = (categories || []).map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon || '📦',
      count: cat.experiences?.length || 0
    }))

    return NextResponse.json({
      categories: transformedCategories,
      total: transformedCategories.length
    })
  } catch (error) {
    console.error('Categories error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}