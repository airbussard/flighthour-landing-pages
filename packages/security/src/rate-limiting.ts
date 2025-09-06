import rateLimit from 'express-rate-limit'
import { Request, Response } from 'express'

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Zu viele Anfragen von dieser IP, bitte versuchen Sie es später erneut',
  standardHeaders: true,
  legacyHeaders: false,
})

// Strict rate limiting for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Zu viele Anmeldeversuche, bitte versuchen Sie es in 15 Minuten erneut',
  skipSuccessfulRequests: true,
})

// Rate limiting for password reset
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 password reset requests per hour
  message: 'Zu viele Passwort-Zurücksetzen-Anfragen, bitte versuchen Sie es später erneut',
})

// Rate limiting for file uploads
export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 uploads per windowMs
  message: 'Zu viele Upload-Anfragen, bitte versuchen Sie es später erneut',
})

// Rate limiting for search endpoints
export const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 search requests per minute
  message: 'Zu viele Suchanfragen, bitte versuchen Sie es später erneut',
})

// Custom rate limiter with Redis store for distributed systems
export function createRedisRateLimiter(options: {
  windowMs: number
  max: number
  keyPrefix?: string
}) {
  return rateLimit({
    ...options,
    keyGenerator: (req: Request) => {
      // Use user ID if authenticated, otherwise use IP
      return req.user?.id || req.ip
    },
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        error: 'Rate limit exceeded',
        retryAfter: Math.round(options.windowMs / 1000),
      })
    },
  })
}

// Sliding window rate limiter for more accurate limiting
export class SlidingWindowRateLimiter {
  private requests: Map<string, number[]> = new Map()
  private windowMs: number
  private maxRequests: number

  constructor(windowMs: number, maxRequests: number) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs

    // Get existing requests for this identifier
    let timestamps = this.requests.get(identifier) || []
    
    // Remove old requests outside the window
    timestamps = timestamps.filter(time => time > windowStart)
    
    // Check if limit exceeded
    if (timestamps.length >= this.maxRequests) {
      return false
    }
    
    // Add current request
    timestamps.push(now)
    this.requests.set(identifier, timestamps)
    
    // Cleanup old entries periodically
    if (Math.random() < 0.01) {
      this.cleanup()
    }
    
    return true
  }

  private cleanup() {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    for (const [key, timestamps] of this.requests.entries()) {
      const filtered = timestamps.filter(time => time > windowStart)
      if (filtered.length === 0) {
        this.requests.delete(key)
      } else {
        this.requests.set(key, filtered)
      }
    }
  }

  reset(identifier: string) {
    this.requests.delete(identifier)
  }
}