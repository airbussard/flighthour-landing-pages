'use client'

import { Package } from 'lucide-react'

export default function AdminExperiencesPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Erlebnis-Moderation</h1>
        <p className="text-gray-600">Prüfen und verwalten Sie alle Erlebnisse</p>
      </div>

      {/* Placeholder */}
      <div className="bg-white rounded-xl shadow-sm p-12">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Erlebnisverwaltung
          </h2>
          <p className="text-gray-500">
            Diese Seite wird in Phase 8 vollständig implementiert
          </p>
        </div>
      </div>
    </div>
  )
}