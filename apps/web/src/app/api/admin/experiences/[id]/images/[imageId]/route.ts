import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@eventhour/database/src/supabase-server'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    // Check authentication and admin role
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!userData || userData.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id: experienceId, imageId } = params

    // Get image details first
    const { data: image, error: fetchError } = await supabase
      .from('experience_images')
      .select('filename')
      .eq('id', imageId)
      .eq('experience_id', experienceId)
      .single()

    if (fetchError || !image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Extract file path from URL for Supabase Storage deletion
    const url = image.filename
    console.log('Attempting to delete image from storage:', url)

    // Der Pfad im Storage ist jetzt nur der Dateiname (ohne Unterordner)
    // URL Format: https://xxx.supabase.co/storage/v1/object/public/experience-images/filename.ext
    const match = url.match(/\/experience-images\/(.+)$/)

    if (match) {
      const filePath = match[1]
      console.log('Deleting from storage with path:', filePath)

      // Delete from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('experience-images')
        .remove([filePath])

      if (storageError) {
        console.error('Storage delete error:', {
          error: storageError,
          message: storageError.message,
          filePath,
          bucket: 'experience-images'
        })
        // Continue with database deletion even if storage fails
      } else {
        console.log('Successfully deleted from storage:', filePath)
      }
    } else {
      console.warn('Could not extract file path from URL:', url)
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

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Image delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}