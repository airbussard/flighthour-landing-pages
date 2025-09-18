'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, MapPin, Clock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'

export interface SearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string, location?: string, radius?: number) => void
  onLocationChange?: (location: string) => void
  onRadiusChange?: (radius: number) => void
  suggestions?: string[]
  recentSearches?: string[]
  placeholder?: string
  showLocation?: boolean
  locationValue?: string
  radiusValue?: number
  className?: string
  autoFocus?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onChange,
  onSubmit,
  onLocationChange,
  onRadiusChange,
  suggestions = [],
  recentSearches = [],
  placeholder = 'Suche nach Erlebnissen...',
  showLocation = false,
  locationValue = '',
  radiusValue = 50,
  className,
  autoFocus = false,
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const [location, setLocation] = useState<string>(locationValue)
  const [radius, setRadius] = useState<number>(radiusValue)

  useEffect(() => {
    setLocation(locationValue)
  }, [locationValue])

  useEffect(() => {
    setRadius(radiusValue)
  }, [radiusValue])

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
    onSubmit?.(inputValue, location, radius)
    setIsFocused(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
    onChange?.(suggestion)
    onSubmit?.(suggestion, location, radius)
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
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search Input */}
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
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Location Input */}
              <div className="flex items-center gap-2 px-4 py-4 border border-gray-300 rounded-xl bg-white hover:border-gray-400 transition-colors">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => {
                    setLocation(e.target.value)
                    onLocationChange?.(e.target.value)
                  }}
                  placeholder="Ort oder PLZ"
                  className="w-full sm:w-32 focus:outline-none bg-transparent"
                />
              </div>

              {/* Radius Select */}
              <select
                value={radius}
                onChange={(e) => {
                  const newRadius = Number(e.target.value)
                  setRadius(newRadius)
                  onRadiusChange?.(newRadius)
                }}
                className="px-4 py-4 border border-gray-300 rounded-xl bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-eventhour-yellow transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '3rem'
                }}
              >
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
                <option value="0">Deutschlandweit</option>
              </select>
            </div>
          )}

          {/* Search Button */}
          <button
            type="submit"
            className={clsx(
              'px-8 py-4 rounded-xl',
              'bg-eventhour-yellow text-eventhour-black',
              'font-semibold text-lg',
              'hover:bg-yellow-500 active:bg-yellow-600',
              'transition-colors duration-200',
              'shadow-sm hover:shadow-md',
              'whitespace-nowrap',
              'w-full sm:w-auto'
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
