'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import Link from 'next/link'
import { Spinner } from '@heroui/spinner'

export default function SellerEditProductPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id
  const productId = params.productId
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    stock: '',
    quantity: '',
    unit: 'piece',
    categoryId: '',
    taxRate: '',
    taxType: 'percentage',
  })

  useEffect(() => {
    const token = localStorage.getItem('sellerToken')
    if (!token) {
      router.push('/seller')
      return
    }

    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setFetching(true)
      const token = localStorage.getItem('sellerToken')
      
      // Fetch product
      const response = await fetch(`http://localhost:3333/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        setError('Failed to load product')
        return
      }

      const data = await response.json()
      const product = data.product
      
      setForm({
        name: product.name || '',
        description: product.description || '',
        sku: product.sku || '',
        price: product.price ? product.price.toString() : '',
        stock: product.stock ? product.stock.toString() : '',
        quantity: product.quantity ? product.quantity.toString() : '',
        unit: product.unit || 'piece',
        categoryId: product.categoryId ? product.categoryId.toString() : '',
        taxRate: product.taxRate ? product.taxRate.toString() : '',
        taxType: product.taxType || 'percentage',
      })

      // Fetch categories
      try {
        const catResponse = await fetch(`http://localhost:3333/api/categories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (catResponse.ok) {
          const catData = await catResponse.json()
          setCategories(catData.data || [])
        }
      } catch (err) {
        console.error('Failed to fetch categories', err)
      }
    } catch (err) {
      setError('Connection error')
      console.error(err)
    } finally {
      setFetching(false)
    }
  }

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

      const response = await fetch(`http://localhost:3333/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          sku: form.sku,
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
          quantity: parseInt(form.quantity) || 0,
          unit: form.unit,
          categoryId: form.categoryId ? parseInt(form.categoryId) : null,
          taxRate: parseFloat(form.taxRate) || 0,
          taxType: form.taxType,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.message || 'Failed to update product')
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

  if (fetching) {
    return (
      <main className="min-h-screen bg-default-50 flex items-center justify-center">
        <Spinner />
      </main>
    )
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
              <h1 className="text-2xl font-bold text-foreground">Edit Product</h1>
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
                <Input
                  label="Quantity"
                  name="quantity"
                  type="number"
                  placeholder="0"
                  value={form.quantity}
                  onChange={handleChange}
                  disabled={loading}
                />

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
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Tax Rate (%)"
                  name="taxRate"
                  type="number"
                  placeholder="0"
                  step="0.01"
                  value={form.taxRate}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Tax Type</label>
                <select
                  name="taxType"
                  value={form.taxType}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                  <option value="compound">Compound</option>
                </select>
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
                  Save Changes
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
