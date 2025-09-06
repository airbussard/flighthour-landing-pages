import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // TODO: Get partner ID from session/auth and fetch real data
    // For now, return mock data
    const mockRedemptions = [
      {
        id: '1',
        voucherCode: 'EVH-2024-A1B2',
        experienceTitle: 'Fallschirmsprung Tandem',
        amount: 25000, // 250€ in cents
        redeemedAt: new Date().toISOString(),
      },
      {
        id: '2',
        voucherCode: 'EVH-2024-C3D4',
        experienceTitle: 'Heißluftballonfahrt',
        amount: 18000, // 180€ in cents
        redeemedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '3',
        voucherCode: 'EVH-2024-E5F6',
        experienceTitle: 'Kochkurs italienisch',
        amount: 8500, // 85€ in cents
        redeemedAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ]

    return NextResponse.json({ vouchers: mockRedemptions })
  } catch (error) {
    console.error('Recent vouchers error:', error)
    return NextResponse.json({ error: 'Failed to fetch vouchers' }, { status: 500 })
  }
}