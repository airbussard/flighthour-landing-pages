import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@eventhour/auth'
import { getSupabaseClient } from '@eventhour/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await AuthService.getCurrentUser()
    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    // Fetch customer profile
    const { data: profile } = await supabase
      .from('customer_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Return combined data
    return NextResponse.json({
      name: user.name || '',
      email: user.email,
      phone: profile?.phone || '',
      birthday: profile?.birthday || '',
      defaultPostalCode: profile?.default_postal_code || '',
      newsletter: profile?.preferences?.newsletter || false
    })
  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const user = await AuthService.getCurrentUser()
    if (!user || user.role !== 'CUSTOMER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    const body = await request.json()

    // Update user name if changed
    if (body.name && body.name !== user.name) {
      const { error: userError } = await supabase
        .from('users')
        .update({ 
          name: body.name,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (userError) {
        console.error('User update error:', userError)
      }
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('customer_profiles')
      .select('id')
      .eq('user_id', user.id)
      .single()

    const profileData = {
      phone: body.phone || null,
      birthday: body.birthday || null,
      default_postal_code: body.defaultPostalCode || null,
      preferences: {
        newsletter: body.newsletter || false
      },
      updated_at: new Date().toISOString()
    }

    if (existingProfile) {
      // Update existing profile
      const { error } = await supabase
        .from('customer_profiles')
        .update(profileData)
        .eq('user_id', user.id)

      if (error) {
        console.error('Profile update error:', error)
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
      }
    } else {
      // Create new profile
      const { error } = await supabase
        .from('customer_profiles')
        .insert({
          ...profileData,
          user_id: user.id
        })

      if (error) {
        console.error('Profile create error:', error)
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}