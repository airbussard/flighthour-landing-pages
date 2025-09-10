import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@eventhour/database'
import { promises as fs } from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'experiences')

async function ensureUploadsDir() {
  try {
    await fs.access(uploadsDir)
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    const experienceId = params.id
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Max size is 5MB.' }, { status: 400 })
    }

    // Ensure uploads directory exists
    await ensureUploadsDir()

    // Generate unique filename
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `${experienceId}_${randomUUID()}.${extension}`
    const filepath = path.join(uploadsDir, filename)
    const publicPath = `/uploads/experiences/${filename}`

    // Convert File to Buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await fs.writeFile(filepath, buffer)

    // Get current max sort order
    const { data: existingImages } = await supabase
      .from('experience_images')
      .select('sort_order')
      .eq('experience_id', experienceId)
      .order('sort_order', { ascending: false })
      .limit(1)

    const nextOrder = existingImages && existingImages.length > 0 
      ? (existingImages[0].sort_order || 0) + 1 
      : 0

    // Save image reference to database
    const { data: image, error } = await supabase
      .from('experience_images')
      .insert({
        experience_id: experienceId,
        filename: publicPath,
        alt_text: file.name.replace(/\.[^/.]+$/, ''),
        sort_order: nextOrder
      })
      .select()
      .single()

    if (error) {
      // Delete uploaded file if database insert fails
      await fs.unlink(filepath).catch(() => {})
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save image reference' }, { status: 500 })
    }

    return NextResponse.json({
      id: image.id,
      filename: publicPath,
      alt_text: image.alt_text,
      sort_order: image.sort_order
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
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    const experienceId = params.id
    const url = new URL(request.url)
    const imageId = url.pathname.split('/').pop()

    if (!imageId) {
      return NextResponse.json({ error: 'Image ID required' }, { status: 400 })
    }

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