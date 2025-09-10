import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@eventhour/database'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

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
      const filepath = path.join(process.cwd(), 'public', image.filename)
      await fs.unlink(filepath).catch(() => {
        console.warn('Failed to delete file:', filepath)
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Image delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}