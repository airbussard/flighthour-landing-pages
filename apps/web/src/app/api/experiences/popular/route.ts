import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@eventhour/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '4')

    // Fetch popular experiences
    const { data: experiences, error } = await supabase
      .from('experiences')
      .select(`
        *,
        partners!experiences_partner_id_fkey (
          id,
          company_name
        ),
        categories!experiences_category_id_fkey (
          id,
          name,
          slug
        ),
        experience_images!experience_images_experience_id_fkey (
          filename,
          alt_text
        )
      `)
      .eq('is_active', true)
      .order('popularity_score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching popular experiences:', error)
      return NextResponse.json({ error: 'Failed to fetch experiences' }, { status: 500 })
    }

    // Transform the data for frontend consumption
    const transformedExperiences = (experiences || []).map(exp => ({
      id: exp.id,
      title: exp.title,
      slug: exp.slug,
      description: exp.description,
      shortDescription: exp.short_description,
      location: exp.city,
      locationName: exp.location_name,
      price: exp.retail_price / 100, // Convert from cents to euros
      priceFormatted: `${(exp.retail_price / 100).toFixed(0)}€`,
      duration: exp.duration,
      maxParticipants: exp.max_participants,
      category: exp.categories ? {
        id: exp.categories.id,
        name: exp.categories.name,
        slug: exp.categories.slug
      } : null,
      partner: exp.partners ? {
        id: exp.partners.id,
        name: exp.partners.company_name
      } : null,
      image: exp.experience_images?.[0]?.filename || '/images/experiences/default.jpg',
      imageAlt: exp.experience_images?.[0]?.alt_text || exp.title,
      rating: 4.5 + (exp.popularity_score / 100) * 0.5, // Calculate rating from popularity
      reviews: Math.floor(exp.popularity_score * 2.5), // Estimate reviews from popularity
    }))

    return NextResponse.json({
      experiences: transformedExperiences,
      total: transformedExperiences.length
    })
  } catch (error) {
    console.error('Popular experiences error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}