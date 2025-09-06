import helmet from 'helmet'
import { Request, Response, NextFunction } from 'express'

// Security headers configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.googletagmanager.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://api.eventhour.de'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
})

// Additional custom security headers
export function customSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  // Permissions Policy (replacing Feature Policy)
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self)'
  )
  
  // Additional CORS headers if needed
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', 'https://eventhour.de')
  }
  
  // Cache control for sensitive pages
  if (req.path.includes('/admin') || req.path.includes('/account')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
  }
  
  next()
}

// CORS configuration
export const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    const allowedOrigins = [
      'https://eventhour.de',
      'https://www.eventhour.de',
      'https://api.eventhour.de',
    ]
    
    // Allow requests with no origin (like mobile apps)
    if (!origin) return callback(null, true)
    
    if (process.env.NODE_ENV === 'development') {
      // Allow localhost in development
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true)
      }
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400, // 24 hours
}

// Check for common security issues in headers
export function auditSecurityHeaders(headers: Record<string, string>): {
  issues: string[]
  score: number
} {
  const issues: string[] = []
  let score = 100
  
  // Check for required security headers
  const requiredHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Strict-Transport-Security',
    'Content-Security-Policy',
  ]
  
  requiredHeaders.forEach(header => {
    if (!headers[header.toLowerCase()]) {
      issues.push(`Missing ${header} header`)
      score -= 10
    }
  })
  
  // Check for problematic headers
  if (headers['x-powered-by']) {
    issues.push('X-Powered-By header should be removed')
    score -= 5
  }
  
  if (headers['server']) {
    issues.push('Server header reveals server information')
    score -= 5
  }
  
  // Check CSP configuration
  const csp = headers['content-security-policy']
  if (csp) {
    if (csp.includes("'unsafe-inline'")) {
      issues.push("CSP contains 'unsafe-inline' which weakens protection")
      score -= 10
    }
    if (csp.includes("'unsafe-eval'")) {
      issues.push("CSP contains 'unsafe-eval' which is dangerous")
      score -= 15
    }
  }
  
  return { issues, score: Math.max(0, score) }
}