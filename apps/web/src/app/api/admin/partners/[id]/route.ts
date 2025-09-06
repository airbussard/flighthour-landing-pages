import { NextRequest, NextResponse } from 'next/server'
import { AdminService } from '@eventhour/database'
import { AuthService } from '@eventhour/auth'

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
    const { verificationStatus, isActive } = body

    if (verificationStatus && !['PENDING', 'VERIFIED', 'REJECTED'].includes(verificationStatus)) {
      return NextResponse.json({ error: 'Invalid verification status' }, { status: 400 })
    }

    const updatedPartner = await AdminService.updatePartnerStatus(params.id, verificationStatus, isActive)

    return NextResponse.json({ success: true, data: updatedPartner })
  } catch (error) {
    console.error('Update partner error:', error)
    return NextResponse.json(
      { error: 'Failed to update partner' },
      { status: 500 }
    )
  }
}