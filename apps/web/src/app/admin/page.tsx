'use client'

import { useState, useEffect } from 'react'
import { 
  Users, 
  Building2, 
  ShoppingCart, 
  TrendingUp,
  Package,
  Ticket,
  ArrowUp,
  ArrowDown,
  Euro
} from 'lucide-react'

interface DashboardStats {
  users: {
    total: number
    newThisMonth: number
  }
  partners: {
    total: number
    active: number
  }
  orders: {
    total: number
    thisMonth: number
  }
  revenue: {
    total: number
    thisMonth: number
    lastMonth: number
    monthlyGrowth: number
  }
  experiences: {
    total: number
    active: number
  }
  vouchers: {
    total: number
    active: number
    redeemedThisMonth: number
  }
}

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'blue',
  prefix = '',
  suffix = ''
}: {
  title: string
  value: number | string
  change?: number
  icon: any
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red'
  prefix?: string
  suffix?: string
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-eventhour-yellow',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${colorClasses[color].replace('bg-', 'text-')}`} />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-600 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold">
        {prefix}{typeof value === 'number' ? value.toLocaleString('de-DE') : value}{suffix}
      </p>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()

      if (data.success) {
        setStats(data.data)
      } else {
        setError(data.error || 'Fehler beim Laden der Statistiken')
      }
    } catch (err) {
      setError('Fehler beim Laden der Statistiken')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-eventhour-yellow"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Willkommen im Admin-Bereich von Eventhour</p>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Gesamtumsatz"
          value={stats.revenue.total}
          change={stats.revenue.monthlyGrowth}
          icon={Euro}
          color="green"
          suffix="€"
        />
        <StatCard
          title="Benutzer"
          value={stats.users.total}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Aktive Partner"
          value={stats.partners.active}
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Bestellungen"
          value={stats.orders.total}
          icon={ShoppingCart}
          color="yellow"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Umsatz-Übersicht</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Diesen Monat</span>
              <span className="text-xl font-bold text-green-600">
                {stats.revenue.thisMonth.toLocaleString('de-DE')}€
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Letzten Monat</span>
              <span className="text-lg font-semibold">
                {stats.revenue.lastMonth.toLocaleString('de-DE')}€
              </span>
            </div>
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Wachstum</span>
                <span className={`flex items-center gap-1 font-semibold ${
                  stats.revenue.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.revenue.monthlyGrowth >= 0 ? (
                    <ArrowUp className="h-4 w-4" />
                  ) : (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  {Math.abs(stats.revenue.monthlyGrowth).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Aktivität</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Neue Nutzer (Monat)</span>
              <span className="text-xl font-bold text-blue-600">
                {stats.users.newThisMonth}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Bestellungen (Monat)</span>
              <span className="text-xl font-bold text-yellow-600">
                {stats.orders.thisMonth}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Eingelöste Gutscheine</span>
              <span className="text-xl font-bold text-purple-600">
                {stats.vouchers.redeemedThisMonth}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-8 w-8 text-blue-500" />
            <span className="text-sm text-gray-500">Erlebnisse</span>
          </div>
          <p className="text-3xl font-bold mb-2">{stats.experiences.total}</p>
          <p className="text-sm text-gray-600">
            {stats.experiences.active} aktiv
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <Ticket className="h-8 w-8 text-purple-500" />
            <span className="text-sm text-gray-500">Gutscheine</span>
          </div>
          <p className="text-3xl font-bold mb-2">{stats.vouchers.total}</p>
          <p className="text-sm text-gray-600">
            {stats.vouchers.active} aktiv
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-green-500" />
            <span className="text-sm text-gray-500">Conversion</span>
          </div>
          <p className="text-3xl font-bold mb-2">
            {stats.orders.total > 0 
              ? ((stats.vouchers.redeemedThisMonth / stats.orders.thisMonth) * 100).toFixed(1)
              : '0'
            }%
          </p>
          <p className="text-sm text-gray-600">
            Einlösequote
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-yellow-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Schnellzugriff</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="/admin/partner"
            className="px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Partner freischalten
          </a>
          <a
            href="/admin/erlebnisse"
            className="px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Erlebnisse moderieren
          </a>
          <a
            href="/admin/bestellungen"
            className="px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Bestellungen prüfen
          </a>
          <a
            href="/admin/einstellungen"
            className="px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Systemeinstellungen
          </a>
        </div>
      </div>
    </div>
  )
}