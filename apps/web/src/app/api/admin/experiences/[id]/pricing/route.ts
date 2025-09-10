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
    const { retailPrice, purchasePrice } = body

    // Validate input
    if (!retailPrice || !purchasePrice) {
      return NextResponse.json(
        { error: 'Verkaufspreis und Einkaufspreis sind erforderlich' },
        { status: 400 }
      )
    }

    if (purchasePrice > retailPrice) {
      return NextResponse.json(
        { error: 'Einkaufspreis kann nicht höher als Verkaufspreis sein' },
        { status: 400 }
      )
    }

    // Update pricing
    const updatedExperience = await AdminService.updateExperiencePricing(
      params.id,
      retailPrice,
      purchasePrice
    )

    return NextResponse.json({
      success: true,
      data: updatedExperience,
      commission: retailPrice - purchasePrice
    })
  } catch (error: any) {
    console.error('Update pricing error:', error)
    return NextResponse.json(
      { error: error?.message || 'Fehler beim Aktualisieren der Preise' },
      { status: 500 }
    )
  }
}