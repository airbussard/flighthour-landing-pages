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
    const role = searchParams.get('role') as any || undefined

    const { users, total } = await AdminService.getUsers({
      skip: (page - 1) * limit,
      take: limit,
      search,
      role,
    })

    // Convert snake_case to camelCase for frontend compatibility
    const transformedUsers = convertKeysToCamelCase(users)

    return NextResponse.json({
      success: true,
      data: transformedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Admin users error:', error?.message || error)
    
    // Return empty list on error with more details
    return NextResponse.json({
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
      error: error?.message || 'Failed to fetch users'
    }, { status: 500 })
  }
}