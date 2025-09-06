import { NextResponse } from 'next/server'
import { isReady } from '@eventhour/monitoring'

export async function GET() {
  const ready = await isReady()
  
  return NextResponse.json(
    { ready },
    { status: ready ? 200 : 503 }
  )
}