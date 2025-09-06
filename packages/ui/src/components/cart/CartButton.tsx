'use client'

import React, { useEffect, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { motion, AnimatePresence } from 'framer-motion'

export const CartButton: React.FC = () => {
  const { openCart, getItemCount } = useCart()
  const [mounted, setMounted] = useState(false)
  const itemCount = getItemCount()

  useEffect(() => {
    setMounted(true)
    useCart.persist.rehydrate()
  }, [])

  if (!mounted) {
    return (
      <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
        <ShoppingBag className="h-6 w-6" />
      </button>
    )
  }

  return (
    <button
      onClick={openCart}
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label="Warenkorb öffnen"
    >
      <ShoppingBag className="h-6 w-6" />
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-1 -right-1 bg-eventhour-yellow text-eventhour-black text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center"
          >
            {itemCount}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}