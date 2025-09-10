'use client'

import { useEffect, useState } from 'react'
import { Card, Button } from '@eventhour/ui'
import { 
  Package, 
  Calendar,
  Euro,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: string
  paymentStatus: string
  subtotal: number
  taxAmount: number
  totalAmount: number
  customerEmail: string
  items: OrderItem[]
}

interface OrderItem {
  id: string
  itemType: string
  experienceTitle?: string
  voucherValue?: number
  quantity: number
  unitPrice: number
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/customers/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const toggleOrderExpanded = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      'PENDING': { label: 'In Bearbeitung', className: 'bg-yellow-100 text-yellow-800' },
      'CONFIRMED': { label: 'Bestätigt', className: 'bg-blue-100 text-blue-800' },
      'PROCESSING': { label: 'Wird bearbeitet', className: 'bg-indigo-100 text-indigo-800' },
      'COMPLETED': { label: 'Abgeschlossen', className: 'bg-green-100 text-green-800' },
      'CANCELLED': { label: 'Storniert', className: 'bg-red-100 text-red-800' }
    }

    const { label, className } = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    )
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      'PENDING': { label: 'Ausstehend', className: 'bg-yellow-100 text-yellow-800' },
      'COMPLETED': { label: 'Bezahlt', className: 'bg-green-100 text-green-800' },
      'FAILED': { label: 'Fehlgeschlagen', className: 'bg-red-100 text-red-800' },
      'REFUNDED': { label: 'Erstattet', className: 'bg-gray-100 text-gray-800' }
    }

    const { label, className } = statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' }
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
        {label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <Card className="p-12 text-center">
        <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Keine Bestellungen vorhanden</h2>
        <p className="text-gray-600 mb-6">
          Sie haben noch keine Bestellungen aufgegeben.
        </p>
        <Button variant="primary" onClick={() => window.location.href = '/suche'}>
          Jetzt Erlebnisse entdecken
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Meine Bestellungen</h2>
        <p className="text-sm text-gray-600">{orders.length} Bestellung(en)</p>
      </div>

      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden">
          <div className="p-6">
            {/* Order Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">
                  Bestellung #{order.orderNumber || order.id.slice(-8).toUpperCase()}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatDate(order.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Euro className="h-4 w-4" />
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                {getStatusBadge(order.status)}
                {getPaymentStatusBadge(order.paymentStatus)}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t pt-4">
              <button
                onClick={() => toggleOrderExpanded(order.id)}
                className="flex items-center justify-between w-full text-left"
              >
                <span className="text-sm font-medium">
                  {order.items.length} Artikel
                </span>
                {expandedOrders.has(order.id) ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {/* Expanded Order Details */}
              {expandedOrders.has(order.id) && (
                <div className="mt-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-start justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">
                          {item.itemType === 'EXPERIENCE' 
                            ? item.experienceTitle 
                            : `Wertgutschein ${formatPrice(item.voucherValue || 0)}`
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          Menge: {item.quantity} × {formatPrice(item.unitPrice)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatPrice(item.quantity * item.unitPrice)}
                      </p>
                    </div>
                  ))}

                  {/* Price Breakdown */}
                  <div className="border-t pt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Zwischensumme:</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>MwSt. (19%):</span>
                      <span>{formatPrice(order.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Gesamt:</span>
                      <span>{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Actions */}
            {order.status === 'COMPLETED' && (
              <div className="border-t mt-4 pt-4 flex gap-2">
                <Button variant="outline" size="sm" leftIcon={Eye}>
                  Details anzeigen
                </Button>
                <Button variant="outline" size="sm" leftIcon={Download}>
                  Rechnung herunterladen
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}