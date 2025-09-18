'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Star, AlertCircle, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../Button'
import { Card } from '../Card'
import { RatingDisplay } from './RatingDisplay'
import { clsx } from 'clsx'

declare global {
  interface Window {
    grecaptcha: any
  }
}

export interface RatingFormProps {
  experienceId: string
  experienceName: string
  onSubmit?: (rating: RatingSubmission) => Promise<void>
  existingRating?: {
    rating: number
    title?: string
    comment?: string
  }
  recaptchaSiteKey?: string
  className?: string
}

export interface RatingSubmission {
  rating: number
  title: string
  comment: string
  recaptchaToken?: string
}

export const RatingForm: React.FC<RatingFormProps> = ({
  experienceId,
  experienceName,
  onSubmit,
  existingRating,
  recaptchaSiteKey,
  className,
}) => {
  const [rating, setRating] = useState(existingRating?.rating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState(existingRating?.title || '')
  const [comment, setComment] = useState(existingRating?.comment || '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    // Load reCAPTCHA script if site key is provided
    if (recaptchaSiteKey && !window.grecaptcha) {
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`
      script.async = true
      script.defer = true
      script.onload = () => {
        setRecaptchaLoaded(true)
      }
      document.head.appendChild(script)
    } else if (window.grecaptcha) {
      setRecaptchaLoaded(true)
    }
  }, [recaptchaSiteKey])

  const getRatingLabel = (value: number) => {
    switch (value) {
      case 1: return 'Sehr schlecht'
      case 2: return 'Schlecht'
      case 3: return 'Durchschnittlich'
      case 4: return 'Gut'
      case 5: return 'Ausgezeichnet'
      default: return ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      setError('Bitte wählen Sie eine Bewertung aus')
      return
    }

    if (comment.length > 500) {
      setError('Der Kommentar darf maximal 500 Zeichen lang sein')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      let recaptchaToken: string | undefined

      // Get reCAPTCHA token if available
      if (recaptchaSiteKey && recaptchaLoaded && window.grecaptcha) {
        try {
          recaptchaToken = await window.grecaptcha.execute(recaptchaSiteKey, {
            action: 'submit_rating'
          })
        } catch (err) {
          console.error('reCAPTCHA error:', err)
        }
      }

      await onSubmit?.({
        rating,
        title,
        comment,
        recaptchaToken,
      })

      setSuccess(true)

      // Reset form after successful submission
      if (!existingRating) {
        setTimeout(() => {
          setRating(0)
          setTitle('')
          setComment('')
          setSuccess(false)
        }, 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className={clsx('p-6', className)}>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">
            {existingRating ? 'Ihre Bewertung bearbeiten' : 'Bewertung abgeben'}
          </h3>
          <p className="text-sm text-gray-600">
            Teilen Sie Ihre Erfahrung mit "{experienceName}"
          </p>
        </div>

        {/* Star Rating */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Ihre Bewertung *
          </label>
          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoveredRating(value)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={clsx(
                      'h-8 w-8 transition-colors',
                      (hoveredRating || rating) >= value
                        ? 'fill-eventhour-yellow text-eventhour-yellow'
                        : 'fill-gray-200 text-gray-200'
                    )}
                  />
                </button>
              ))}
            </div>
            {(hoveredRating || rating) > 0 && (
              <span className="text-sm font-medium text-gray-700">
                {getRatingLabel(hoveredRating || rating)}
              </span>
            )}
          </div>
          {error && error.includes('Bewertung') && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titel (optional)
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            placeholder="Fassen Sie Ihre Erfahrung in wenigen Worten zusammen"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow focus:border-transparent"
          />
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Ihre Bewertung (optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Beschreiben Sie Ihre Erfahrung im Detail..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 text-right">
            {comment.length}/500 Zeichen
          </p>
        </div>

        {/* Error/Success Messages */}
        <AnimatePresence>
          {error && !error.includes('Bewertung') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg"
            >
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                {existingRating
                  ? 'Ihre Bewertung wurde erfolgreich aktualisiert!'
                  : 'Vielen Dank für Ihre Bewertung!'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || rating === 0}
            className="min-w-[150px]"
          >
            {isSubmitting
              ? 'Wird gesendet...'
              : existingRating
                ? 'Bewertung aktualisieren'
                : 'Bewertung abschicken'}
          </Button>
        </div>

        {/* reCAPTCHA Badge Info */}
        {recaptchaSiteKey && (
          <p className="text-xs text-gray-500 text-center">
            Diese Seite wird durch reCAPTCHA geschützt. Es gelten die{' '}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              Datenschutzerklärung
            </a>{' '}
            und{' '}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              Nutzungsbedingungen
            </a>{' '}
            von Google.
          </p>
        )}
      </form>
    </Card>
  )
}

export default RatingForm