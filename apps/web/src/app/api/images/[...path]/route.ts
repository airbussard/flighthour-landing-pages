import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Use same base directory logic as upload routes
const isProduction = process.env.NODE_ENV === 'production'
const baseDir = isProduction ? process.cwd() : path.join(process.cwd(), 'apps', 'web')

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the file path from the segments
    const filePath = params.path.join('/')
    
    // Security: Ensure the path doesn't escape the uploads directory
    if (filePath.includes('..') || !filePath.startsWith('uploads/')) {
      return new NextResponse('Not found', { status: 404 })
    }

    // Construct the full file path
    const fullPath = path.join(baseDir, 'public', filePath)
    
    // Check if file exists
    try {
      await fs.access(fullPath)
    } catch {
      return new NextResponse('Not found', { status: 404 })
    }

    // Read the file
    const fileBuffer = await fs.readFile(fullPath)
    
    // Determine content type based on file extension
    const ext = path.extname(fullPath).toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg'
        break
      case '.png':
        contentType = 'image/png'
        break
      case '.gif':
        contentType = 'image/gif'
        break
      case '.webp':
        contentType = 'image/webp'
        break
    }

    // Convert Buffer to Uint8Array for Response
    const uint8Array = new Uint8Array(fileBuffer)

    // Return the file with appropriate headers
    return new Response(uint8Array, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}