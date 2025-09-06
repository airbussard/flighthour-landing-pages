'use client'

import { useState, useEffect } from 'react'
import { Search, Edit, Trash2, Shield, User, Building2, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@eventhour/ui'

interface User {
  id: string
  email: string
  name: string | null
  role: 'ADMIN' | 'PARTNER' | 'CUSTOMER'
  createdAt: string
  customerProfile?: any
  partner?: any
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [page, search, roleFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      })
      
      if (search) params.append('search', search)
      if (roleFilter !== 'ALL') params.append('role', roleFilter)

      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()

      if (data.success) {
        setUsers(data.data)
        setTotalPages(data.pagination.totalPages)
      } else {
        setError(data.error || 'Fehler beim Laden der Benutzer')
      }
    } catch (err) {
      setError('Fehler beim Laden der Benutzer')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await response.json()

      if (data.success) {
        fetchUsers()
        setShowEditModal(false)
        setSelectedUser(null)
      } else {
        alert(data.error || 'Fehler beim Aktualisieren')
      }
    } catch (err) {
      alert('Fehler beim Aktualisieren')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        fetchUsers()
        setShowDeleteModal(false)
        setSelectedUser(null)
      } else {
        alert(data.error || 'Fehler beim Löschen')
      }
    } catch (err) {
      alert('Fehler beim Löschen')
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-4 w-4" />
      case 'PARTNER':
        return <Building2 className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-700'
      case 'PARTNER':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-blue-100 text-blue-700'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Benutzerverwaltung</h1>
        <p className="text-gray-600">Verwalten Sie alle Benutzer der Plattform</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Suche nach Name oder E-Mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
              />
            </div>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-eventhour-yellow"
          >
            <option value="ALL">Alle Rollen</option>
            <option value="ADMIN">Admin</option>
            <option value="PARTNER">Partner</option>
            <option value="CUSTOMER">Kunde</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
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
                    Benutzer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rolle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registriert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name || 'Kein Name'}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                        Aktiv
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowEditModal(true)
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user)
                          setShowDeleteModal(true)
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
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

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Rolle ändern</h2>
            <p className="text-gray-600 mb-4">
              Ändern Sie die Rolle für {selectedUser.name || selectedUser.email}
            </p>
            <select
              value={selectedUser.role}
              onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value as any })}
              className="w-full px-4 py-2 border rounded-lg mb-4"
            >
              <option value="CUSTOMER">Kunde</option>
              <option value="PARTNER">Partner</option>
              <option value="ADMIN">Admin</option>
            </select>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                onClick={() => handleUpdateRole(selectedUser.id, selectedUser.role)}
                className="flex-1"
              >
                Speichern
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Benutzer löschen</h2>
            <p className="text-gray-600 mb-4">
              Möchten Sie {selectedUser.name || selectedUser.email} wirklich löschen? 
              Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1"
              >
                Abbrechen
              </Button>
              <Button
                onClick={() => handleDeleteUser(selectedUser.id)}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Löschen
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}