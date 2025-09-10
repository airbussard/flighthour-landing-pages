'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ShoppingCart, Search, Calendar, Euro, Mail, Tag, Package, CheckCircle, Clock, XCircle } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import debounce from 'lodash/debounce'

interface Order {
  id: string
  orderNumber: string
  customerEmail: string
  customerName: string | null
  subtotal: number
  taxAmount: number
  totalAmount: number
  paymentStatus: string
  paymentMethod: string | null
  status: string
  createdAt: string
  completedAt: string | null
  items?: Array<{
    id: string
    itemType: string
    quantity: number
    unitPrice: number
    taxRate: number
    experience?: {
      title: string
      id: string
    }
  }>
  vouchers?: Array<{
    id: string
    voucherCode: string
    voucherType: string
    voucherValue: number | null
    status: string
    experience?: {
      title: string
    }
  }>
  customer?: {
    user?: {
      name: string | null
      email: string
    }
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
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
        params.append('status', filterStatus)
      }

      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, searchQuery, filterStatus])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Debounced search
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value)
      setCurrentPage(1)
    }, 300),
    []
  )

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
      PENDING: { color: 'yellow', icon: Clock, label: 'Ausstehend' },
      CONFIRMED: { color: 'blue', icon: CheckCircle, label: 'Bestätigt' },
      PROCESSING: { color: 'purple', icon: Package, label: 'In Bearbeitung' },
      COMPLETED: { color: 'green', icon: CheckCircle, label: 'Abgeschlossen' },
      CANCELLED: { color: 'red', icon: XCircle, label: 'Storniert' },
    }

    const config = statusConfig[status] || { color: 'gray', icon: Clock, label: status }
    const Icon = config.icon

    const colorClasses: Record<string, string> = {
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800',
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClasses[config.color]}`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig: Record<string, { color: string; label: string }> = {
      PENDING: { color: 'yellow', label: 'Ausstehend' },
      COMPLETED: { color: 'green', label: 'Bezahlt' },
      FAILED: { color: 'red', label: 'Fehlgeschlagen' },
      REFUNDED: { color: 'purple', label: 'Erstattet' },
    }

    const config = statusConfig[status] || { color: 'gray', label: status }

    const colorClasses: Record<string, string> = {
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800',
      gray: 'bg-gray-100 text-gray-800',
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClasses[config.color]}`}>
        <Euro className="h-3 w-3" />
        {config.label}
      </span>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bestellungsverwaltung</h1>
        <p className="text-gray-600">Übersicht über alle Bestellungen und Transaktionen</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Suche nach Bestellnummer oder E-Mail..."
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
                setFilterStatus('PENDING')
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'PENDING'
                  ? 'bg-eventhour-yellow text-eventhour-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Ausstehend
            </button>
            <button
              onClick={() => {
                setFilterStatus('COMPLETED')
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === 'COMPLETED'
                  ? 'bg-eventhour-yellow text-eventhour-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Abgeschlossen
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-500">Lade Bestellungen...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Keine Bestellungen gefunden</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bestellnummer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Datum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Artikel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Betrag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zahlung
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
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.orderNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {order.customerName || 'Gast'}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="h-3 w-3" />
                            {order.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {order.items?.length || 0} Artikel
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(order.totalAmount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            inkl. {formatPrice(order.taxAmount)} MwSt.
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getPaymentStatusBadge(order.paymentStatus)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="text-eventhour-yellow hover:text-eventhour-black transition-colors"
                        >
                          {expandedOrder === order.id ? 'Weniger' : 'Details'}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Details */}
                    {expandedOrder === order.id && (
                      <tr>
                        <td colSpan={8} className="px-6 py-4 bg-gray-50">
                          <div className="space-y-4">
                            {/* Order Items */}
                            {order.items && order.items.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Bestellte Artikel:</h4>
                                <div className="bg-white rounded-lg p-3 space-y-2">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-900">
                                          {item.experience?.title || `${item.itemType} Gutschein`}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                          x{item.quantity}
                                        </span>
                                      </div>
                                      <span className="text-sm font-medium text-gray-900">
                                        {formatPrice(item.unitPrice * item.quantity)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Vouchers */}
                            {order.vouchers && order.vouchers.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Gutscheine:</h4>
                                <div className="bg-white rounded-lg p-3 space-y-2">
                                  {order.vouchers.map((voucher) => (
                                    <div key={voucher.id} className="flex justify-between items-center">
                                      <div className="flex items-center gap-2">
                                        <Tag className="h-4 w-4 text-gray-400" />
                                        <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                          {voucher.voucherCode}
                                        </code>
                                        <span className="text-sm text-gray-500">
                                          {voucher.experience?.title || 'Wertgutschein'}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {voucher.voucherValue && (
                                          <span className="text-sm font-medium text-gray-900">
                                            {formatPrice(voucher.voucherValue)}
                                          </span>
                                        )}
                                        {getStatusBadge(voucher.status)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Payment Info */}
                            {order.paymentMethod && (
                              <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Zahlungsinformationen:</h4>
                                <div className="bg-white rounded-lg p-3">
                                  <div className="text-sm text-gray-600">
                                    Zahlungsmethode: <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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