import { NextRequest, NextResponse } from 'next/server'
import { AdminService, convertKeysToCamelCase } from '@eventhour/database'
import { AuthService } from '@eventhour/auth'

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
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || undefined
    const isActive = searchParams.get('isActive') 
      ? searchParams.get('isActive') === 'true'
      : undefined
    const partnerId = searchParams.get('partnerId') || undefined

    const { experiences, total } = await AdminService.getExperiences({
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
    const { experienceId, action } = body

    if (!experienceId || !action) {
      return NextResponse.json({ 
        error: 'Experience ID and action are required' 
      }, { status: 400 })
    }

    if (action === 'toggleStatus') {
      const updatedExperience = await AdminService.toggleExperienceStatus(experienceId)
      const transformedExperience = convertKeysToCamelCase(updatedExperience)
      
      return NextResponse.json({
        success: true,
        data: transformedExperience,
      })
    }

    return NextResponse.json({ 
      error: 'Invalid action' 
    }, { status: 400 })
  } catch (error: any) {
    console.error('Admin experience action error:', error?.message || error)
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Action failed'
    }, { status: 500 })
  }
}