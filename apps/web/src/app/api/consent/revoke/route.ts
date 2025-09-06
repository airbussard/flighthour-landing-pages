import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get IP address (anonymized)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    const anonymizedIp = ip.split('.').slice(0, 3).join('.') + '.0'

    // Log revocation
    console.log('Consent revoked:', {
      timestamp: new Date().toISOString(),
      ip: anonymizedIp,
    })

    // In production, you might want to store this in a consent_logs table
    // await prisma.consentLog.create({
    //   data: {
    //     ipAddress: anonymizedIp,
    //     action: 'REVOKED',
    //     timestamp: new Date(),
    //   }
    // })

    return NextResponse.json({ 
      success: true,
      message: 'Consent revoked successfully'
    })
  } catch (error) {
    console.error('Failed to revoke consent:', error)
    return NextResponse.json(
      { error: 'Failed to revoke consent' },
      { status: 500 }
    )
  }
}