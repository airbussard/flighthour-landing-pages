import { NextRequest, NextResponse } from 'next/server'
import { AdminService } from '@eventhour/database'
import { AuthService } from '@eventhour/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('[Admin Stats] Checking authentication...')
    
    // Check if user is authenticated and is an admin
    const user = await AuthService.getCurrentUser()
    
    if (!user) {
      console.log('[Admin Stats] No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('[Admin Stats] User found:', { id: user.id, role: user.role })

    if (user.role !== 'ADMIN') {
      console.log('[Admin Stats] User is not admin')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.log('[Admin Stats] Fetching dashboard stats...')
    const stats = await AdminService.getDashboardStats()
    console.log('[Admin Stats] Stats fetched successfully')

    return NextResponse.json({ success: true, data: stats })
  } catch (error: any) {
    console.error('[Admin Stats] Error:', error?.message || error)
    
    // Check if it's a database connection error
    if (error?.message?.includes('Database connection not available')) {
      console.log('[Admin Stats] Database connection error - returning mock data')
      
      // Return mock data for testing
      const mockStats = {
        users: { total: 0, newThisMonth: 0 },
        partners: { total: 0, active: 0 },
        orders: { total: 0, thisMonth: 0 },
        revenue: { total: 0, thisMonth: 0, lastMonth: 0, monthlyGrowth: 0 },
        experiences: { total: 0, active: 0 },
        vouchers: { total: 0, active: 0, redeemedThisMonth: 0 }
      }
      
      return NextResponse.json({ 
        success: true, 
        data: mockStats,
        warning: 'Using mock data - database connection unavailable'
      })
    }
    
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}