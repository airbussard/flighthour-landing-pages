'use client'

import { useState, useEffect, useCallback } from 'react'
import { Package, Search, MapPin, Euro, Users, Tag, ToggleLeft, ToggleRight, Edit2, Plus } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import debounce from 'lodash/debounce'
import { Button } from '@eventhour/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Experience {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  locationName: string
  street?: string
  city: string
  postalCode: string
  country?: string
  latitude?: number
  longitude?: number
  duration: number
  maxParticipants: number | null
  retailPrice: number
  taxRate?: number
  purchasePrice: number
  categoryId?: string
  partnerId?: string
  searchKeywords?: string
  isActive: boolean
  createdAt?: string
  partner?: {
    companyName: string
    id: string
  }
  category?: {
    name: string
    id: string
  }
  _count?: {
    vouchers: number
  }
}

export default function AdminExperiencesPage() {
  const router = useRouter()
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchExperiences = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (filterStatus !== 'all') {
        params.append('isActive', filterStatus === 'active' ? 'true' : 'false')
      }

      const response = await fetch(`/api/admin/experiences?${params}`)
      const data = await response.json()

      if (data.success) {
        setExperiences(data.data)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching experiences:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, filterStatus])

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value)
      setCurrentPage(1)
    }, 300),
    []
  )

  const handleNewExperience = () => {
    router.push('/admin/erlebnisse/new/edit')
  }

  const toggleExperienceStatus = async (experienceId: string) => {
    setActionLoading(experienceId)
    try {
      const response = await fetch('/api/admin/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId,
          action: 'toggleStatus',
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Update the experience in the list
        setExperiences(prev =>
          prev.map(exp =>
            exp.id === experienceId
              ? { ...exp, isActive: !exp.isActive }
              : exp
          )
        )
      }
    } catch (error) {
      console.error('Error toggling experience status:', error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
        Aktiv
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full"></span>
        Inaktiv
      </span>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Erlebnis-Moderation</h1>
        <p className="text-gray-600">Prüfen und verwalten Sie alle Erlebnisse</p>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* New Experience Button */}
          <Button
            onClick={handleNewExperience}
            leftIcon={Plus}
            className="sm:w-auto"
          >
            Neues Erlebnis
          </Button>
          
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Suche nach Titel oder Beschreibung..."
                onChange={(e) => debouncedSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setFilterStatus('all')
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-eventhour-yellow text-eventhour-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => {
                setFilterStatus('active')
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'active'
                  ? 'bg-eventhour-yellow text-eventhour-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Aktiv
            </button>
            <button
              onClick={() => {
                setFilterStatus('inactive')
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'inactive'
                  ? 'bg-eventhour-yellow text-eventhour-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Inaktiv
            </button>
          </div>
        </div>
      </div>

      {/* Experiences Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500">Lade Erlebnisse...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Keine Erlebnisse gefunden</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Erlebnis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Partner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ort
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preis
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gutscheine
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {experiences.map((experience) => (
                  <tr key={experience.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {experience.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {experience.shortDescription}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {experience.partner?.companyName || '-'}
                    </td>
                    <td className="px-6 py-4">
                      {experience.category ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Tag className="h-3 w-3" />
                          {experience.category.name}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-900">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{experience.city}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          VK: {formatPrice(experience.retailPrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          EK: {formatPrice(experience.purchasePrice)}
                        </div>
                        <div className="text-xs text-green-600">
                          Provision: {formatPrice(experience.retailPrice - experience.purchasePrice)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <Tag className="h-3 w-3" />
                        {experience._count?.vouchers || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(experience.isActive)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/erlebnisse/${experience.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Bearbeiten"
                        >
                          <Edit2 className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => toggleExperienceStatus(experience.id)}
                          disabled={actionLoading === experience.id}
                          className="text-gray-600 hover:text-eventhour-yellow transition-colors disabled:opacity-50"
                          title={experience.isActive ? 'Deaktivieren' : 'Aktivieren'}
                        >
                          {actionLoading === experience.id ? (
                            <div className="animate-spin h-5 w-5 border-2 border-eventhour-yellow border-t-transparent rounded-full" />
                          ) : experience.isActive ? (
                            <ToggleRight className="h-5 w-5" />
                          ) : (
                            <ToggleLeft className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Zurück
              </button>
              <span className="text-sm text-gray-700">
                Seite {currentPage} von {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Weiter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}