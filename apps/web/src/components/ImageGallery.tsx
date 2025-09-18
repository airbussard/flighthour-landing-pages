'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, X, Expand } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

interface Image {
  filename: string
  altText?: string
}

interface ImageGalleryProps {
  images: Image[]
  title: string
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
        <p className="text-gray-500">Kein Bild verfügbar</p>
      </div>
    )
  }

  // If only one image, show simple view
  if (images.length === 1) {
    return (
      <div className="aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden">
        <img
          src={images[0].filename}
          alt={images[0].altText || title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = '/images/experiences/default.jpg'
          }}
        />
      </div>
    )
  }

  const currentImage = images[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && images.length > 1) {
      goToNext()
    }
    if (isRightSwipe && images.length > 1) {
      goToPrevious()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (images.length <= 1) return

      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, isFullscreen, images.length])

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        {/* Main Image Container */}
        <div
          className="relative aspect-[16/9] bg-gray-100 rounded-xl overflow-hidden group"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={currentImage.filename}
              alt={currentImage.altText || title}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onError={(e) => {
                e.currentTarget.src = '/images/experiences/default.jpg'
              }}
            />
          </AnimatePresence>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Vorheriges Bild"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Nächstes Bild"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
            aria-label="Vollbild"
          >
            <Expand className="h-5 w-5" />
          </button>
        </div>

        {/* Thumbnail Strip */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar" style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitScrollbar: { display: 'none' }
          }}>
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={clsx(
                  'flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all',
                  index === currentIndex
                    ? 'border-eventhour-yellow ring-2 ring-eventhour-yellow/50'
                    : 'border-transparent hover:border-gray-300'
                )}
              >
                <img
                  src={image.filename}
                  alt={image.altText || `Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/experiences/default.jpg'
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setIsFullscreen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 z-10"
              aria-label="Schließen"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Fullscreen Image */}
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <img
                src={currentImage.filename}
                alt={currentImage.altText || title}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Navigation in Fullscreen */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToPrevious()
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/20"
                aria-label="Vorheriges Bild"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  goToNext()
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 text-white rounded-full hover:bg-white/20"
                aria-label="Nächstes Bild"
              >
                <ChevronRight className="h-8 w-8" />
              </button>

              {/* Counter in Fullscreen */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 text-white text-lg rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            </div>

            {/* Thumbnail Strip in Fullscreen */}
            <div className="absolute bottom-20 left-0 right-0 px-4">
              <div className="flex justify-center gap-2 overflow-x-auto pb-2 max-w-4xl mx-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      goToImage(index)
                    }}
                    className={clsx(
                      'flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all',
                      index === currentIndex
                        ? 'border-white ring-2 ring-white/50'
                        : 'border-transparent hover:border-white/50 opacity-70 hover:opacity-100'
                    )}
                  >
                    <img
                      src={image.filename}
                      alt={image.altText || `Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageGallery