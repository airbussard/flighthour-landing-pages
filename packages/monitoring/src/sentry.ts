import * as Sentry from '@sentry/nextjs'

// Sentry configuration
export function initSentry() {
  const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
  
  if (!SENTRY_DSN) {
    console.log('Sentry DSN not configured, skipping initialization')
    return
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.NODE_ENV,
    
    // Performance Monitoring
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Release tracking
    release: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    
    // Integrations
    integrations: [
      new Sentry.BrowserTracing({
        routingInstrumentation: Sentry.nextRouterInstrumentation,
      }),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    
    // Filtering
    beforeSend(event, hint) {
      // Filter out non-error events in development
      if (process.env.NODE_ENV === 'development' && event.level !== 'error') {
        return null
      }
      
      // Filter sensitive data
      if (event.request) {
        // Remove auth headers
        if (event.request.headers) {
          delete event.request.headers['authorization']
          delete event.request.headers['cookie']
        }
        
        // Remove sensitive query params
        if (event.request.query_string) {
          event.request.query_string = event.request.query_string
            .replace(/token=[^&]+/g, 'token=***')
            .replace(/password=[^&]+/g, 'password=***')
        }
      }
      
      // Add user context if available
      if (event.user) {
        event.user = {
          id: event.user.id,
          email: maskEmail(event.user.email || ''),
        }
      }
      
      return event
    },
    
    // Ignore certain errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      /Failed to fetch/,
      /NetworkError/,
      /Load failed/,
    ],
  })
}

// User identification
export function identifyUser(user: { id: string; email: string; role?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    role: user.role,
  })
}

// Clear user on logout
export function clearUser() {
  Sentry.setUser(null)
}

// Custom error reporting
export function reportError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    contexts: {
      custom: context,
    },
  })
}

// Performance monitoring
export function measureTransaction(
  name: string,
  operation: string,
  callback: () => Promise<any>
) {
  const transaction = Sentry.startTransaction({
    name,
    op: operation,
  })
  
  Sentry.getCurrentHub().configureScope(scope => scope.setSpan(transaction))
  
  return callback()
    .then(result => {
      transaction.setStatus('ok')
      return result
    })
    .catch(error => {
      transaction.setStatus('internal_error')
      throw error
    })
    .finally(() => {
      transaction.finish()
    })
}

// Breadcrumb logging
export function addBreadcrumb(
  message: string,
  category: string,
  level: Sentry.SeverityLevel = 'info',
  data?: Record<string, any>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  })
}

// Feature flag tracking
export function trackFeatureFlag(flag: string, value: boolean) {
  Sentry.setTag(`feature.${flag}`, value)
}

// Custom metrics
export function trackMetric(name: string, value: number, unit: string = 'none') {
  Sentry.setMeasurement(name, value, unit)
}

// Helper function to mask email
function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')
  if (!domain) return '***'
  
  const maskedLocal = localPart.charAt(0) + 
    '*'.repeat(Math.max(localPart.length - 2, 1)) + 
    localPart.charAt(localPart.length - 1)
  
  return `${maskedLocal}@${domain}`
}