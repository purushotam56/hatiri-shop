'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiEndpoints } from '@/lib/api-client'
import { useSellerStore, type Store } from '@/context/seller-store-context'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Tabs, Tab } from '@heroui/tabs'
import { Chip } from '@heroui/chip'
import Link from 'next/link'

export default function SellerAuthPage() {
  const router = useRouter()
  const { setSelectedStore, setStores, stores } = useSellerStore()
  const [activeTab, setActiveTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login form
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  // Register form
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    fullName: '',
    mobile: '',
    organisationName: '',
    organisationCode: '',
    businessType: '',
    city: '',
    country: '',
  })

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let finalValue = value
    // Convert organisationCode to lowercase
    if (name === 'organisationCode') {
      finalValue = value.toLowerCase().trim()
    }
    setRegisterForm((prev) => ({ ...prev, [name]: finalValue }))
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await apiEndpoints.sellerLogin(loginForm);

      if (!data.user) {
        setError(data.message || 'Login failed')
        return
      }

      localStorage.setItem('sellerToken', data.token)
      localStorage.setItem('sellerUser', JSON.stringify(data.user))
      
      // Store the available stores
      if (data.stores && data.stores.length > 0) {
        setStores(data.stores)

        // If only one store, auto-select it
        if (data.stores.length === 1) {
          await selectStoreAndRedirect(data.stores[0], data.token)
        } else {
          // Multiple stores, redirect to store selection
          router.push('/seller/select-store')
        }
      }
    } catch (err) {
      setError('Connection error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const selectStoreAndRedirect = async (store: Store, token: string) => {
    try {
      const token = localStorage.getItem('sellerToken') || ''
      const data = await apiEndpoints.sellerSelectStore(
        { storeId: store.id },
        token
      )

      if (!data.store) {
        setError(data.message || 'Failed to select store')
        return
      }

      // Update with the new token that includes store ID
      localStorage.setItem('sellerToken', data.token)
      setSelectedStore(data.store)
      router.push(`/seller/${store.id}/dashboard`)
    } catch (err) {
      setError('Failed to select store')
      console.error(err)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await apiEndpoints.sellerRegister(registerForm);

      if (!data.user) {
        setError(data.message || 'Registration failed')
        return
      }

      setError('')
      setActiveTab('login')
      setLoginForm({
        email: registerForm.email,
        password: registerForm.password,
      })
    } catch (err) {
      setError('Connection error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-content1 via-content2 to-content1 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <Card className="w-full" shadow="lg">
          <div className="h-2 bg-gradient-to-r from-warning via-danger to-secondary"></div>
          
          <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-6">
            <div className="text-5xl mb-3">🏪</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-warning to-danger bg-clip-text text-transparent">
              Hatiri Seller
            </h1>
            <p className="text-default-500">Manage your store & orders</p>
          </CardHeader>

          <CardBody className="gap-6">
            <Tabs
              fullWidth
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              color="warning"
              variant="bordered"
            >
              <Tab key="login" title="Login">
                <div className="py-4">
                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <Input
                      type="email"
                      label="Email Address"
                      placeholder="seller@example.com"
                      value={loginForm.email}
                      onChange={(e) => handleLoginChange(e as any)}
                      name="email"
                      isDisabled={loading}
                      isRequired
                      variant="bordered"
                    />

                    <Input
                      type="password"
                      label="Password"
                      placeholder="Enter your password"
                      value={loginForm.password}
                      onChange={(e) => handleLoginChange(e as any)}
                      name="password"
                      isDisabled={loading}
                      isRequired
                      variant="bordered"
                    />

                    {error && (
                      <Chip color="danger" variant="flat" startContent={<span>⚠️</span>} className="w-full justify-start p-4">
                        {error}
                      </Chip>
                    )}

                    <Button
                      type="submit"
                      color="warning"
                      variant="shadow"
                      fullWidth
                      isLoading={loading}
                      isDisabled={loading}
                    >
                      {loading ? "Logging in…" : "Login"}
                    </Button>
                  </form>
                </div>
              </Tab>

              <Tab key="register" title="Register">
                <div className="py-4">

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold text-default-700 mb-3">Store Information</p>
                    <Input
                      type="text"
                      label="Store Name"
                      placeholder="Your store name"
                      value={registerForm.organisationName}
                      onChange={(e) => handleRegisterChange(e as any)}
                      name="organisationName"
                      isDisabled={loading}
                      isRequired
                      variant="bordered"
                      size="sm"
                    />
                  </div>

                  <Input
                    type="text"
                    label="Store Code"
                    placeholder="e.g., FM001"
                    value={registerForm.organisationCode}
                    onChange={(e) => handleRegisterChange(e as any)}
                    name="organisationCode"
                    isDisabled={loading}
                    isRequired
                    variant="bordered"
                    description="Unique identifier for your store (letters and numbers only)"
                  />

                  <Input
                    type="text"
                    label="Business Type"
                    placeholder="e.g., Grocery, Electronics, Fashion"
                    value={registerForm.businessType}
                    onChange={(e) => handleRegisterChange(e as any)}
                    name="businessType"
                    isDisabled={loading}
                    isRequired
                    variant="bordered"
                  />

                  <Input
                    type="text"
                    label="City"
                    placeholder="Your store's city"
                    value={registerForm.city}
                    onChange={(e) => handleRegisterChange(e as any)}
                    name="city"
                    isDisabled={loading}
                    isRequired
                    variant="bordered"
                  />

                  <Input
                    type="text"
                    label="Country"
                    placeholder="e.g., India"
                    value={registerForm.country}
                    onChange={(e) => handleRegisterChange(e as any)}
                    name="country"
                    isDisabled={loading}
                    isRequired
                    variant="bordered"
                  />

                  <div>
                    <p className="text-sm font-semibold text-default-700 mb-3">Your Information</p>
                    <Input
                      type="text"
                      label="Full Name"
                      placeholder="Your full name"
                      value={registerForm.fullName}
                      onChange={(e) => handleRegisterChange(e as any)}
                      name="fullName"
                      isDisabled={loading}
                      isRequired
                      variant="bordered"
                      size="sm"
                    />
                  </div>

                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="your@example.com"
                    value={registerForm.email}
                    onChange={(e) => handleRegisterChange(e as any)}
                    name="email"
                    isDisabled={loading}
                    isRequired
                    variant="bordered"
                  />

                  <Input
                    type="tel"
                    label="Mobile Number"
                    placeholder="+1 (555) 000-0000"
                    value={registerForm.mobile}
                    onChange={(e) => handleRegisterChange(e as any)}
                    name="mobile"
                    isDisabled={loading}
                    variant="bordered"
                  />

                  <Input
                    type="password"
                    label="Password"
                    placeholder="Choose a strong password"
                    value={registerForm.password}
                    onChange={(e) => handleRegisterChange(e as any)}
                    name="password"
                    isDisabled={loading}
                    isRequired
                    variant="bordered"
                  />

                  {error && (
                    <Chip color="danger" variant="flat" startContent={<span>⚠️</span>} className="w-full justify-start p-4">
                      {error}
                    </Chip>
                  )}

                  <Button
                    type="submit"
                    color="warning"
                    variant="shadow"
                    fullWidth
                    isLoading={loading}
                    isDisabled={loading}
                  >
                    {loading ? "Creating…" : "Register"}
                  </Button>
                </form>
                </div>
              </Tab>
            </Tabs>


          </CardBody>
        </Card>

        <p className="text-center text-default-500 text-sm mt-6">
          Want to shop instead?{" "}
          <Link href="/" className="text-warning hover:text-warning-600 font-semibold transition-colors">
            Go to store
          </Link>
        </p>
      </div>
    </main>
  )
}
