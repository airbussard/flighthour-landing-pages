'use client'

import React, { useState } from 'react'
import { ThumbsUp, ThumbsDown, User, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { RatingDisplay } from './RatingDisplay'
import { Card } from '../Card'
import { Button } from '../Button'
import { clsx } from 'clsx'
import type { ExperienceRating } from '@eventhour/database'

export interface RatingListProps {
  ratings: ExperienceRating[]
  currentUserId?: string
  onHelpfulVote?: (ratingId: string, isHelpful: boolean) => Promise<void>
  onLoadMore?: () => void
  hasMore?: boolean
  isLoading?: boolean
  className?: string
}

export const RatingList: React.FC<RatingListProps> = ({
  ratings,
  currentUserId,
  onHelpfulVote,
  onLoadMore,
  hasMore = false,
  isLoading = false,
  className,
}) => {
  const [votingStates, setVotingStates] = useState<Record<string, 'helpful' | 'not_helpful' | null>>({})
  const [votingInProgress, setVotingInProgress] = useState<Set<string>>(new Set())

  const handleVote = async (ratingId: string, isHelpful: boolean) => {
    if (!currentUserId || votingInProgress.has(ratingId)) return

    setVotingInProgress(prev => new Set([...prev, ratingId]))

    try {
      await onHelpfulVote?.(ratingId, isHelpful)
      setVotingStates(prev => ({
        ...prev,
        [ratingId]: isHelpful ? 'helpful' : 'not_helpful',
      }))
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setVotingInProgress(prev => {
        const next = new Set(prev)
        next.delete(ratingId)
        return next
      })
    }
  }

  const formatDate = (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('de-DE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (ratings.length === 0) {
    return (
      <Card className={clsx('p-8 text-center', className)}>
        <p className="text-gray-600">
          Noch keine Bewertungen vorhanden. Seien Sie der Erste, der dieses Erlebnis bewertet!
        </p>
      </Card>
    )
  }

  return (
    <div className={clsx('space-y-4', className)}>
      <AnimatePresence>
        {ratings.map((rating, index) => (
          <motion.div
            key={rating.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 bg-gray-100 rounded-full">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {rating.user?.name || 'Anonymer Nutzer'}
                        </p>
                        {rating.is_verified_purchase && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-xs">Verifizierter Kauf</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <RatingDisplay
                          rating={rating.rating}
                          size="xs"
                          showNumber={false}
                        />
                        <span>·</span>
                        <span>{formatDate(rating.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Title */}
                {rating.title && (
                  <h4 className="font-semibold text-lg">{rating.title}</h4>
                )}

                {/* Comment */}
                {rating.comment && (
                  <p className="text-gray-700 whitespace-pre-wrap">{rating.comment}</p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">
                      War diese Bewertung hilfreich?
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleVote(rating.id, true)}
                        disabled={!currentUserId || votingInProgress.has(rating.id)}
                        className={clsx(
                          'flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors',
                          votingStates[rating.id] === 'helpful'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
                          (!currentUserId || votingInProgress.has(rating.id)) && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{rating.helpful_count || 0}</span>
                      </button>
                      <button
                        onClick={() => handleVote(rating.id, false)}
                        disabled={!currentUserId || votingInProgress.has(rating.id)}
                        className={clsx(
                          'flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors',
                          votingStates[rating.id] === 'not_helpful'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700',
                          (!currentUserId || votingInProgress.has(rating.id)) && 'opacity-50 cursor-not-allowed'
                        )}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>{rating.not_helpful_count || 0}</span>
                      </button>
                    </div>
                  </div>

                  {currentUserId === rating.user_id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600"
                    >
                      Bearbeiten
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={isLoading}
          >
            {isLoading ? 'Wird geladen...' : 'Weitere Bewertungen laden'}
          </Button>
        </div>
      )}
    </div>
  )
}

export default RatingList