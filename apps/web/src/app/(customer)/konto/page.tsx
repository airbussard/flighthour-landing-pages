'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, Button } from '@eventhour/ui'
import { 
  Package, 
  Gift, 
  User, 
  ArrowRight,
  Calendar,
  Euro,
  Clock
} from 'lucide-react'

interface DashboardData {
  recentOrders: any[]
  activeVouchers: any[]
  stats: {
    totalOrders: number
    totalSpent: number
    activeVouchers: number
  }
}

export default function AccountDashboard() {
  const [data, setData] = useState<DashboardData>({
    recentOrders: [],
    activeVouchers: [],
    stats: {
      totalOrders: 0,
      totalSpent: 0,
      activeVouchers: 0
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/customers/dashboard')
      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
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
      year: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { label: string; className: string } } = {
      'PENDING': { label: 'In Bearbeitung', className: 'bg-yellow-100 text-yellow-800' },
      'CONFIRMED': { label: 'Bestätigt', className: 'bg-blue-100 text-blue-800' },
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

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bestellungen</p>
              <p className="text-2xl font-bold">{data.stats.totalOrders}</p>
            </div>
            <Package className="h-8 w-8 text-eventhour-yellow" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ausgegeben</p>
              <p className="text-2xl font-bold">{formatPrice(data.stats.totalSpent)}</p>
            </div>
            <Euro className="h-8 w-8 text-eventhour-yellow" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktive Gutscheine</p>
              <p className="text-2xl font-bold">{data.stats.activeVouchers}</p>
            </div>
            <Gift className="h-8 w-8 text-eventhour-yellow" />
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Letzte Bestellungen</h2>
          <Link href="/konto/bestellungen">
            <Button variant="outline" size="sm" rightIcon={ArrowRight}>
              Alle anzeigen
            </Button>
          </Link>
        </div>

        {data.recentOrders.length > 0 ? (
          <div className="space-y-4">
            {data.recentOrders.map((order) => (
              <div key={order.id} className="border-b last:border-0 pb-4 last:pb-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Bestellung #{order.id.slice(-8).toUpperCase()}</p>
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
                  {getStatusBadge(order.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            Sie haben noch keine Bestellungen aufgegeben.
          </p>
        )}
      </Card>

      {/* Active Vouchers */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Aktive Gutscheine</h2>
          <Link href="/konto/gutscheine">
            <Button variant="outline" size="sm" rightIcon={ArrowRight}>
              Alle anzeigen
            </Button>
          </Link>
        </div>

        {data.activeVouchers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.activeVouchers.map((voucher) => (
              <div key={voucher.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">
                      {voucher.voucherType === 'VALUE' 
                        ? `Wertgutschein ${formatPrice(voucher.voucherValue)}`
                        : voucher.experienceTitle
                      }
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Code: {voucher.voucherCode}
                    </p>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Gültig bis {formatDate(voucher.expiresAt)}
                    </p>
                  </div>
                  <Gift className="h-5 w-5 text-eventhour-yellow" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8">
            Sie haben keine aktiven Gutscheine.
          </p>
        )}
      </Card>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Schnellzugriff</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/konto/profil">
            <Button variant="outline" className="w-full" leftIcon={User}>
              Profil bearbeiten
            </Button>
          </Link>
          <Link href="/suche">
            <Button variant="outline" className="w-full" leftIcon={Gift}>
              Neue Erlebnisse
            </Button>
          </Link>
          <Link href="/konto/bestellungen">
            <Button variant="outline" className="w-full" leftIcon={Package}>
              Bestellhistorie
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}