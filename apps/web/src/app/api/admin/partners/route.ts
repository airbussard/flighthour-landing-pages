import { NextRequest, NextResponse } from 'next/server'
import { AdminService } from '@eventhour/database'
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
    const verificationStatus = searchParams.get('verificationStatus') as any || undefined
    const isActive = searchParams.get('isActive') ? searchParams.get('isActive') === 'true' : undefined

    const { partners, total } = await AdminService.getPartners({
      skip: (page - 1) * limit,
      take: limit,
      search,
      verificationStatus,
      isActive,
    })

    return NextResponse.json({
      success: true,
      data: partners,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Admin partners error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    )
  }
}