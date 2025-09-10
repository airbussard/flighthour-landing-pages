import { NextRequest, NextResponse } from 'next/server'
import { AdminService, convertKeysToCamelCase } from '@eventhour/database'
import { AuthService } from '@eventhour/auth'
import { getSupabaseAdminClient } from '@eventhour/database/src/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const user = await AuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const isActive = searchParams.get('isActive') 
      ? searchParams.get('isActive') === 'true'
      : undefined
    const partnerId = searchParams.get('partnerId') || undefined

    const { experiences, total } = await AdminService.getExperiences({
      id,
      skip: (page - 1) * limit,
      take: limit,
      search,
      isActive,
      partnerId,
    })

    // Convert snake_case to camelCase for frontend compatibility
    const transformedExperiences = convertKeysToCamelCase(experiences)

    return NextResponse.json({
      success: true,
      data: transformedExperiences,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Admin experiences error:', error?.message || error)
    
    return NextResponse.json({
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
      error: error?.message || 'Failed to fetch experiences'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const user = await AuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    
    // Check if this is a toggle status action
    if (body.experienceId && body.action === 'toggleStatus') {
      const updatedExperience = await AdminService.toggleExperienceStatus(body.experienceId)
      const transformedExperience = convertKeysToCamelCase(updatedExperience)
      
      return NextResponse.json({
        success: true,
        data: transformedExperience,
      })
    }
    
    // Otherwise, this is a create new experience request
    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    // Prepare insert data
    const insertData: any = {
      title: body.title,
      slug: body.slug,
      description: body.description,
      short_description: body.shortDescription,
      location_name: body.locationName,
      street: body.street || null,
      city: body.city,
      postal_code: body.postalCode,
      country: body.country || 'DE',
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      duration: body.duration,
      max_participants: body.maxParticipants || null,
      retail_price: body.retailPrice,
      purchase_price: body.purchasePrice,
      category_id: body.categoryId || null,
      partner_id: body.partnerId,
      search_keywords: body.searchKeywords || null,
      is_active: body.isActive !== undefined ? body.isActive : true,
      tax_rate: 0.19,
      popularity_score: 0
    }

    // Insert the new experience
    const { data, error } = await supabase
      .from('experiences')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const transformedExperience = convertKeysToCamelCase(data)
    
    return NextResponse.json({
      success: true,
      data: transformedExperience,
    })
  } catch (error: any) {
    console.error('Admin experience action error:', error?.message || error)
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Action failed'
    }, { status: 500 })
  }
}