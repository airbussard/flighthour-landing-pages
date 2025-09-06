'use client'

import { ShoppingCart } from 'lucide-react'

export default function AdminOrdersPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Bestellungsverwaltung</h1>
        <p className="text-gray-600">Übersicht über alle Bestellungen und Transaktionen</p>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-xl shadow-sm p-12">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Bestellungsübersicht
          </h2>
          <p className="text-gray-500">
            Diese Seite wird in Phase 8 vollständig implementiert
          </p>
        </div>
      </div>
    </div>
  )
}