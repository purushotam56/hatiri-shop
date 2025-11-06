'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import Link from 'next/link'
import { apiEndpoints, apiUpload } from '@/lib/api-client'
import RichTextEditor from '@/components/rich-text-editor'
import ImageUpload from '@/components/image-upload'
import MultipleImageUpload from '@/components/multiple-image-upload'

export default function SellerCreateProductPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [form, setForm] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    stock: '',
    unit: 'piece',
    categoryId: '',
    details: '',
    productGroupId: '',
    options: '',
  })
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [productImages, setProductImages] = useState<File[]>([])

  useEffect(() => {
    const token = localStorage.getItem('sellerToken')
    if (!token) {
      router.push('/seller')
      return
    }

    // Fetch categories for this organization
    const fetchCategories = async () => {
      try {
        const data = await apiEndpoints.getOrganisationCategories(orgId as string);
        setCategories(data.data || [])
      } catch (err) {
        console.error('Failed to fetch categories', err)
      }
    }

    fetchCategories()
  }, [router, orgId])

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

      // Create FormData for file uploads
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('sku', form.sku)
      formData.append('price', form.price)
      formData.append('stock', form.stock)
      formData.append('unit', form.unit)
      formData.append('categoryId', form.categoryId)
      formData.append('organisationId', orgId as string)
      formData.append('details', form.details)
      
      // Add optional fields
      if (form.productGroupId) {
        formData.append('productGroupId', form.productGroupId)
      }
      if (form.options) {
        formData.append('options', form.options)
      }

      // Add banner image if present
      if (bannerImage) {
        formData.append('bannerImage', bannerImage)
      }

      // Add product images if present
      productImages.forEach((image, index) => {
        formData.append(`productImages`, image)
      })

      const data = await apiUpload('/products', formData, token)

      if (data.error) {
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
                  placeholder="Brief description for product listing"
                  value={form.description}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground min-h-20"
                />
              </div>

              {/* Rich Text Editor for Details */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Product Details (Rich Text)</label>
                <RichTextEditor
                  content={form.details}
                  onChange={(content) => setForm(prev => ({ ...prev, details: content }))}
                  placeholder="Enter detailed product information, specifications, ingredients, etc."
                  disabled={loading}
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
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Product Group ID (optional) */}
              <Input
                label="Product Group ID (optional)"
                name="productGroupId"
                type="number"
                placeholder="Leave empty for new group"
                value={form.productGroupId}
                onChange={handleChange}
                disabled={loading}
                description="Group similar products together (e.g., different sizes of same product)"
              />

              {/* Product Options (optional) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Options (optional)</label>
                <textarea
                  name="options"
                  placeholder='e.g., ["Color: Red", "Size: Large", "Material: Cotton"]'
                  value={form.options}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground min-h-20 font-mono text-sm"
                />
                <p className="text-xs text-foreground/60">Enter as JSON array format or comma-separated values</p>
              </div>

              {/* Banner Image Upload */}
              <ImageUpload
                label="Banner Image"
                value={null}
                onChange={setBannerImage}
                disabled={loading}
                aspectRatio="landscape"
              />

              {/* Multiple Product Images */}
              <MultipleImageUpload
                label="Product Images"
                value={productImages}
                onChange={setProductImages}
                disabled={loading}
                maxImages={10}
              />

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
