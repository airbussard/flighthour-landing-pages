'use client'

import { useEffect, useState } from 'react'
import { Card, Button } from '@eventhour/ui'
import { 
  Gift, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Euro,
  Copy
} from 'lucide-react'

interface Voucher {
  id: string
  voucherCode: string
  voucherType: 'EXPERIENCE' | 'VALUE'
  experienceId?: string
  experienceTitle?: string
  voucherValue?: number
  remainingValue?: number
  issuedAt: string
  expiresAt: string
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED' | 'CANCELLED'
  redeemedAt?: string
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'used' | 'expired'>('all')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    fetchVouchers()
  }, [])

  const fetchVouchers = async () => {
    try {
      const response = await fetch('/api/customers/vouchers')
      if (response.ok) {
        const data = await response.json()
        setVouchers(data.vouchers || [])
      }
    } catch (error) {
      console.error('Failed to fetch vouchers:', error)
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

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'REDEEMED':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'EXPIRED':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'CANCELLED':
        return <XCircle className="h-5 w-5 text-gray-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'ACTIVE': 'Aktiv',
      'REDEEMED': 'Eingelöst',
      'EXPIRED': 'Abgelaufen',
      'CANCELLED': 'Storniert'
    }
    return labels[status] || status
  }

  const filteredVouchers = vouchers.filter(voucher => {
    if (filter === 'all') return true
    if (filter === 'active') return voucher.status === 'ACTIVE'
    if (filter === 'used') return voucher.status === 'REDEEMED'
    if (filter === 'expired') return voucher.status === 'EXPIRED'
    return true
  })

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

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { value: 'all', label: 'Alle' },
          { value: 'active', label: 'Aktiv' },
          { value: 'used', label: 'Eingelöst' },
          { value: 'expired', label: 'Abgelaufen' }
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              filter === tab.value
                ? 'text-eventhour-yellow border-eventhour-yellow'
                : 'text-gray-600 border-transparent hover:text-gray-900'
            }`}
          >
            {tab.label}
            <span className="ml-2 text-sm">
              ({vouchers.filter(v => {
                if (tab.value === 'all') return true
                if (tab.value === 'active') return v.status === 'ACTIVE'
                if (tab.value === 'used') return v.status === 'REDEEMED'
                if (tab.value === 'expired') return v.status === 'EXPIRED'
                return false
              }).length})
            </span>
          </button>
        ))}
      </div>

      {filteredVouchers.length === 0 ? (
        <Card className="p-12 text-center">
          <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {filter === 'all' 
              ? 'Keine Gutscheine vorhanden'
              : `Keine ${filter === 'active' ? 'aktiven' : filter === 'used' ? 'eingelösten' : 'abgelaufenen'} Gutscheine`
            }
          </h2>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Sie haben noch keine Gutscheine erworben.'
              : 'In dieser Kategorie befinden sich keine Gutscheine.'
            }
          </p>
          {filter === 'all' && (
            <Button variant="primary" onClick={() => window.location.href = '/suche'}>
              Erlebnisse entdecken
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredVouchers.map((voucher) => (
            <Card key={voucher.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Gift className="h-8 w-8 text-eventhour-yellow flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-lg">
                      {voucher.voucherType === 'VALUE' 
                        ? `Wertgutschein`
                        : voucher.experienceTitle || 'Erlebnisgutschein'
                      }
                    </h3>
                    {voucher.voucherType === 'VALUE' && (
                      <p className="text-2xl font-bold text-eventhour-yellow mt-1">
                        {formatPrice(voucher.voucherValue || 0)}
                      </p>
                    )}
                    {voucher.remainingValue && voucher.remainingValue < (voucher.voucherValue || 0) && (
                      <p className="text-sm text-gray-600">
                        Restwert: {formatPrice(voucher.remainingValue)}
                      </p>
                    )}
                  </div>
                </div>
                {getStatusIcon(voucher.status)}
              </div>

              <div className="space-y-3">
                {/* Voucher Code */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-600 mb-1">Gutschein-Code</p>
                  <div className="flex items-center justify-between">
                    <code className="font-mono font-bold text-lg">{voucher.voucherCode}</code>
                    <button
                      onClick={() => copyCode(voucher.voucherCode)}
                      className="p-2 hover:bg-gray-200 rounded transition-colors"
                    >
                      {copiedCode === voucher.voucherCode ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Dates */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Ausgestellt: {formatDate(voucher.issuedAt)}
                  </span>
                  <span className={`font-medium flex items-center gap-1 ${
                    voucher.status === 'EXPIRED' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <Clock className="h-4 w-4" />
                    {voucher.status === 'EXPIRED' ? 'Abgelaufen' : 'Gültig bis'}: {formatDate(voucher.expiresAt)}
                  </span>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-3 border-t">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    voucher.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    voucher.status === 'REDEEMED' ? 'bg-blue-100 text-blue-800' :
                    voucher.status === 'EXPIRED' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {getStatusLabel(voucher.status)}
                  </span>
                  
                  {voucher.status === 'ACTIVE' && (
                    <Button variant="outline" size="sm" leftIcon={Download}>
                      PDF herunterladen
                    </Button>
                  )}
                  
                  {voucher.status === 'REDEEMED' && voucher.redeemedAt && (
                    <span className="text-xs text-gray-500">
                      Eingelöst am {formatDate(voucher.redeemedAt)}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}