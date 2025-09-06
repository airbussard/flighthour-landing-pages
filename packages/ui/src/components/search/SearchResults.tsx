'use client'

import React from 'react'
import { MapPin, Star, Clock, Euro } from 'lucide-react'
import { clsx } from 'clsx'
import { Card } from '../Card'
import { Button } from '../Button'
import { motion } from 'framer-motion'

export interface SearchResult {
  id: string
  title: string
  description: string
  price: number
  location: string
  duration: string
  rating: number
  reviewCount: number
  image?: string
  category: string
  isNew?: boolean
  isFavorite?: boolean
}

export interface SearchResultsProps {
  results: SearchResult[]
  loading?: boolean
  view?: 'grid' | 'list'
  onResultClick?: (result: SearchResult) => void
  onFavoriteToggle?: (resultId: string) => void
  className?: string
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  loading = false,
  view = 'grid',
  onResultClick,
  onFavoriteToggle,
  className,
}) => {
  if (loading) {
    return (
      <div className={clsx('space-y-4', className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            {view === 'list' ? (
              <div className="bg-white rounded-xl p-6 flex gap-6">
                <div className="w-48 h-32 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="flex gap-4">
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                    <div className="h-4 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            ) : (
              <Card className="animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-4" />
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              </Card>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold mb-2">Keine Ergebnisse gefunden</h3>
        <p className="text-gray-600">Versuche es mit anderen Suchbegriffen oder Filtern</p>
      </div>
    )
  }

  if (view === 'list') {
    return (
      <div className={clsx('space-y-4', className)}>
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card hoverable className="cursor-pointer" onClick={() => onResultClick?.(result)}>
              <div className="flex gap-6">
                <div className="relative w-48 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {result.image && (
                    <img
                      src={result.image}
                      alt={result.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {result.isNew && (
                    <div className="absolute top-2 left-2 bg-eventhour-yellow text-eventhour-black text-xs font-bold px-2 py-1 rounded">
                      NEU
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-xs text-gray-500 uppercase">{result.category}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{result.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-eventhour-yellow">
                        {result.price}€
                      </div>
                      <div className="text-xs text-gray-500">pro Person</div>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{result.description}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{result.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{result.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-eventhour-yellow text-eventhour-yellow" />
                      <span className="font-medium">{result.rating}</span>
                      <span className="text-gray-500">({result.reviewCount})</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className={clsx('grid gap-6', 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', className)}>
      {results.map((result, index) => (
        <motion.div
          key={result.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card
            hoverable
            padding="none"
            className="cursor-pointer overflow-hidden h-full flex flex-col"
            onClick={() => onResultClick?.(result)}
          >
            <div className="relative aspect-[4/3] bg-gray-200">
              {result.image && (
                <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {result.isNew && (
                <div className="absolute top-4 left-4 bg-eventhour-yellow text-eventhour-black text-xs font-bold px-2 py-1 rounded">
                  NEU
                </div>
              )}

              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-eventhour-black px-3 py-1 rounded-full font-bold">
                {result.price}€
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col">
              <span className="text-xs text-gray-500 uppercase mb-1">{result.category}</span>

              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{result.title}</h3>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-1">{result.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{result.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{result.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-eventhour-yellow text-eventhour-yellow" />
                    <span className="font-medium text-sm">{result.rating}</span>
                    <span className="text-sm text-gray-500">({result.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
