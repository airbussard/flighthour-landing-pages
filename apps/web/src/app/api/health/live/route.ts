import { NextResponse } from 'next/server'
import { isAlive } from '@eventhour/monitoring'

export async function GET() {
  const alive = isAlive()
  
  return NextResponse.json(
    { alive },
    { status: alive ? 200 : 503 }
  )
}