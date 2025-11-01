'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { COLORS, GRADIENTS, COMPONENTS, UTILS } from '@/lib/theme'

export default function SellerAuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
    organisationCode: '',
  })

  // Register form
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    fullName: '',
    mobile: '',
    organisationCode: '',
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3333/api/seller/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Login failed')
        return
      }

      localStorage.setItem('sellerToken', data.token)
      localStorage.setItem('sellerUser', JSON.stringify(data.user))
      localStorage.setItem('sellerOrg', JSON.stringify(data.organisation))

      router.push(`/seller/${data.organisation.id}/dashboard`)
    } catch (err) {
      setError('Connection error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3333/api/seller/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registration failed')
        return
      }

      setError('')
      setActiveTab('login')
      setLoginForm({
        email: registerForm.email,
        password: registerForm.password,
        organisationCode: registerForm.organisationCode,
      })
    } catch (err) {
      setError('Connection error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500"></div>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🏪</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-2">
                Hatiri Seller
              </h1>
              <p className="text-slate-400">Manage your store & orders</p>
            </div>

            <div className="flex gap-2 mb-6 bg-slate-700/30 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                  activeTab === 'login'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2 rounded-md font-semibold transition-all ${
                  activeTab === 'register'
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Register
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Organization Code
                  </label>
                  <input
                    type="text"
                    name="organisationCode"
                    placeholder="e.g., FM001"
                    value={loginForm.organisationCode}
                    onChange={handleLoginChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="seller@example.com"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
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
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
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
                  className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${COMPONENTS.button.seller}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className={UTILS.loadingSpinner}></span>
                      Logging in…
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            )}

            {/* Register Form */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Organization Code
                  </label>
                  <input
                    type="text"
                    name="organisationCode"
                    placeholder="e.g., FM001"
                    value={registerForm.organisationCode}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Your full name"
                    value={registerForm.fullName}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your@example.com"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="+1 (555) 000-0000"
                    value={registerForm.mobile}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Choose a strong password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50"
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
                  className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${COMPONENTS.button.seller}`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className={UTILS.loadingSpinner}></span>
                      Creating…
                    </span>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-6 border-t border-slate-600 bg-slate-700/30 rounded-lg p-4 text-xs text-slate-300">
              <p className="font-semibold text-orange-400 mb-2">Test Account:</p>
              <p className="mb-1"><span className="text-slate-400">Org Code:</span> FM001</p>
              <p className="mb-1"><span className="text-slate-400">Email:</span> seller1@example.com</p>
              <p><span className="text-slate-400">Password:</span> Password@123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-slate-400 text-sm mt-6">
          Want to shop instead?{" "}
          <a href="/" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
            Go to store
          </a>
        </p>
      </div>
    </main>
  )
}
