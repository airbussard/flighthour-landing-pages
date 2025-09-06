'use client'

import React, { useEffect } from 'react'
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { Button } from '../Button'
import { motion, AnimatePresence } from 'framer-motion'

export const CartDrawer: React.FC = () => {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal, getItemCount } = useCart()

  // Hydrate on mount
  useEffect(() => {
    useCart.persist.rehydrate()
  }, [])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6" />
                  <h2 className="text-xl font-bold">
                    Warenkorb ({getItemCount()})
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Dein Warenkorb ist leer</p>
                    <Button
                      onClick={closeCart}
                      variant="secondary"
                      className="mt-4"
                    >
                      Weiter einkaufen
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        {/* Image */}
                        {item.image && (
                          <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{item.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.type === 'value_voucher'
                              ? 'Wertgutschein'
                              : 'Erlebnisgutschein'}
                          </p>
                          <p className="text-lg font-bold text-eventhour-yellow mt-2">
                            {item.price.toFixed(2)}€
                          </p>
                        </div>

                        {/* Controls */}
                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t p-6 space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Gesamt:</span>
                    <span className="font-bold text-eventhour-yellow">
                      {getTotal().toFixed(2)}€
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Button
                      href="/checkout"
                      onClick={closeCart}
                      className="w-full"
                    >
                      Zur Kasse
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={closeCart}
                      className="w-full"
                    >
                      Weiter einkaufen
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}