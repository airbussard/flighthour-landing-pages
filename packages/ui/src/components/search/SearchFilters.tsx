'use client'

import React, { useState } from 'react'
import { ChevronDown, X, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { Button } from '../Button'

export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  type: 'checkbox' | 'radio' | 'range'
  options?: FilterOption[]
  min?: number
  max?: number
  step?: number
}

export interface SearchFiltersProps {
  filters: FilterGroup[]
  selectedFilters: Record<string, any>
  onChange: (filterId: string, value: any) => void
  onClear?: () => void
  className?: string
  mobile?: boolean
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  selectedFilters,
  onChange,
  onClear,
  className,
  mobile = false,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(
    filters.map((f) => f.id)
  )
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  const handleFilterChange = (filterId: string, value: any) => {
    onChange(filterId, value)
  }

  const hasActiveFilters = Object.keys(selectedFilters).some(
    (key) => selectedFilters[key] && 
    (Array.isArray(selectedFilters[key]) ? selectedFilters[key].length > 0 : true)
  )

  const renderFilterGroup = (group: FilterGroup) => {
    const isExpanded = expandedGroups.includes(group.id)
    const selectedValues = selectedFilters[group.id] || []

    return (
      <div key={group.id} className="border-b border-gray-200 pb-4">
        <button
          onClick={() => toggleGroup(group.id)}
          className="w-full flex items-center justify-between py-2 text-left"
        >
          <span className="font-medium text-gray-900">{group.label}</span>
          <ChevronDown
            className={clsx(
              'h-4 w-4 text-gray-400 transition-transform',
              isExpanded && 'rotate-180'
            )}
          />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-2 space-y-2">
                {group.type === 'checkbox' && group.options && (
                  <>
                    {group.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                      >
                        <input
                          type="checkbox"
                          checked={selectedValues.includes(option.value)}
                          onChange={(e) => {
                            const newValues = e.target.checked
                              ? [...selectedValues, option.value]
                              : selectedValues.filter((v: string) => v !== option.value)
                            handleFilterChange(group.id, newValues)
                          }}
                          className="w-4 h-4 text-eventhour-yellow focus:ring-eventhour-yellow border-gray-300 rounded"
                        />
                        <span className="flex-1 text-sm text-gray-700">
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className="text-xs text-gray-500">
                            ({option.count})
                          </span>
                        )}
                      </label>
                    ))}
                  </>
                )}

                {group.type === 'radio' && group.options && (
                  <>
                    {group.options.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                      >
                        <input
                          type="radio"
                          name={group.id}
                          checked={selectedFilters[group.id] === option.value}
                          onChange={() => handleFilterChange(group.id, option.value)}
                          className="w-4 h-4 text-eventhour-yellow focus:ring-eventhour-yellow border-gray-300"
                        />
                        <span className="flex-1 text-sm text-gray-700">
                          {option.label}
                        </span>
                        {option.count !== undefined && (
                          <span className="text-xs text-gray-500">
                            ({option.count})
                          </span>
                        )}
                      </label>
                    ))}
                  </>
                )}

                {group.type === 'range' && (
                  <div className="px-2 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">
                        {group.min}€
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {selectedFilters[group.id] || group.max}€
                      </span>
                      <span className="text-sm text-gray-600">
                        {group.max}€
                      </span>
                    </div>
                    <input
                      type="range"
                      min={group.min}
                      max={group.max}
                      step={group.step || 1}
                      value={selectedFilters[group.id] || group.max}
                      onChange={(e) => handleFilterChange(group.id, Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-eventhour-yellow"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  const filterContent = (
    <div className="space-y-4">
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <span className="text-sm font-medium text-gray-700">
            Filter aktiv
          </span>
          <button
            onClick={onClear}
            className="text-sm text-eventhour-yellow hover:text-yellow-600 flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Zurücksetzen
          </button>
        </div>
      )}

      {filters.map(renderFilterGroup)}
    </div>
  )

  if (mobile) {
    return (
      <>
        <Button
          onClick={() => setShowMobileFilters(true)}
          leftIcon={Filter}
          variant="outline"
          className="lg:hidden"
        >
          Filter
        </Button>

        <AnimatePresence>
          {showMobileFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setShowMobileFilters(false)}
              />

              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'tween' }}
                className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden overflow-y-auto"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Filter</h2>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {filterContent}

                  <div className="mt-6 flex gap-2">
                    <Button
                      onClick={() => setShowMobileFilters(false)}
                      variant="primary"
                      fullWidth
                    >
                      Anwenden
                    </Button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    )
  }

  return (
    <div className={clsx('bg-white rounded-xl p-6', className)}>
      <h3 className="text-lg font-semibold mb-4">Filter</h3>
      {filterContent}
    </div>
  )
}