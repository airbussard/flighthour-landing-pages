import { LRUCache } from 'lru-cache'

// In-memory cache for frequently accessed data
export class MemoryCache<T> {
  private cache: LRUCache<string, T>

  constructor(options: {
    max?: number
    ttl?: number
  } = {}) {
    this.cache = new LRUCache({
      max: options.max || 500,
      ttl: options.ttl || 1000 * 60 * 5, // 5 minutes default
    })
  }

  get(key: string): T | undefined {
    return this.cache.get(key)
  }

  set(key: string, value: T): void {
    this.cache.set(key, value)
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

// Cache key generators
export function generateCacheKey(...parts: (string | number)[]): string {
  return parts.join(':')
}

// Stale-while-revalidate pattern
export class StaleWhileRevalidate<T> {
  private cache: MemoryCache<{ data: T; timestamp: number }>
  private staleTime: number
  private fetcher: (key: string) => Promise<T>

  constructor(options: {
    staleTime?: number
    cacheTime?: number
    fetcher: (key: string) => Promise<T>
  }) {
    this.cache = new MemoryCache({ ttl: options.cacheTime || 1000 * 60 * 60 }) // 1 hour default
    this.staleTime = options.staleTime || 1000 * 60 * 5 // 5 minutes default
    this.fetcher = options.fetcher
  }

  async get(key: string): Promise<T> {
    const cached = this.cache.get(key)
    
    if (!cached) {
      // Cache miss - fetch and cache
      const data = await this.fetcher(key)
      this.cache.set(key, { data, timestamp: Date.now() })
      return data
    }
    
    const isStale = Date.now() - cached.timestamp > this.staleTime
    
    if (isStale) {
      // Return stale data immediately and revalidate in background
      this.revalidate(key)
    }
    
    return cached.data
  }

  private async revalidate(key: string): Promise<void> {
    try {
      const data = await this.fetcher(key)
      this.cache.set(key, { data, timestamp: Date.now() })
    } catch (error) {
      console.error(`Failed to revalidate cache for key ${key}:`, error)
    }
  }

  invalidate(key: string): void {
    this.cache.delete(key)
  }

  invalidatePattern(pattern: RegExp): void {
    // This would need access to all keys, which LRUCache doesn't provide directly
    // In production, consider using Redis for pattern-based invalidation
    console.warn('Pattern-based invalidation not supported with in-memory cache')
  }
}

// Next.js specific caching utilities
export const cacheHeaders = {
  static: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
  revalidate: (seconds: number) => ({
    'Cache-Control': `s-maxage=${seconds}, stale-while-revalidate`,
  }),
  noCache: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
}

// Database query result caching
export function createQueryCache<T>() {
  const cache = new MemoryCache<T>({ ttl: 1000 * 60 * 5 }) // 5 minutes
  
  return {
    async get(
      key: string,
      fetcher: () => Promise<T>,
      options?: { ttl?: number }
    ): Promise<T> {
      const cached = cache.get(key)
      if (cached) return cached
      
      const data = await fetcher()
      cache.set(key, data)
      return data
    },
    
    invalidate(key: string) {
      cache.delete(key)
    },
    
    invalidateAll() {
      cache.clear()
    },
  }
}