'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, MapPin, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

export interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
  suggestions?: string[]
  recentSearches?: string[]
  placeholder?: string
  showLocation?: boolean
  className?: string
  autoFocus?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSubmit,
  suggestions = [],
  recentSearches = [],
  placeholder = 'Suche nach Erlebnissen...',
  showLocation = false,
  className,
  autoFocus = false,
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const [location, setLocation] = useState<string>('')

  useEffect(() => {
    setInputValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange?.(newValue)
    setSelectedIndex(-1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(inputValue)
    setIsFocused(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    onChange?.(suggestion)
    onSubmit?.(suggestion)
    setIsFocused(false)
  }

  const handleClear = () => {
    setInputValue('')
    onChange?.('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = [...suggestions, ...recentSearches]

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSuggestionClick(items[selectedIndex])
    } else if (e.key === 'Escape') {
      setIsFocused(false)
      inputRef.current?.blur()
    }
  }

  const showDropdown = isFocused && (suggestions.length > 0 || recentSearches.length > 0)

  return (
    <div className={clsx('relative', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              autoFocus={autoFocus}
              className={clsx(
                'w-full pl-12 pr-12 py-4 text-lg',
                'border border-gray-300 rounded-xl',
                'focus:outline-none focus:ring-2 focus:ring-eventhour-yellow focus:border-transparent',
                'transition-all duration-200'
              )}
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          {showLocation && (
            <div className="flex items-center gap-2 px-4 py-4 border border-gray-300 rounded-xl">
              <MapPin className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ort oder PLZ"
                className="w-32 focus:outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            className={clsx(
              'px-6 py-4 rounded-xl',
              'bg-eventhour-yellow text-eventhour-black',
              'font-semibold',
              'hover:bg-yellow-500 transition-colors'
            )}
          >
            Suchen
          </button>
        </div>
      </form>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50"
          >
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Vorschläge
                </p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={clsx(
                      'w-full text-left px-3 py-2 rounded-lg transition-colors',
                      selectedIndex === index
                        ? 'bg-eventhour-yellow/10 text-eventhour-black'
                        : 'hover:bg-gray-100'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-2 border-t border-gray-100">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                  Zuletzt gesucht
                </p>
                {recentSearches.map((search, index) => {
                  const adjustedIndex = suggestions.length + index
                  return (
                    <button
                      key={search}
                      onClick={() => handleSuggestionClick(search)}
                      className={clsx(
                        'w-full text-left px-3 py-2 rounded-lg transition-colors',
                        selectedIndex === adjustedIndex
                          ? 'bg-eventhour-yellow/10 text-eventhour-black'
                          : 'hover:bg-gray-100'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{search}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
