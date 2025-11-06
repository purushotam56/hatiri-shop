'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@heroui/button'
import { Spinner } from '@heroui/spinner'
import { apiEndpoints } from '@/lib/api-client'
import { useSellerStore, type Store } from '@/context/seller-store-context'

export default function SelectStorePage() {
  const router = useRouter()
  const { stores, setSelectedStore } = useSellerStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedStoreId, setSelectedStoreId] = useState<number | string | null>(null)

  useEffect(() => {
    // If no stores, redirect to login
    if (stores.length === 0) {
      router.push('/seller')
    }
  }, [stores, router])

  const handleSelectStore = async () => {
    if (!selectedStoreId) {
      setError('Please select a store')
      return
    }

    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('sellerToken')
      if (!token) {
        setError('Authentication failed')
        return
      }

      const data = await apiEndpoints.sellerSelectStore({ storeId: selectedStoreId }, token);

      if (!data.store) {
        setError(data.message || 'Failed to select store')
        return
      }

      // Update with the new token that includes store ID
      localStorage.setItem('sellerToken', data.token)
      setSelectedStore(data.store)
      router.push(`/seller/${selectedStoreId}/dashboard`)
    } catch (err) {
      setError('Connection error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('sellerToken')
    localStorage.removeItem('sellerUser')
    localStorage.removeItem('sellerStores')
    localStorage.removeItem('selectedSellerStore')
    router.push('/seller')
  }

  if (stores.length === 0) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-content1 via-background to-content1 flex items-center justify-center px-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-warning/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-warning/30 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-content2/50 backdrop-blur-xl border border-divider rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-warning via-warning-500 to-warning-600"></div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🏪</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-warning to-warning-600 bg-clip-text text-transparent mb-2">
                Select Your Store
              </h1>
              <p className="text-default-500">Choose which store you'd like to manage</p>
            </div>

            {/* Store Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {stores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStoreId(store.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                    selectedStoreId === store.id
                      ? 'border-warning bg-warning/20 shadow-lg shadow-warning/50'
                      : 'border-default-300 bg-content2 hover:border-default-400'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{store.name}</h3>
                      <p className="text-sm text-default-500">Code: {store.code}</p>
                    </div>
                    {selectedStoreId === store.id && (
                      <div className="text-xl text-warning">✓</div>
                    )}
                  </div>
                  {store.currency && (
                    <div className="text-xs text-default-600 mt-2">
                      Currency: <span className="text-warning font-semibold">{store.currency}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="p-4 bg-danger/20 border border-danger/50 rounded-lg flex gap-3 mb-6">
                <span className="text-xl">⚠️</span>
                <p className="text-sm font-semibold text-danger-200">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleSelectStore}
                disabled={loading || !selectedStoreId}
                color="warning"
                size="lg"
                className="w-full font-bold"
                isLoading={loading}
                spinner={<Spinner size="sm" color="current" />}
              >
                {loading ? 'Loading Dashboard…' : 'Continue to Dashboard'}
              </Button>

              <Button
                onClick={handleLogout}
                disabled={loading}
                variant="bordered"
                size="lg"
                className="w-full font-semibold"
              >
                Logout
              </Button>
            </div>

            <p className="text-center text-default-500 text-xs mt-4">
              You have access to {stores.length} store{stores.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
