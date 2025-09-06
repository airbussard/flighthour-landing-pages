import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@eventhour/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { consent } = body

    // Get IP address (anonymized)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    const anonymizedIp = ip.split('.').slice(0, 3).join('.') + '.0' // Anonymize last octet

    // Log consent (optional - you can store this in database)
    console.log('Consent saved:', {
      timestamp: consent.timestamp,
      version: consent.version,
      functional: consent.functional,
      analytics: consent.analytics,
      marketing: consent.marketing,
      ip: anonymizedIp,
    })

    // In production, you might want to store this in a consent_logs table
    // await prisma.consentLog.create({
    //   data: {
    //     ipAddress: anonymizedIp,
    //     consentData: consent,
    //     timestamp: new Date(consent.timestamp),
    //     version: consent.version,
    //   }
    // })

    return NextResponse.json({ 
      success: true,
      message: 'Consent preferences saved successfully'
    })
  } catch (error) {
    console.error('Failed to save consent:', error)
    return NextResponse.json(
      { error: 'Failed to save consent preferences' },
      { status: 500 }
    )
  }
}