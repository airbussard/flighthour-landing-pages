'use client'

import { useState, useEffect } from 'react'
import { Search, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, Building2, Eye } from 'lucide-react'
import { Button } from '@eventhour/ui'

interface Partner {
  id: string
  companyName: string
  email: string | null
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  isActive: boolean
  createdAt: string
  user: {
    email: string
    name: string | null
  }
  experiences: Array<{
    id: string
    title: string
    isActive: boolean
  }>
  _count: {
    experiences: number
    payouts: number
  }
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchPartners()
  }, [page, search, verificationFilter])

  const fetchPartners = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      })
      
      if (search) params.append('search', search)
      if (verificationFilter !== 'ALL') params.append('verificationStatus', verificationFilter)

      const response = await fetch(`/api/admin/partners?${params}`)
      const data = await response.json()

      if (data.success) {
        setPartners(data.data)
        setTotalPages(data.pagination.totalPages)
      } else {
        setError(data.error || 'Fehler beim Laden der Partner')
      }
    } catch (err) {
      setError('Fehler beim Laden der Partner')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (partnerId: string, verificationStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED', isActive?: boolean) => {
    try {
      const response = await fetch(`/api/admin/partners/${partnerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationStatus, isActive }),
      })

      const data = await response.json()

      if (data.success) {
        fetchPartners()
        setShowDetailModal(false)
        setSelectedPartner(null)
      } else {
        alert(data.error || 'Fehler beim Aktualisieren')
      }
    } catch (err) {
      alert('Fehler beim Aktualisieren')
    }
  }

  const getStatusIcon = (verificationStatus: string, isActive: boolean) => {
    if (!isActive) return <XCircle className="h-4 w-4" />
    switch (verificationStatus) {
      case 'VERIFIED':
        return <CheckCircle className="h-4 w-4" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (verificationStatus: string, isActive: boolean) => {
    if (!isActive) return 'bg-gray-100 text-gray-700'
    switch (verificationStatus) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-700'
      case 'REJECTED':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Partnerverwaltung</h1>
        <p className="text-gray-600">Verwalten Sie Partner und deren Status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ausstehend</p>
              <p className="text-2xl font-bold text-yellow-600">
                {partners.filter(p => p.verificationStatus === 'PENDING').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktiv</p>
              <p className="text-2xl font-bold text-green-600">
                {partners.filter(p => p.verificationStatus === 'VERIFIED' && p.isActive).length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gesperrt</p>
              <p className="text-2xl font-bold text-red-600">
                {partners.filter(p => !p.isActive || p.verificationStatus === 'REJECTED').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Suche nach Firma oder E-Mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
              />
            </div>
          </div>
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
          >
            <option value="ALL">Alle Status</option>
            <option value="PENDING">Ausstehend</option>
            <option value="VERIFIED">Verifiziert</option>
            <option value="REJECTED">Abgelehnt</option>
          </select>
        </div>
      </div>

      {/* Partners Table */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eventhour-yellow"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Firma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Erlebnisse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auszahlungen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registriert
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {partners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {partner.companyName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {partner.user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(partner.verificationStatus, partner.isActive)}`}>
                        {getStatusIcon(partner.verificationStatus, partner.isActive)}
                        {partner.isActive ? partner.verificationStatus : 'INACTIVE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {partner._count.experiences}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {partner._count.payouts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(partner.createdAt).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPartner(partner)
                          setShowDetailModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Seite {page} von {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedPartner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Partner Details</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Firma</h3>
                <p className="text-lg">{selectedPartner.companyName}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Kontakt</h3>
                <p>{selectedPartner.user.email}</p>
                {selectedPartner.user.name && <p>{selectedPartner.user.name}</p>}
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
                <div className="space-y-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPartner.verificationStatus, selectedPartner.isActive)}`}>
                    {getStatusIcon(selectedPartner.verificationStatus, selectedPartner.isActive)}
                    {selectedPartner.verificationStatus}
                  </span>
                  <div>
                    <span className="text-sm text-gray-600">Aktiv: </span>
                    <span className="text-sm font-medium">{selectedPartner.isActive ? 'Ja' : 'Nein'}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Erlebnisse ({selectedPartner.experiences.length})</h3>
                {selectedPartner.experiences.length > 0 ? (
                  <ul className="space-y-1">
                    {selectedPartner.experiences.map((exp) => (
                      <li key={exp.id} className="text-sm">
                        • {exp.title} {exp.isActive ? '(Aktiv)' : '(Inaktiv)'}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">Keine Erlebnisse</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Aktionen</h3>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    {selectedPartner.verificationStatus !== 'VERIFIED' && (
                      <Button
                        onClick={() => handleUpdateStatus(selectedPartner.id, 'VERIFIED')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Verifizieren
                      </Button>
                    )}
                    {selectedPartner.verificationStatus !== 'REJECTED' && (
                      <Button
                        onClick={() => handleUpdateStatus(selectedPartner.id, 'REJECTED')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Ablehnen
                      </Button>
                    )}
                    {selectedPartner.verificationStatus !== 'PENDING' && (
                      <Button
                        onClick={() => handleUpdateStatus(selectedPartner.id, 'PENDING')}
                        variant="secondary"
                      >
                        Auf Prüfung setzen
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {selectedPartner.isActive ? (
                      <Button
                        onClick={() => handleUpdateStatus(selectedPartner.id, undefined, false)}
                        className="bg-gray-600 hover:bg-gray-700"
                      >
                        Deaktivieren
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleUpdateStatus(selectedPartner.id, undefined, true)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Aktivieren
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDetailModal(false)
                  setSelectedPartner(null)
                }}
                className="w-full"
              >
                Schließen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}