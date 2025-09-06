import { NextResponse } from 'next/server'
import { getSystemHealth } from '@eventhour/monitoring'

export async function GET() {
  try {
    const health = await getSystemHealth()
    
    return NextResponse.json(health, {
      status: health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503,
    })
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'unhealthy',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}