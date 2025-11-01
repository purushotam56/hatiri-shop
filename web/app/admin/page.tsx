'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/context/admin-context'
import { COLORS, GRADIENTS, COMPONENTS, UTILS } from '@/lib/theme'

export default function AdminLoginPage() {
  const router = useRouter()
  const { setAdminUser } = useAdmin()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3333/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      // Store token
      localStorage.setItem('adminToken', data.token)
      setAdminUser(data.admin)

      router.push('/admin/dashboard')
    } catch (err) {
      setError('Connection error. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header gradient */}
          <div className="h-2 bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500"></div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">👑</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent mb-2">
                Hatiri Admin
              </h1>
              <p className="text-slate-400">Manage organizations and sellers</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@hatiri.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all disabled:opacity-50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all disabled:opacity-50"
                  required
                />
              </div>

              {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex gap-3">
                  <span className="text-xl">⚠️</span>
                  <p className="text-sm font-semibold text-red-200">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${COMPONENTS.button.admin}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className={UTILS.loadingSpinner}></span>
                    Logging in…
                  </span>
                ) : (
                  "Login as Admin"
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-600 bg-slate-700/30 rounded-lg p-4 text-xs text-slate-300">
              <p className="font-semibold text-amber-400 mb-2">Admin Credentials:</p>
              <p className="mb-1"><span className="text-slate-400">Email:</span> admin@hatiri.com</p>
              <p><span className="text-slate-400">Password:</span> Admin@123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          Not an admin?{" "}
          <a href="/" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
            Go to store
          </a>
        </p>
      </div>
    </main>
  )
}
