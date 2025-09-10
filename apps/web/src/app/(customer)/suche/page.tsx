'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Container, Section, SearchBar, SearchFilters, SearchResults } from '@eventhour/ui'
import { Grid2X2, List } from 'lucide-react'
import { clsx } from 'clsx'

function SearchPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [facets, setFacets] = useState<any>({})

  const query = searchParams.get('q') || ''
  const category = searchParams.getAll('category')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const sortBy = searchParams.get('sortBy') || 'relevance'

  const [filters, setFilters] = useState({
    categories: category,
    priceRange: maxPrice ? Number(maxPrice) : 1000,
    duration: [],
    rating: 0,
  })

  // Fetch search results
  const fetchResults = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.append('q', query)
      filters.categories.forEach((c) => params.append('category', c))
      if (minPrice) params.append('minPrice', minPrice)
      if (filters.priceRange < 1000) params.append('maxPrice', String(filters.priceRange))
      params.append('sortBy', sortBy)

      const response = await fetch(`/api/search?${params}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()

      setResults(data.experiences || [])
      setFacets(data.facets || {})
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }, [query, filters, sortBy, minPrice])

  // Fetch suggestions
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const response = await fetch(`/api/search/suggestions?q=${searchQuery}&t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      })
      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    }
  }, [])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  const handleSearch = (newQuery: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newQuery) {
      params.set('q', newQuery)
    } else {
      params.delete('q')
    }
    router.push(`/suche?${params}`)
  }

  const handleFilterChange = (filterId: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterId]: value,
    }))

    // Update URL params
    const params = new URLSearchParams(searchParams.toString())

    if (filterId === 'categories') {
      params.delete('category')
      value.forEach((c: string) => params.append('category', c))
    } else if (filterId === 'priceRange') {
      if (value < 1000) {
        params.set('maxPrice', String(value))
      } else {
        params.delete('maxPrice')
      }
    }

    router.push(`/suche?${params}`)
  }

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', newSort)
    router.push(`/suche?${params}`)
  }

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: 1000,
      duration: [],
      rating: 0,
    })
    router.push('/suche')
  }

  // Get recent searches from localStorage
  const getRecentSearches = (): string[] => {
    if (typeof window === 'undefined') return []
    const recent = localStorage.getItem('recentSearches')
    return recent ? JSON.parse(recent) : []
  }

  // Save search to localStorage
  const saveRecentSearch = (search: string) => {
    if (typeof window === 'undefined' || !search) return
    const recent = getRecentSearches()
    const updated = [search, ...recent.filter((s: string) => s !== search)].slice(0, 5)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const filterGroups = [
    {
      id: 'categories',
      label: 'Kategorien',
      type: 'checkbox' as const,
      options:
        facets.categories?.map((c: any) => ({
          value: c.name,
          label: c.name,
          count: c.count,
        })) || [],
    },
    {
      id: 'priceRange',
      label: 'Maximaler Preis',
      type: 'range' as const,
      min: 0,
      max: 1000,
      step: 50,
    },
    {
      id: 'duration',
      label: 'Dauer',
      type: 'checkbox' as const,
      options:
        facets.durations?.map((d: any) => ({
          value: d.duration,
          label: d.duration,
          count: d.count,
        })) || [],
    },
    {
      id: 'rating',
      label: 'Mindestbewertung',
      type: 'radio' as const,
      options: [
        { value: '0', label: 'Alle' },
        { value: '3', label: '3+ Sterne' },
        { value: '4', label: '4+ Sterne' },
        { value: '4.5', label: '4.5+ Sterne' },
      ],
    },
  ]

  return (
    <>
      {/* Search Header */}
      <Section className="bg-gray-50 py-8">
        <Container>
          <div className="max-w-4xl mx-auto">
            <SearchBar
              value={query}
              onChange={fetchSuggestions}
              onSubmit={(value) => {
                saveRecentSearch(value)
                handleSearch(value)
              }}
              suggestions={suggestions}
              recentSearches={getRecentSearches()}
              showLocation
              autoFocus
            />
          </div>
        </Container>
      </Section>

      {/* Results Section */}
      <Section className="py-8">
        <Container>
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <SearchFilters
                filters={filterGroups}
                selectedFilters={filters}
                onChange={handleFilterChange}
                onClear={clearFilters}
              />
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">
                    {query ? `Ergebnisse fuer "${query}"` : 'Alle Erlebnisse'}
                  </h1>
                  {!loading && (
                    <p className="text-gray-600 mt-1">{results.length} Erlebnisse gefunden</p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
                  >
                    <option value="relevance">Relevanz</option>
                    <option value="price_asc">Preis aufsteigend</option>
                    <option value="price_desc">Preis absteigend</option>
                    <option value="rating">Beste Bewertung</option>
                    <option value="newest">Neueste zuerst</option>
                  </select>

                  {/* View Toggle */}
                  <div className="flex items-center bg-white border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setView('grid')}
                      className={clsx(
                        'p-2 transition-colors',
                        view === 'grid'
                          ? 'bg-eventhour-yellow text-eventhour-black'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <Grid2X2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setView('list')}
                      className={clsx(
                        'p-2 transition-colors',
                        view === 'list'
                          ? 'bg-eventhour-yellow text-eventhour-black'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      <List className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Filters */}
              <div className="lg:hidden mb-4">
                <SearchFilters
                  filters={filterGroups}
                  selectedFilters={filters}
                  onChange={handleFilterChange}
                  onClear={clearFilters}
                  mobile
                />
              </div>

              {/* Results Grid/List */}
              <SearchResults
                results={results.map((exp) => ({
                  id: exp.id,
                  title: exp.title,
                  description: exp.description || exp.shortDescription,
                  price: exp.retailPrice ? exp.retailPrice / 100 : 0, // Convert from cents to euros
                  location: exp.city || 'Deutschland',
                  duration: exp.duration ? `${exp.duration} Min.` : '',
                  rating: exp.popularityScore ? exp.popularityScore / 20 : 0, // Convert popularity to rating scale
                  reviewCount: 0, // No review count in schema
                  image: exp.images?.[0]?.url,
                  category: exp.category?.name || '',
                  isNew: false, // No isNew field in schema
                }))}
                loading={loading}
                view={view}
                onResultClick={(result) => router.push(`/erlebnisse/${result.id}`)}
              />

              {/* Pagination */}
              {!loading && results.length > 0 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex gap-2">{/* Pagination buttons would go here */}</nav>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <Section className="py-8">
          <Container>
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </Container>
        </Section>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
