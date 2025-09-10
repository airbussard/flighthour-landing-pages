import { NextRequest, NextResponse } from 'next/server'
import { AdminService } from '@eventhour/database'
import { AuthService } from '@eventhour/auth'
import { getSupabaseAdminClient } from '@eventhour/database/src/supabase-admin'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    // First, get the current experience to check if slug is changing
    const { data: currentExperience } = await supabase
      .from('experiences')
      .select('slug')
      .eq('id', params.id)
      .single()

    // Prepare update data
    const updateData: any = {}
    
    // Map camelCase to snake_case for database
    if (body.title !== undefined) updateData.title = body.title
    // Only update slug if it's different from current
    if (body.slug !== undefined && body.slug !== currentExperience?.slug) {
      updateData.slug = body.slug
    }
    if (body.description !== undefined) updateData.description = body.description
    if (body.shortDescription !== undefined) updateData.short_description = body.shortDescription
    if (body.locationName !== undefined) updateData.location_name = body.locationName
    if (body.street !== undefined) updateData.street = body.street
    if (body.city !== undefined) updateData.city = body.city
    if (body.postalCode !== undefined) updateData.postal_code = body.postalCode
    if (body.country !== undefined) updateData.country = body.country
    if (body.latitude !== undefined) updateData.latitude = body.latitude
    if (body.longitude !== undefined) updateData.longitude = body.longitude
    if (body.duration !== undefined) updateData.duration = body.duration
    if (body.maxParticipants !== undefined) updateData.max_participants = body.maxParticipants
    if (body.retailPrice !== undefined) updateData.retail_price = body.retailPrice
    if (body.purchasePrice !== undefined) updateData.purchase_price = body.purchasePrice
    if (body.categoryId !== undefined) updateData.category_id = body.categoryId || null
    if (body.partnerId !== undefined) updateData.partner_id = body.partnerId
    if (body.searchKeywords !== undefined) updateData.search_keywords = body.searchKeywords
    if (body.isActive !== undefined) updateData.is_active = body.isActive

    // Update the experience
    const { data, error } = await supabase
      .from('experiences')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('Update experience error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to update experience' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is an admin
    const user = await AuthService.getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const supabase = getSupabaseAdminClient()
    
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Delete experience error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to delete experience' },
      { status: 500 }
    )
  }
}