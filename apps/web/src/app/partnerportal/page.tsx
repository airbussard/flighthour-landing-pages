'use client'

import { useEffect, useState } from 'react'
import { Card, Spinner } from '@eventhour/ui'
import { 
  TrendingUp, 
  Package, 
  Ticket, 
  DollarSign,
  Calendar,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface Statistics {
  totalRevenue: number
  pendingPayout: number
  totalRedemptions: number
  activeExperiences: number
  thisMonthRevenue: number
  thisMonthRedemptions: number
}

interface RecentRedemption {
  id: string
  voucherCode: string
  experienceTitle: string
  amount: number
  redeemedAt: string
}

export default function PartnerDashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Statistics | null>(null)
  const [recentRedemptions, setRecentRedemptions] = useState<RecentRedemption[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch statistics
      const statsResponse = await fetch('/api/partner/statistics')
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Fetch recent redemptions
      const redemptionsResponse = await fetch('/api/partner/vouchers/recent')
      const redemptionsData = await redemptionsResponse.json()
      setRecentRedemptions(redemptionsData.vouchers || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100)
  }

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold">Willkommen im Partner Portal</h1>
        <p className="text-gray-600 mt-2">
          Hier ist Ihre Übersicht für {new Date().toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Gesamtumsatz</p>
              <p className="text-2xl font-bold mt-2">
                {stats ? formatCurrency(stats.totalRevenue) : '0€'}
              </p>
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-green-500">+12% vs. Vormonat</span>
              </div>
            </div>
            <div className="p-3 bg-eventhour-yellow/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-eventhour-yellow" />
            </div>
          </div>
        </Card>

        {/* Pending Payout */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Offene Auszahlung</p>
              <p className="text-2xl font-bold mt-2">
                {stats ? formatCurrency(stats.pendingPayout) : '0€'}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Nächste Auszahlung: 01.{((new Date().getMonth() + 2) % 12 || 12).toString().padStart(2, '0')}.
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        {/* Total Redemptions */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Einlösungen gesamt</p>
              <p className="text-2xl font-bold mt-2">
                {stats?.totalRedemptions || 0}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {stats?.thisMonthRedemptions || 0} diesen Monat
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Ticket className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        {/* Active Experiences */}
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600">Aktive Erlebnisse</p>
              <p className="text-2xl font-bold mt-2">
                {stats?.activeExperiences || 0}
              </p>
              <button className="text-sm text-eventhour-yellow hover:underline mt-2">
                Alle anzeigen →
              </button>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Umsatzentwicklung</h2>
            <select className="text-sm border rounded px-2 py-1">
              <option>Letzte 7 Tage</option>
              <option>Letzte 30 Tage</option>
              <option>Letzte 3 Monate</option>
            </select>
          </div>
          
          {/* Placeholder Chart */}
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chart wird geladen...</p>
            </div>
          </div>
        </Card>

        {/* Recent Redemptions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Letzte Einlösungen</h2>
            <button className="text-sm text-eventhour-yellow hover:underline">
              Alle anzeigen
            </button>
          </div>
          
          <div className="space-y-3">
            {recentRedemptions.length > 0 ? (
              recentRedemptions.slice(0, 5).map((redemption) => (
                <div key={redemption.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium text-sm">{redemption.experienceTitle}</p>
                    <p className="text-xs text-gray-500">
                      Code: {redemption.voucherCode} • {new Date(redemption.redeemedAt).toLocaleDateString('de-DE')}
                    </p>
                  </div>
                  <p className="font-semibold text-eventhour-yellow">
                    {formatCurrency(redemption.amount)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">
                Noch keine Einlösungen vorhanden
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Schnellaktionen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Ticket className="h-5 w-5 text-eventhour-yellow" />
              <span className="font-medium">Gutschein einlösen</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-400" />
          </button>
          
          <button className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-eventhour-yellow" />
              <span className="font-medium">Neues Erlebnis</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-400" />
          </button>
          
          <button className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-eventhour-yellow" />
              <span className="font-medium">Auszahlung anfordern</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </Card>
    </div>
  )
}