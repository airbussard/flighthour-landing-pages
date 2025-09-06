'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export interface UseSearchOptions {
  debounceMs?: number
  minLength?: number
  onSearch?: (query: string) => void | Promise<void>
}

export function useSearch(initialQuery = '', options: UseSearchOptions = {}) {
  const { debounceMs = 300, minLength = 2, onSearch } = options
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const [isSearching, setIsSearching] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Debounce query
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedQuery(query)
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, debounceMs])

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= minLength && onSearch) {
      setIsSearching(true)
      Promise.resolve(onSearch(debouncedQuery)).finally(() => {
        setIsSearching(false)
      })
    }
  }, [debouncedQuery, minLength, onSearch])

  const search = useCallback((newQuery: string) => {
    setQuery(newQuery)
  }, [])

  const clear = useCallback(() => {
    setQuery('')
    setDebouncedQuery('')
  }, [])

  return {
    query,
    debouncedQuery,
    isSearching,
    search,
    clear,
  }
}

export function useRecentSearches(key = 'recentSearches', maxItems = 10) {
  const [searches, setSearches] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(key)
      if (stored) {
        setSearches(JSON.parse(stored))
      }
    }
  }, [key])

  const addSearch = useCallback((search: string) => {
    if (!search.trim()) return

    const updated = [
      search,
      ...searches.filter((s) => s !== search),
    ].slice(0, maxItems)

    setSearches(updated)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(updated))
    }
  }, [searches, key, maxItems])

  const removeSearch = useCallback((search: string) => {
    const updated = searches.filter((s) => s !== search)
    setSearches(updated)
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(updated))
    }
  }, [searches, key])

  const clearSearches = useCallback(() => {
    setSearches([])
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  }, [key])

  return {
    searches,
    addSearch,
    removeSearch,
    clearSearches,
  }
}