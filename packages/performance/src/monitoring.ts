import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, Metric } from 'web-vitals'

// Web Vitals monitoring
export function initWebVitals(options?: {
  onReport?: (metric: Metric) => void
  reportToAnalytics?: boolean
}) {
  const reportMetric = (metric: Metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value)
    }
    
    // Custom reporting
    if (options?.onReport) {
      options.onReport(metric)
    }
    
    // Send to analytics
    if (options?.reportToAnalytics && typeof window !== 'undefined') {
      if ((window as any).gtag) {
        (window as any).gtag('event', metric.name, {
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }
    }
  }

  onCLS(reportMetric)
  onFID(reportMetric)
  onFCP(reportMetric)
  onLCP(reportMetric)
  onTTFB(reportMetric)
  onINP(reportMetric)
}

// Performance observer for custom metrics
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()
  private measures: Map<string, number[]> = new Map()

  mark(name: string): void {
    this.marks.set(name, performance.now())
    if (typeof window !== 'undefined') {
      performance.mark(name)
    }
  }

  measure(name: string, startMark: string, endMark?: string): number {
    const start = this.marks.get(startMark)
    if (!start) {
      console.warn(`Start mark '${startMark}' not found`)
      return 0
    }

    const end = endMark ? this.marks.get(endMark) : performance.now()
    if (!end) {
      console.warn(`End mark '${endMark}' not found`)
      return 0
    }

    const duration = end - start
    
    // Store measure
    if (!this.measures.has(name)) {
      this.measures.set(name, [])
    }
    this.measures.get(name)!.push(duration)
    
    // Browser Performance API
    if (typeof window !== 'undefined') {
      performance.measure(name, startMark, endMark)
    }
    
    return duration
  }

  getMetrics(name: string): {
    count: number
    min: number
    max: number
    avg: number
    p50: number
    p95: number
    p99: number
  } | null {
    const measures = this.measures.get(name)
    if (!measures || measures.length === 0) return null
    
    const sorted = [...measures].sort((a, b) => a - b)
    const count = sorted.length
    
    return {
      count,
      min: sorted[0],
      max: sorted[count - 1],
      avg: sorted.reduce((a, b) => a + b, 0) / count,
      p50: sorted[Math.floor(count * 0.5)],
      p95: sorted[Math.floor(count * 0.95)],
      p99: sorted[Math.floor(count * 0.99)],
    }
  }

  clear(): void {
    this.marks.clear()
    this.measures.clear()
  }
}

// Resource timing analysis
export function analyzeResourceTimings(): {
  scripts: PerformanceResourceTiming[]
  styles: PerformanceResourceTiming[]
  images: PerformanceResourceTiming[]
  fonts: PerformanceResourceTiming[]
  total: number
  slowest: PerformanceResourceTiming[]
} {
  if (typeof window === 'undefined') {
    return { scripts: [], styles: [], images: [], fonts: [], total: 0, slowest: [] }
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  const categorized = {
    scripts: resources.filter(r => r.initiatorType === 'script'),
    styles: resources.filter(r => r.initiatorType === 'link' && r.name.includes('.css')),
    images: resources.filter(r => r.initiatorType === 'img'),
    fonts: resources.filter(r => r.initiatorType === 'css' && r.name.includes('font')),
  }
  
  const slowest = [...resources]
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10)
  
  return {
    ...categorized,
    total: resources.length,
    slowest,
  }
}

// Bundle size tracking
export function trackBundleSize(): {
  javascript: number
  css: number
  images: number
  fonts: number
  total: number
} {
  if (typeof window === 'undefined') {
    return { javascript: 0, css: 0, images: 0, fonts: 0, total: 0 }
  }

  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
  
  const sizes = {
    javascript: 0,
    css: 0,
    images: 0,
    fonts: 0,
    total: 0,
  }
  
  resources.forEach(resource => {
    const size = resource.transferSize || 0
    sizes.total += size
    
    if (resource.initiatorType === 'script' || resource.name.endsWith('.js')) {
      sizes.javascript += size
    } else if (resource.name.endsWith('.css')) {
      sizes.css += size
    } else if (resource.initiatorType === 'img') {
      sizes.images += size
    } else if (resource.name.includes('font')) {
      sizes.fonts += size
    }
  })
  
  return sizes
}

// Memory usage monitoring (Chrome only)
export function getMemoryUsage(): {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  percentUsed: number
} | null {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    return null
  }
  
  const memory = (performance as any).memory
  
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    percentUsed: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
  }
}