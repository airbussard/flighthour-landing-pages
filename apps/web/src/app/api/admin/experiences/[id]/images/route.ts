import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@eventhour/database/src/supabase-server'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id: experienceId } = params
    const formData = await request.formData()
    const file = formData.get('file') as File
    const altText = formData.get('altText') as string || ''
    const sortOrder = parseInt(formData.get('sortOrder') as string || '0')

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${experienceId}_${nanoid()}.${fileExt}`

    // Kein Unterordner mehr - direkt im Bucket speichern
    const filePath = fileName

    // Convert File to ArrayBuffer then to Uint8Array
    const arrayBuffer = await file.arrayBuffer()
    const fileData = new Uint8Array(arrayBuffer)

    console.log('Uploading image to Supabase Storage:', {
      bucket: 'experience-images',
      filePath,
      fileSize: fileData.length,
      contentType: file.type
    })

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('experience-images')
      .upload(filePath, fileData, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase Storage upload error:', {
        error: uploadError,
        message: uploadError.message,
        filePath,
        bucket: 'experience-images'
      })
      return NextResponse.json({
        error: 'Failed to upload image',
        details: uploadError.message
      }, { status: 500 })
    }

    console.log('Upload successful:', uploadData)

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('experience-images')
      .getPublicUrl(filePath)

    // Save image reference in database
    const { data: imageData, error: dbError } = await supabase
      .from('experience_images')
      .insert({
        experience_id: experienceId,
        filename: publicUrl,
        alt_text: altText || file.name,
        sort_order: sortOrder
      })
      .select()
      .single()

    if (dbError) {
      // If database insert fails, delete the uploaded file
      await supabase.storage
        .from('experience-images')
        .remove([filePath])

      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Failed to save image reference' }, { status: 500 })
    }

    return NextResponse.json({
      id: imageData.id,
      filename: publicUrl,
      altText: imageData.alt_text,
      sortOrder: imageData.sort_order,
      message: 'Image uploaded successfully'
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id: experienceId } = params

    // Delete all images for this experience from storage
    const { data: images } = await supabase
      .from('experience_images')
      .select('filename')
      .eq('experience_id', experienceId)

    if (images && images.length > 0) {
      // Extract file paths from URLs
      const filePaths = images.map(img => {
        const url = img.filename
        // Extract path from Supabase Storage URL
        // Jetzt ohne Unterordner - nur der Dateiname
        const match = url.match(/\/experience-images\/(.+)$/)
        return match ? match[1] : null
      }).filter(Boolean)

      if (filePaths.length > 0) {
        console.log('Deleting multiple files from storage:', filePaths)
        // Delete from storage
        const { error } = await supabase.storage
          .from('experience-images')
          .remove(filePaths as string[])

        if (error) {
          console.error('Error deleting files from storage:', error)
        }
      }
    }

    // Delete from database
    const { error: deleteError } = await supabase
      .from('experience_images')
      .delete()
      .eq('experience_id', experienceId)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json({ error: 'Failed to delete images' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Images deleted successfully' })

  } catch (error) {
    console.error('Image delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}