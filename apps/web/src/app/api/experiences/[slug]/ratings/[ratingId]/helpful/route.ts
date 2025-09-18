import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@eventhour/database'

export const dynamic = 'force-dynamic'

// POST /api/experiences/[slug]/ratings/[ratingId]/helpful - Vote on rating helpfulness
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string, ratingId: string } }
) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user

    const { ratingId } = params
    const body = await request.json()
    const { isHelpful } = body

    if (typeof isHelpful !== 'boolean') {
      return NextResponse.json({ error: 'Invalid isHelpful value' }, { status: 400 })
    }

    // Check if rating exists
    const { data: rating, error: ratingError } = await supabase
      .from('experience_ratings')
      .select('id')
      .eq('id', ratingId)
      .single()

    if (ratingError || !rating) {
      return NextResponse.json({ error: 'Rating not found' }, { status: 404 })
    }

    // Check if user has already voted
    const { data: existingVote } = await supabase
      .from('rating_helpful_votes')
      .select('id, is_helpful')
      .eq('rating_id', ratingId)
      .eq('user_id', user.id)
      .single()

    if (existingVote) {
      // Update existing vote
      const { error: updateError } = await supabase
        .from('rating_helpful_votes')
        .update({ is_helpful: isHelpful })
        .eq('id', existingVote.id)

      if (updateError) {
        console.error('Error updating vote:', updateError)
        return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 })
      }

      return NextResponse.json({
        message: 'Vote updated successfully',
        isHelpful
      })
    } else {
      // Insert new vote
      const { error: insertError } = await supabase
        .from('rating_helpful_votes')
        .insert({
          rating_id: ratingId,
          user_id: user.id,
          is_helpful: isHelpful,
        })

      if (insertError) {
        console.error('Error inserting vote:', insertError)
        return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 })
      }

      return NextResponse.json({
        message: 'Vote submitted successfully',
        isHelpful
      }, { status: 201 })
    }
  } catch (error) {
    console.error('Vote submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/experiences/[slug]/ratings/[ratingId]/helpful - Remove vote
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string, ratingId: string } }
) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Database connection not available' }, { status: 503 })
    }

    // Verify authentication
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = session.user

    const { ratingId } = params

    // Delete the user's vote
    const { error: deleteError } = await supabase
      .from('rating_helpful_votes')
      .delete()
      .eq('rating_id', ratingId)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error deleting vote:', deleteError)
      return NextResponse.json({ error: 'Failed to delete vote' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Vote removed successfully'
    })
  } catch (error) {
    console.error('Vote deletion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}