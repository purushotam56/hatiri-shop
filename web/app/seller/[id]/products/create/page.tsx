'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import Link from 'next/link'

export default function SellerCreateProductPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    stock: '',
    unit: 'piece',
    categoryId: '',
  })

  useEffect(() => {
    const token = localStorage.getItem('sellerToken')
    if (!token) {
      router.push('/seller')
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('sellerToken')
      if (!token) {
        router.push('/seller')
        return
      }

      const response = await fetch(`http://localhost:3333/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          organisationId: orgId,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Failed to create product')
        return
      }

      router.push(`/seller/${orgId}/products`)
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
    localStorage.removeItem('sellerOrg')
    router.push('/seller')
  }

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-default-100 border-b border-default-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/seller/${orgId}/products`}>
              <Button isIconOnly variant="light" size="sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">New Product</h1>
            </div>
          </div>
          <Button isIconOnly color="default" variant="light" onPress={handleLogout}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card>
          <CardHeader>Product Details</CardHeader>
          <CardBody className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Product Name"
                name="name"
                placeholder="e.g., Fresh Tomatoes"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <textarea
                  name="description"
                  placeholder="Describe your product"
                  value={form.description}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground min-h-24"
                />
              </div>

              <Input
                label="SKU (Stock Keeping Unit)"
                name="sku"
                placeholder="e.g., TOM-001"
                value={form.sku}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (₹)"
                  name="price"
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

                <Input
                  label="Stock"
                  name="stock"
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Unit</label>
                  <select
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground"
                  >
                    <option value="piece">Piece</option>
                    <option value="kg">Kilogram</option>
                    <option value="liter">Liter</option>
                    <option value="dozen">Dozen</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Category</label>
                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground"
                  >
                    <option value="">Select Category</option>
                    <option value="1">Groceries</option>
                    <option value="2">Fruits & Vegetables</option>
                    <option value="3">Dairy</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Link href={`/seller/${orgId}/products`} className="flex-1">
                  <Button fullWidth variant="bordered" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
                <Button
                  fullWidth
                  color="primary"
                  type="submit"
                  isLoading={loading}
                  disabled={loading}
                >
                  Create Product
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
