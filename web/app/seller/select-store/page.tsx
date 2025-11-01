'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { COMPONENTS } from '@/lib/theme'
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

      const response = await fetch('http://localhost:3333/api/seller/select-store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storeId: selectedStoreId }),
      })

      const data = await response.json()

      if (!response.ok) {
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
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🏪</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
                Select Your Store
              </h1>
              <p className="text-slate-400">Choose which store you'd like to manage</p>
            </div>

            {/* Store Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {stores.map((store) => (
                <div
                  key={store.id}
                  onClick={() => setSelectedStoreId(store.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                    selectedStoreId === store.id
                      ? 'border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/50'
                      : 'border-slate-600 bg-slate-700/30 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-white text-lg">{store.name}</h3>
                      <p className="text-sm text-slate-400">Code: {store.code}</p>
                    </div>
                    {selectedStoreId === store.id && (
                      <div className="text-xl">✓</div>
                    )}
                  </div>
                  {store.currency && (
                    <div className="text-xs text-slate-300 mt-2">
                      Currency: <span className="text-orange-400 font-semibold">{store.currency}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex gap-3 mb-6">
                <span className="text-xl">⚠️</span>
                <p className="text-sm font-semibold text-red-200">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSelectStore}
                disabled={loading || !selectedStoreId}
                className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${COMPONENTS.button.seller}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Loading Dashboard…
                  </span>
                ) : (
                  'Continue to Dashboard'
                )}
              </button>

              <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-slate-200 bg-slate-700/50 border border-slate-600 hover:bg-slate-700 transition-all disabled:opacity-50"
              >
                Logout
              </button>
            </div>

            <p className="text-center text-slate-500 text-xs mt-4">
              You have access to {stores.length} store{stores.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
