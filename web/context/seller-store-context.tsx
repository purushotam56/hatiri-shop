'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Store {
  id: number | string
  name: string
  code: string
  currency?: string
  dateFormat?: string
}

export interface SellerStoreContextType {
  selectedStore: Store | null
  setSelectedStore: (store: Store) => void
  stores: Store[]
  setStores: (stores: Store[]) => void
  clearStore: () => void
}

const SellerStoreContext = createContext<SellerStoreContextType | undefined>(undefined)

export function SellerStoreProvider({ children }: { children: React.ReactNode }) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [stores, setStores] = useState<Store[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const storedStore = localStorage.getItem('selectedSellerStore')
    const storedStores = localStorage.getItem('sellerStores')

    if (storedStore) {
      try {
        setSelectedStore(JSON.parse(storedStore))
      } catch (err) {
        console.error('Failed to parse stored store:', err)
      }
    }

    if (storedStores) {
      try {
        setStores(JSON.parse(storedStores))
      } catch (err) {
        console.error('Failed to parse stored stores:', err)
      }
    }
  }, [])

  const handleSetSelectedStore = (store: Store) => {
    setSelectedStore(store)
    localStorage.setItem('selectedSellerStore', JSON.stringify(store))
  }

  const handleSetStores = (stores: Store[]) => {
    setStores(stores)
    localStorage.setItem('sellerStores', JSON.stringify(stores))
  }

  const handleClearStore = () => {
    setSelectedStore(null)
    setStores([])
    localStorage.removeItem('selectedSellerStore')
    localStorage.removeItem('sellerStores')
  }

  return (
    <SellerStoreContext.Provider
      value={{
        selectedStore,
        setSelectedStore: handleSetSelectedStore,
        stores,
        setStores: handleSetStores,
        clearStore: handleClearStore,
      }}
    >
      {children}
    </SellerStoreContext.Provider>
  )
}

export function useSellerStore() {
  const context = useContext(SellerStoreContext)
  if (context === undefined) {
    throw new Error('useSellerStore must be used within a SellerStoreProvider')
  }
  return context
}
