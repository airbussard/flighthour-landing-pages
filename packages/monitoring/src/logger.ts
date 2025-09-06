import pino from 'pino'
import { createWriteStream } from 'pino-logflare'

// Logger configuration based on environment
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// Create base logger configuration
const baseConfig: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() }
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    req: (req) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
      headers: {
        host: req.headers.host,
        'user-agent': req.headers['user-agent'],
        referer: req.headers.referer,
      },
    }),
    res: (res) => ({
      statusCode: res.statusCode,
      headers: res.getHeaders(),
    }),
    err: pino.stdSerializers.err,
  },
}

// Development logger with pretty printing
const developmentLogger = pino({
  ...baseConfig,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
})

// Production logger
const productionLogger = pino(baseConfig)

// Export appropriate logger
export const logger = isDevelopment ? developmentLogger : productionLogger

// Structured logging helpers
export const log = {
  info: (message: string, data?: any) => logger.info(data, message),
  error: (message: string, error?: any, data?: any) => {
    logger.error({ err: error, ...data }, message)
  },
  warn: (message: string, data?: any) => logger.warn(data, message),
  debug: (message: string, data?: any) => logger.debug(data, message),
  trace: (message: string, data?: any) => logger.trace(data, message),
  
  // Specific logging methods
  request: (req: any, res: any, responseTime: number) => {
    logger.info({
      req,
      res,
      responseTime,
    }, `${req.method} ${req.url} ${res.statusCode} ${responseTime}ms`)
  },
  
  database: (operation: string, table: string, duration: number, data?: any) => {
    logger.debug({
      operation,
      table,
      duration,
      ...data,
    }, `Database ${operation} on ${table} took ${duration}ms`)
  },
  
  performance: (metric: string, value: number, unit: string = 'ms') => {
    logger.info({
      metric,
      value,
      unit,
    }, `Performance metric: ${metric} = ${value}${unit}`)
  },
  
  security: (event: string, data?: any) => {
    logger.warn({
      securityEvent: event,
      ...data,
    }, `Security event: ${event}`)
  },
  
  business: (event: string, data?: any) => {
    logger.info({
      businessEvent: event,
      ...data,
    }, `Business event: ${event}`)
  },
}

// Request ID middleware
export function requestIdMiddleware(req: any, res: any, next: any) {
  req.id = req.headers['x-request-id'] || generateRequestId()
  res.setHeader('X-Request-Id', req.id)
  next()
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Logging middleware
export function loggingMiddleware(req: any, res: any, next: any) {
  const start = Date.now()
  
  // Log request
  log.debug('Incoming request', {
    req,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })
  
  // Capture response
  const originalSend = res.send
  res.send = function (data: any) {
    res.send = originalSend
    const responseTime = Date.now() - start
    
    // Log response
    log.request(req, res, responseTime)
    
    // Log slow requests
    if (responseTime > 1000) {
      log.warn('Slow request detected', {
        req,
        responseTime,
      })
    }
    
    return res.send(data)
  }
  
  next()
}

// Error logging
export function errorLogger(err: Error, req: any, res: any, next: any) {
  log.error('Unhandled error', err, {
    req,
    stack: err.stack,
  })
  
  // Send error response
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode).json({
    error: isProduction ? 'Internal Server Error' : err.message,
    requestId: req.id,
  })
}

// Audit logging
export class AuditLogger {
  static log(action: string, userId: string, data?: any) {
    logger.info({
      audit: true,
      action,
      userId,
      timestamp: new Date().toISOString(),
      ...data,
    }, `Audit: ${action} by user ${userId}`)
  }
  
  static logDataAccess(userId: string, resource: string, action: 'read' | 'write' | 'delete') {
    this.log(`data_${action}`, userId, { resource })
  }
  
  static logAuthEvent(userId: string, event: 'login' | 'logout' | 'failed_login' | 'password_reset') {
    this.log(`auth_${event}`, userId)
  }
  
  static logAdminAction(adminId: string, action: string, targetId?: string) {
    this.log(`admin_${action}`, adminId, { targetId })
  }
}