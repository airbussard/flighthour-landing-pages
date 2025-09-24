import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@eventhour/database/src/supabase-server'
import { createServiceSupabaseClient } from '@eventhour/database/src/supabase-service'
import { nanoid } from 'nanoid'

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[IMAGE UPLOAD v3] POST request received for experience:', params.id)

  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      console.error('[IMAGE UPLOAD v3] Failed to create supabase client')
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }
    console.log('[IMAGE UPLOAD v3] Supabase client created')

    // Check authentication and admin role
    console.log('[IMAGE UPLOAD v3] Getting session...')
    let session
    try {
      const sessionResult = await supabase.auth.getSession()
      session = sessionResult.data.session
      console.log('[IMAGE UPLOAD v3] Session result:', {
        hasSession: !!session,
        userId: session?.user?.id,
        userEmail: session?.user?.email
      })
    } catch (authError) {
      console.error('[IMAGE UPLOAD v3] Auth error:', authError)
      return NextResponse.json({
        error: 'Authentication failed',
        details: authError instanceof Error ? authError.message : 'Unknown auth error'
      }, { status: 500 })
    }

    if (!session?.user) {
      console.log('[IMAGE UPLOAD v3] No user in session - returning 401')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    console.log('[IMAGE UPLOAD v3] Checking admin role for user:', session.user.id)
    let userData
    try {
      const result = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      userData = result.data
      console.log('[IMAGE UPLOAD v3] User role check:', {
        hasData: !!userData,
        role: userData?.role,
        error: result.error
      })
    } catch (dbError) {
      console.error('[IMAGE UPLOAD v3] Database error checking role:', dbError)
      return NextResponse.json({
        error: 'Database error',
        details: 'Failed to check user role'
      }, { status: 500 })
    }

    if (!userData || userData.role !== 'ADMIN') {
      console.log('[IMAGE UPLOAD v3] User is not admin - returning 403')
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    console.log('[IMAGE UPLOAD v3] Auth check passed, user is admin')

    const { id: experienceId } = params
    console.log('[IMAGE UPLOAD v3] Getting form data...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const altText = formData.get('altText') as string || ''
    const sortOrder = parseInt(formData.get('sortOrder') as string || '0')

    console.log('[IMAGE UPLOAD v3] Form data received:', {
      hasFile: !!file,
      fileName: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      altText,
      sortOrder
    })

    if (!file) {
      console.error('[IMAGE UPLOAD v3] No file in form data')
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

    // Verwende Service Role Client für Storage-Upload (umgeht RLS)
    console.log('[IMAGE UPLOAD v3] Creating service client...')
    console.log('[IMAGE UPLOAD v3] Env check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    })

    const serviceClient = createServiceSupabaseClient()
    if (!serviceClient) {
      console.error('[IMAGE UPLOAD v3] Failed to create service client for storage')
      return NextResponse.json({
        error: 'Storage service unavailable',
        details: 'Could not initialize storage service client - check SUPABASE_SERVICE_ROLE_KEY env var'
      }, { status: 503 })
    }

    console.log('[IMAGE UPLOAD v3] Service role client created successfully')

    // Upload to Supabase Storage mit Service Client
    const { data: uploadData, error: uploadError } = await serviceClient.storage
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

    // Get public URL mit Service Client
    const { data: { publicUrl } } = serviceClient.storage
      .from('experience-images')
      .getPublicUrl(filePath)

    console.log('Public URL generated:', publicUrl)

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
    console.error('[IMAGE UPLOAD v3] Unhandled error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
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