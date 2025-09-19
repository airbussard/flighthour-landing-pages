import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@eventhour/database/src/supabase-server'
import type { ExperienceRating } from '@eventhour/database'

export const dynamic = 'force-dynamic'

// GET /api/experiences/[slug]/ratings - Get ratings for an experience
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    const { slug } = params
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sort') || 'helpful' // helpful, newest, highest, lowest

    // First get the experience ID from slug
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('id, average_rating, total_ratings')
      .eq('slug', slug)
      .single()

    if (expError || !experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    // Build the query for ratings
    let query = supabase
      .from('experience_ratings')
      .select(`
        *,
        users!experience_ratings_user_id_fkey (
          id,
          name,
          email
        )
      `)
      .eq('experience_id', experience.id)

    // Apply sorting
    switch (sortBy) {
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'highest':
        query = query.order('rating', { ascending: false })
        break
      case 'lowest':
        query = query.order('rating', { ascending: true })
        break
      case 'helpful':
      default:
        query = query.order('helpful_count', { ascending: false })
        break
    }

    // Apply pagination
    const offset = (page - 1) * limit
    query = query.range(offset, offset + limit - 1)

    const { data: ratings, error: ratingsError, count } = await query

    if (ratingsError) {
      console.error('Error fetching ratings:', ratingsError)
      return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 })
    }

    // Get rating distribution
    const { data: distribution } = await supabase
      .from('experience_rating_summary')
      .select('*')
      .eq('experience_id', experience.id)
      .single()

    // Check if current user has rated this experience
    let userRating = null

    // Get the current session
    const { data: { session } } = await supabase.auth.getSession()

    if (session?.user) {
      const { data: existingRating } = await supabase
        .from('experience_ratings')
        .select('*')
        .eq('experience_id', experience.id)
        .eq('user_id', session.user.id)
        .single()

      userRating = existingRating
    }

    return NextResponse.json({
      ratings: ratings || [],
      summary: {
        averageRating: experience.average_rating || 0,
        totalRatings: experience.total_ratings || 0,
        distribution: distribution || {
          five_star_count: 0,
          four_star_count: 0,
          three_star_count: 0,
          two_star_count: 0,
          one_star_count: 0,
        }
      },
      userRating,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error) {
    console.error('Ratings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/experiences/[slug]/ratings - Submit a new rating
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user

    const { slug } = params
    const body = await request.json()
    const { rating, title, comment, recaptchaToken } = body

    // Validate input
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Invalid rating value' }, { status: 400 })
    }

    if (comment && comment.length > 500) {
      return NextResponse.json({ error: 'Comment too long' }, { status: 400 })
    }

    // Verify reCAPTCHA if token provided
    if (recaptchaToken && process.env.RECAPTCHA_SECRET_KEY) {
      const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      })

      const recaptchaData = await recaptchaResponse.json()

      if (!recaptchaData.success || recaptchaData.score < 0.5) {
        return NextResponse.json({ error: 'reCAPTCHA verification failed' }, { status: 400 })
      }
    }

    // Get experience ID from slug
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('id')
      .eq('slug', slug)
      .single()

    if (expError || !experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    // Check if user has already rated this experience
    const { data: existingRating } = await supabase
      .from('experience_ratings')
      .select('id')
      .eq('experience_id', experience.id)
      .eq('user_id', user.id)
      .single()

    if (existingRating) {
      // Update existing rating
      const { data: updatedRating, error: updateError } = await supabase
        .from('experience_ratings')
        .update({
          rating,
          title: title || null,
          comment: comment || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingRating.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating rating:', updateError)
        return NextResponse.json({ error: 'Failed to update rating' }, { status: 500 })
      }

      return NextResponse.json({
        rating: updatedRating,
        message: 'Rating updated successfully'
      })
    } else {
      // Check if user has purchased this experience
      const { data: order } = await supabase
        .from('order_items')
        .select(`
          orders!inner (
            customer_user_id,
            payment_status
          )
        `)
        .eq('experience_id', experience.id)
        .eq('orders.customer_user_id', user.id)
        .eq('orders.payment_status', 'COMPLETED')
        .limit(1)
        .single()

      const isVerifiedPurchase = !!order

      // Insert new rating
      const { data: newRating, error: insertError } = await supabase
        .from('experience_ratings')
        .insert({
          experience_id: experience.id,
          user_id: user.id,
          rating,
          title: title || null,
          comment: comment || null,
          is_verified_purchase: isVerifiedPurchase,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error inserting rating:', insertError)
        return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 })
      }

      return NextResponse.json({
        rating: newRating,
        message: 'Rating submitted successfully'
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Rating submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/experiences/[slug]/ratings - Delete user's rating
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = createServerSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user

    const { slug } = params

    // Get experience ID from slug
    const { data: experience, error: expError } = await supabase
      .from('experiences')
      .select('id')
      .eq('slug', slug)
      .single()

    if (expError || !experience) {
      return NextResponse.json({ error: 'Experience not found' }, { status: 404 })
    }

    // Delete the user's rating
    const { error: deleteError } = await supabase
      .from('experience_ratings')
      .delete()
      .eq('experience_id', experience.id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting rating:', deleteError)
      return NextResponse.json({ error: 'Failed to delete rating' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Rating deleted successfully'
    })
  } catch (error) {
    console.error('Rating deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}