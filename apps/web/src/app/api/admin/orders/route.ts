import { NextRequest, NextResponse } from 'next/server'
import { AdminService, convertKeysToCamelCase } from '@eventhour/database'
import { AuthService } from '@eventhour/auth'
import type { OrderStatus } from '@eventhour/database'

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
    const status = searchParams.get('status') as OrderStatus | undefined

    const { orders, total } = await AdminService.getOrders({
      skip: (page - 1) * limit,
      take: limit,
      search,
      status,
    })

    // Convert snake_case to camelCase for frontend compatibility
    const transformedOrders = convertKeysToCamelCase(orders)

    return NextResponse.json({
      success: true,
      data: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    console.error('Admin orders error:', error?.message || error)
    
    return NextResponse.json({
      success: false,
      data: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
      error: error?.message || 'Failed to fetch orders'
    }, { status: 500 })
  }
}