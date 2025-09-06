import { prisma } from '@eventhour/database'

// Health check interface
interface HealthCheck {
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  message?: string
  responseTime?: number
  details?: any
}

// System health status
interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  checks: HealthCheck[]
  version: string
  uptime: number
}

// Health check functions
export async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now()
  
  try {
    await prisma.$queryRaw`SELECT 1`
    const responseTime = Date.now() - start
    
    return {
      name: 'database',
      status: responseTime < 100 ? 'healthy' : 'degraded',
      responseTime,
      message: 'Database connection successful',
    }
  } catch (error) {
    return {
      name: 'database',
      status: 'unhealthy',
      message: `Database connection failed: ${error}`,
    }
  }
}

export async function checkRedis(): Promise<HealthCheck> {
  // Implement Redis health check if using Redis
  return {
    name: 'redis',
    status: 'healthy',
    message: 'Redis not configured',
  }
}

export async function checkExternalAPIs(): Promise<HealthCheck> {
  const apis = [
    { name: 'payment', url: process.env.PAYMENT_API_URL },
    { name: 'email', url: process.env.EMAIL_API_URL },
  ]
  
  const results = await Promise.all(
    apis.map(async (api) => {
      if (!api.url) return { name: api.name, status: 'skipped' }
      
      const start = Date.now()
      try {
        const response = await fetch(`${api.url}/health`, {
          signal: AbortSignal.timeout(5000),
        })
        
        return {
          name: api.name,
          status: response.ok ? 'healthy' : 'degraded',
          responseTime: Date.now() - start,
        }
      } catch {
        return {
          name: api.name,
          status: 'unhealthy',
        }
      }
    })
  )
  
  const unhealthy = results.filter(r => r.status === 'unhealthy')
  const degraded = results.filter(r => r.status === 'degraded')
  
  return {
    name: 'external_apis',
    status: unhealthy.length > 0 ? 'unhealthy' : degraded.length > 0 ? 'degraded' : 'healthy',
    details: results,
  }
}

export async function checkDiskSpace(): Promise<HealthCheck> {
  // This would need a platform-specific implementation
  // For now, return a mock healthy status
  return {
    name: 'disk_space',
    status: 'healthy',
    message: 'Disk space check not implemented',
  }
}

export async function checkMemory(): Promise<HealthCheck> {
  const used = process.memoryUsage()
  const heapUsedPercent = (used.heapUsed / used.heapTotal) * 100
  
  return {
    name: 'memory',
    status: heapUsedPercent > 90 ? 'unhealthy' : heapUsedPercent > 70 ? 'degraded' : 'healthy',
    details: {
      heapUsed: Math.round(used.heapUsed / 1024 / 1024),
      heapTotal: Math.round(used.heapTotal / 1024 / 1024),
      rss: Math.round(used.rss / 1024 / 1024),
      external: Math.round(used.external / 1024 / 1024),
      heapUsedPercent: Math.round(heapUsedPercent),
    },
  }
}

// Main health check endpoint
export async function getSystemHealth(): Promise<SystemHealth> {
  const checks = await Promise.all([
    checkDatabase(),
    checkRedis(),
    checkExternalAPIs(),
    checkDiskSpace(),
    checkMemory(),
  ])
  
  const unhealthyChecks = checks.filter(c => c.status === 'unhealthy')
  const degradedChecks = checks.filter(c => c.status === 'degraded')
  
  const status = unhealthyChecks.length > 0 
    ? 'unhealthy' 
    : degradedChecks.length > 0 
    ? 'degraded' 
    : 'healthy'
  
  return {
    status,
    timestamp: new Date().toISOString(),
    checks,
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    uptime: process.uptime(),
  }
}

// Readiness check (for Kubernetes)
export async function isReady(): Promise<boolean> {
  try {
    const dbCheck = await checkDatabase()
    return dbCheck.status !== 'unhealthy'
  } catch {
    return false
  }
}

// Liveness check (for Kubernetes)
export function isAlive(): boolean {
  // Simple check that the process is responding
  return true
}

// Metrics endpoint data
export function getMetrics(): string {
  const metrics: string[] = []
  
  // Process metrics
  const mem = process.memoryUsage()
  metrics.push(`# HELP nodejs_heap_size_total_bytes Process heap size`)
  metrics.push(`# TYPE nodejs_heap_size_total_bytes gauge`)
  metrics.push(`nodejs_heap_size_total_bytes ${mem.heapTotal}`)
  
  metrics.push(`# HELP nodejs_heap_size_used_bytes Process heap used`)
  metrics.push(`# TYPE nodejs_heap_size_used_bytes gauge`)
  metrics.push(`nodejs_heap_size_used_bytes ${mem.heapUsed}`)
  
  metrics.push(`# HELP nodejs_process_uptime_seconds Process uptime`)
  metrics.push(`# TYPE nodejs_process_uptime_seconds counter`)
  metrics.push(`nodejs_process_uptime_seconds ${process.uptime()}`)
  
  return metrics.join('\n')
}