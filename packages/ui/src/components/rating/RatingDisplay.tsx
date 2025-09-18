'use client'

import React from 'react'
import { Star, StarHalf } from 'lucide-react'
import { clsx } from 'clsx'

export interface RatingDisplayProps {
  rating: number
  maxRating?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  showNumber?: boolean
  totalRatings?: number
  className?: string
  color?: 'yellow' | 'gold' | 'gray'
  interactive?: boolean
  onRatingClick?: (rating: number) => void
}

const sizeMap = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
}

const colorMap = {
  yellow: 'fill-eventhour-yellow text-eventhour-yellow',
  gold: 'fill-yellow-500 text-yellow-500',
  gray: 'fill-gray-400 text-gray-400',
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating = 0,
  maxRating = 5,
  size = 'md',
  showNumber = true,
  totalRatings,
  className,
  color = 'yellow',
  interactive = false,
  onRatingClick,
}) => {
  const roundedRating = Math.round(rating * 2) / 2 // Round to nearest 0.5
  const fullStars = Math.floor(roundedRating)
  const hasHalfStar = roundedRating % 1 !== 0
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  const handleStarClick = (index: number) => {
    if (interactive && onRatingClick) {
      onRatingClick(index + 1)
    }
  }

  return (
    <div className={clsx('flex items-center gap-1', className)}>
      <div className={clsx('flex', interactive && 'cursor-pointer')}>
        {/* Full stars */}
        {[...Array(fullStars)].map((_, index) => (
          <Star
            key={`full-${index}`}
            className={clsx(
              sizeMap[size],
              colorMap[color],
              interactive && 'hover:scale-110 transition-transform'
            )}
            onClick={() => handleStarClick(index)}
          />
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <div className="relative" onClick={() => handleStarClick(fullStars)}>
            <Star
              className={clsx(
                sizeMap[size],
                'fill-gray-200 text-gray-200',
                interactive && 'hover:scale-110 transition-transform'
              )}
            />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star
                className={clsx(
                  sizeMap[size],
                  colorMap[color]
                )}
              />
            </div>
          </div>
        )}

        {/* Empty stars */}
        {[...Array(emptyStars)].map((_, index) => (
          <Star
            key={`empty-${index}`}
            className={clsx(
              sizeMap[size],
              'fill-gray-200 text-gray-200',
              interactive && 'hover:scale-110 transition-transform'
            )}
            onClick={() => handleStarClick(fullStars + (hasHalfStar ? 1 : 0) + index)}
          />
        ))}
      </div>

      {/* Rating text */}
      {showNumber && (
        <div className="flex items-center gap-1 ml-1">
          <span className={clsx(
            'font-medium',
            size === 'xs' && 'text-xs',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg',
            size === 'xl' && 'text-xl'
          )}>
            {rating.toFixed(1)}
          </span>
          {totalRatings !== undefined && (
            <span className={clsx(
              'text-gray-500',
              size === 'xs' && 'text-xs',
              size === 'sm' && 'text-sm',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg'
            )}>
              ({totalRatings} {totalRatings === 1 ? 'Bewertung' : 'Bewertungen'})
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default RatingDisplay