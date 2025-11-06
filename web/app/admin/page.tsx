'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/context/admin-context'
import { apiEndpoints } from '@/lib/api-client'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Chip } from '@heroui/chip'
import Link from 'next/link'

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
      const data = await apiEndpoints.adminLogin(formData);

      if (!data.admin) {
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
    <main className="min-h-screen bg-gradient-to-b from-content1 via-content2 to-content1 flex items-center justify-center px-4">
      <div className="relative w-full max-w-md">
        <Card className="w-full" shadow="lg">
          <div className="h-2 bg-gradient-to-r from-warning via-success to-warning"></div>
          
          <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-6">
            <div className="text-5xl mb-3">👑</div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-warning to-success bg-clip-text text-transparent">
              Hatiri Admin
            </h1>
            <p className="text-default-500">Manage organizations and sellers</p>
          </CardHeader>

          <CardBody className="gap-6">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Input
                type="email"
                label="Email Address"
                placeholder="admin@hatiri.com"
                value={formData.email}
                onChange={(e) => handleChange(e as any)}
                name="email"
                isDisabled={loading}
                isRequired
                variant="bordered"
              />

              <Input
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleChange(e as any)}
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
                {loading ? "Logging in…" : "Login as Admin"}
              </Button>
            </form>

            <Card className="bg-warning-50 dark:bg-warning-900/20">
              <CardBody className="text-xs">
                <p className="font-semibold text-warning mb-2">Admin Credentials:</p>
                <p className="mb-1"><span className="text-default-500">Email:</span> admin@hatiri.com</p>
                <p><span className="text-default-500">Password:</span> Admin@123</p>
              </CardBody>
            </Card>
          </CardBody>
        </Card>

        <p className="text-center text-default-500 text-sm mt-6">
          Not an admin?{" "}
          <Link href="/" className="text-warning hover:text-warning-600 font-semibold transition-colors">
            Go to store
          </Link>
        </p>
      </div>
    </main>
  )
}
