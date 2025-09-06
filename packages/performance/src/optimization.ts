import pLimit from 'p-limit'

// Image optimization utilities
export const imageOptimization = {
  generateSrcSet(src: string, widths: number[] = [640, 750, 828, 1080, 1200]): string {
    return widths
      .map(w => `${src}?w=${w} ${w}w`)
      .join(', ')
  },

  generateSizes(breakpoints: { width: number; size: string }[]): string {
    return breakpoints
      .map(bp => `(max-width: ${bp.width}px) ${bp.size}`)
      .join(', ')
  },

  getOptimizedUrl(src: string, options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'auto'
  }): string {
    const params = new URLSearchParams()
    if (options.width) params.set('w', options.width.toString())
    if (options.height) params.set('h', options.height.toString())
    if (options.quality) params.set('q', options.quality.toString())
    if (options.format) params.set('fm', options.format)
    
    return `${src}?${params.toString()}`
  },
}

// Lazy loading utilities
export function lazyLoad<T>(
  loader: () => Promise<T>
): { load: () => Promise<T>; preload: () => void } {
  let promise: Promise<T> | null = null
  
  return {
    load: () => {
      if (!promise) {
        promise = loader()
      }
      return promise
    },
    preload: () => {
      if (!promise) {
        promise = loader()
      }
    },
  }
}

// Debounce function for search and other frequent operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle function for scroll and resize handlers
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => { inThrottle = false }, limit)
    }
  }
}

// Batch operations for better performance
export class BatchProcessor<T, R> {
  private batch: T[] = []
  private timer: NodeJS.Timeout | null = null
  private processor: (items: T[]) => Promise<R[]>
  private batchSize: number
  private delay: number
  private pendingCallbacks: Map<T, (result: R) => void> = new Map()

  constructor(options: {
    processor: (items: T[]) => Promise<R[]>
    batchSize?: number
    delay?: number
  }) {
    this.processor = options.processor
    this.batchSize = options.batchSize || 10
    this.delay = options.delay || 10
  }

  async add(item: T): Promise<R> {
    return new Promise((resolve) => {
      this.batch.push(item)
      this.pendingCallbacks.set(item, resolve)
      
      if (this.batch.length >= this.batchSize) {
        this.flush()
      } else {
        this.scheduleFlush()
      }
    })
  }

  private scheduleFlush() {
    if (this.timer) return
    
    this.timer = setTimeout(() => {
      this.flush()
    }, this.delay)
  }

  private async flush() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    
    if (this.batch.length === 0) return
    
    const items = [...this.batch]
    const callbacks = new Map(this.pendingCallbacks)
    
    this.batch = []
    this.pendingCallbacks.clear()
    
    try {
      const results = await this.processor(items)
      items.forEach((item, index) => {
        const callback = callbacks.get(item)
        if (callback) callback(results[index])
      })
    } catch (error) {
      // Handle error - reject all pending promises
      callbacks.forEach(callback => callback(error as R))
    }
  }
}

// Concurrent request limiter
export function createConcurrencyLimiter(concurrency: number = 5) {
  return pLimit(concurrency)
}

// Virtual scrolling helper
export function calculateVisibleItems<T>(options: {
  items: T[]
  containerHeight: number
  itemHeight: number
  scrollTop: number
  overscan?: number
}): { visible: T[]; startIndex: number; endIndex: number } {
  const { items, containerHeight, itemHeight, scrollTop, overscan = 3 } = options
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2
  const endIndex = Math.min(items.length, startIndex + visibleCount)
  
  return {
    visible: items.slice(startIndex, endIndex),
    startIndex,
    endIndex,
  }
}

// Request deduplication
export class RequestDeduplicator<T> {
  private pending: Map<string, Promise<T>> = new Map()

  async execute(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const existing = this.pending.get(key)
    if (existing) return existing
    
    const promise = fetcher().finally(() => {
      this.pending.delete(key)
    })
    
    this.pending.set(key, promise)
    return promise
  }
}