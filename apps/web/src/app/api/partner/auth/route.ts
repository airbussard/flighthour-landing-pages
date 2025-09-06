import { NextRequest, NextResponse } from 'next/server'
import { PartnerService } from '@eventhour/database'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const partner = await PartnerService.getPartnerByUserId(userId)

    return NextResponse.json({
      isPartner: !!partner,
      partner: partner ? {
        id: partner.id,
        companyName: partner.companyName,
        verificationStatus: partner.verificationStatus,
      } : null,
    })
  } catch (error) {
    console.error('Partner auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}