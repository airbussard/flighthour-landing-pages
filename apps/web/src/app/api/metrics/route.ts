import { NextResponse } from 'next/server'
import { getMetrics } from '@eventhour/monitoring'

export async function GET() {
  const metrics = getMetrics()
  
  return new NextResponse(metrics, {
    headers: {
      'Content-Type': 'text/plain; version=0.0.4',
    },
  })
}