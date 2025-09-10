import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@eventhour/database'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

// Use same base directory logic as main upload route
const isProduction = process.env.NODE_ENV === 'production'
const baseDir = isProduction ? process.cwd() : path.join(process.cwd(), 'apps', 'web')

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    const { id: experienceId, imageId } = params

    // Get image details first
    const { data: image } = await supabase
      .from('experience_images')
      .select('filename')
      .eq('id', imageId)
      .eq('experience_id', experienceId)
      .single()

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('experience_images')
      .delete()
      .eq('id', imageId)
      .eq('experience_id', experienceId)

    if (deleteError) {
      console.error('Database delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 })
    }

    // Delete file from server
    if (image.filename && image.filename.startsWith('/uploads/')) {
      const filepath = path.join(baseDir, 'public', image.filename)
      await fs.unlink(filepath).catch((err) => {
        console.warn('Failed to delete file:', filepath, err.message)
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Image delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}