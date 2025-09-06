import { NextRequest, NextResponse } from 'next/server'
import { PartnerService } from '@eventhour/database'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // TODO: Get partner ID from session/auth
    // For now, return mock data
    const mockStats = {
      totalRevenue: 125000, // 1250€ in cents
      pendingPayout: 35000, // 350€ in cents
      totalRedemptions: 42,
      activeExperiences: 5,
      thisMonthRevenue: 45000, // 450€ in cents
      thisMonthRedemptions: 8,
    }

    return NextResponse.json(mockStats)
  } catch (error) {
    console.error('Statistics error:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}