import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@eventhour/database'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    const { slug } = params

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    // Fetch experience by slug
    const { data: experience, error } = await supabase
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
        experience_images!left (
          filename,
          alt_text,
          sort_order
        )
      `)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !experience) {
      console.error('Experience not found:', error)
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    // Transform the data for frontend consumption
    const transformedExperience = {
      id: experience.id,
      title: experience.title,
      slug: experience.slug,
      description: experience.description,
      shortDescription: experience.short_description,
      locationName: experience.location_name,
      street: experience.street,
      city: experience.city,
      postalCode: experience.postal_code,
      country: experience.country || 'DE',
      latitude: experience.latitude,
      longitude: experience.longitude,
      duration: experience.duration,
      maxParticipants: experience.max_participants,
      retailPrice: experience.retail_price,
      taxRate: experience.tax_rate,
      isActive: experience.is_active,
      averageRating: experience.average_rating || 0,
      totalRatings: experience.total_ratings || 0,
      category: experience.categories ? {
        id: experience.categories.id,
        name: experience.categories.name,
        slug: experience.categories.slug
      } : null,
      partner: experience.partners ? {
        id: experience.partners.id,
        companyName: experience.partners.company_name
      } : null,
      images: experience.experience_images ?
        experience.experience_images
          .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
          .map((img: any) => ({
            filename: img.filename,
            altText: img.alt_text || ''
          })) : []
    }

    return NextResponse.json({
      experience: transformedExperience
    }, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Experience API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}