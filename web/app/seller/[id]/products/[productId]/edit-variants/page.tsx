'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import Link from 'next/link'
import { Spinner } from '@heroui/spinner'
import { Switch } from '@heroui/switch'
import { apiEndpoints } from '@/lib/api-client'
import RichTextEditor from '@/components/rich-text-editor'

interface VariantEdit {
  id: number
  label: string
  skuSuffix: string
  price: string
  quantity: string
  unit: string
  discountType: string
  discountValue: string
  isDiscountActive: boolean
}

interface ProductGroupForm {
  name: string
  description: string
  categoryId: string
  details: string
  stock: string
  unit: string
  variants: VariantEdit[]
}

export default function SellerEditProductVariantsPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id
  const productId = params.productId
  
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([])
  const [groupId, setGroupId] = useState<number | null>(null)
  
  const [form, setForm] = useState<ProductGroupForm>({
    name: '',
    description: '',
    categoryId: '',
    details: '',
    stock: '',
    unit: 'piece',
    variants: [],
  })

  useEffect(() => {
    const token = localStorage.getItem('sellerToken')
    if (!token) {
      router.push('/seller')
      return
    }

    fetchProductGroup()
    fetchCategories()
  }, [productId])

  const fetchCategories = async () => {
    try {
      const data = await apiEndpoints.getOrganisationCategories(orgId as string)
      setCategories(data.data || [])
    } catch (err) {
      console.error('Failed to fetch categories', err)
    }
  }

  const fetchProductGroup = async () => {
    try {
      setFetching(true)
      const token = localStorage.getItem('sellerToken')
      
      // First fetch single product to get the group ID
      const productData = await apiEndpoints.getProduct(String(productId))
      const product = productData.product || productData
      
      if (!product) {
        setError('Product not found')
        return
      }

      const groupIdValue = product.productGroupId || product.id
      setGroupId(groupIdValue)

      // Then fetch the full group with all variants
      const groupData = await apiEndpoints.getSellerProductGroupDetail(String(orgId), groupIdValue, token || '')
      const group = groupData.productGroup

      if (!group) {
        setError('Product group not found')
        return
      }

      // Format variants for editing
      const formattedVariants: VariantEdit[] = group.variants.map((v: any) => {
        // Extract label from name and SKU
        const baseName = group.name
        const label = v.name.replace(baseName, '').trim()
        const skuSuffix = v.sku.replace(group.variants[0].sku.replace(/[^-]*-?$/, ''), '')

        return {
          id: v.id,
          label,
          skuSuffix,
          price: v.price.toString(),
          quantity: v.quantity?.toString() || '',
          unit: v.unit || 'piece',
          discountType: v.discountType || 'percentage',
          discountValue: v.discountPercentage?.toString() || '',
          isDiscountActive: v.isDiscountActive || false,
        }
      })

      setForm({
        name: group.name,
        description: group.description,
        categoryId: group.categoryId?.toString() || '',
        details: group.details,
        stock: group.stock?.toString() || '',
        unit: group.unit,
        variants: formattedVariants,
      })
    } catch (err) {
      setError('Failed to load product group')
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

  const handleVariantChange = (index: number, field: keyof VariantEdit, value: any) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => 
        i === index ? { ...v, [field]: value } : v
      ),
    }))
  }

  const getAvailableVariantUnits = (groupUnit: string): string[] => {
    const unitOptions: { [key: string]: string[] } = {
      kg: ['kg', 'gm', 'mg'],
      liter: ['liter', 'ml'],
      dozen: ['dozen', 'piece'],
      piece: ['piece']
    }
    return unitOptions[groupUnit] || [groupUnit]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('sellerToken')
      if (!token || !groupId) {
        router.push('/seller')
        return
      }

      // Validate form
      if (!form.name || !form.categoryId || !form.stock || !form.unit) {
        setError('Please fill in all required fields')
        setLoading(false)
        return
      }

      // Validate variants
      const invalidVariant = form.variants.find(v => !v.label || !v.skuSuffix || !v.price || !v.quantity)
      if (invalidVariant) {
        setError('Please fill in all variant fields')
        setLoading(false)
        return
      }

      // Build FormData
      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('categoryId', form.categoryId)
      formData.append('details', form.details)
      formData.append('stock', form.stock)
      formData.append('unit', form.unit)

      // Add variants
      form.variants.forEach((variant, index) => {
        formData.append(`variants[${index}][id]`, variant.id.toString())
        formData.append(`variants[${index}][label]`, variant.label)
        formData.append(`variants[${index}][skuSuffix]`, variant.skuSuffix)
        formData.append(`variants[${index}][price]`, variant.price)
        formData.append(`variants[${index}][quantity]`, variant.quantity)
        formData.append(`variants[${index}][unit]`, variant.unit)
        
        if (variant.isDiscountActive && variant.discountValue) {
          formData.append(`variants[${index}][isDiscountActive]`, 'true')
          formData.append(`variants[${index}][discountType]`, variant.discountType)
          formData.append(`variants[${index}][discountValue]`, variant.discountValue)
        }
      })

      const data = await apiEndpoints.updateProductVariants(String(orgId), groupId, formData, token)

      if (data.error) {
        setError(data.message || 'Failed to update product')
        setLoading(false)
        return
      }

      setSuccess('Product variants updated successfully!')
      setTimeout(() => {
        router.push(`/seller/${orgId}/products`)
      }, 1500)
    } catch (err) {
      setError('Connection error')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <main className="min-h-screen bg-default-50 flex items-center justify-center">
        <Spinner label="Loading product group..." />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-default-100 border-b border-default-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Edit Product Variants</h1>
          <Link href={`/seller/${orgId}/products`}>
            <Button color="default" variant="light">
              Back to Products
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 mb-6">
            <CardBody>
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </CardBody>
          </Card>
        )}

        {success && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 mb-6">
            <CardBody>
              <p className="text-green-600 dark:text-green-400">{success}</p>
            </CardBody>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader className="border-b border-default-200">
              <p className="font-semibold">Product Information</p>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Product Name (Base)"
                placeholder="e.g., Tomato, Oil, Rice"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={loading}
                description="Variant names will be added to this (e.g., Tomato 500gm)"
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Description</label>
                <textarea
                  name="description"
                  placeholder="Brief description for product listing"
                  value={form.description}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground min-h-20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">Product Details (Rich Text)</label>
                <RichTextEditor
                  content={form.details}
                  onChange={(content) => setForm(prev => ({ ...prev, details: content }))}
                  placeholder="Enter detailed product information, specifications, ingredients, etc."
                  disabled={loading}
                />
              </div>
            </CardBody>
          </Card>

          {/* Group-level Inventory */}
          <Card className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800">
            <CardHeader className="border-b border-primary-200 dark:border-primary-800">
              <p className="font-semibold text-primary-700 dark:text-primary-400">
                Inventory (shared by all variants)
              </p>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Total Stock"
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={handleChange}
                  name="stock"
                  required
                  disabled={loading}
                  description="Stock shared across all variants"
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

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Category</label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  disabled={loading}
                  required
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
            </CardBody>
          </Card>

          {/* Variants */}
          <Card className="border-2 border-primary-200 dark:border-primary-800">
            <CardHeader className="border-b border-primary-200 dark:border-primary-800">
              <p className="font-semibold">Product Variants</p>
            </CardHeader>
            <CardBody className="space-y-4">
              {form.variants.map((variant, index) => (
                <Card key={variant.id} className="bg-default-50 dark:bg-default-100/50">
                  <CardBody className="space-y-3">
                    <p className="text-sm font-semibold text-default-700">
                      Variant {index + 1}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label="Variant Label"
                        placeholder="e.g., 1kg, 2kg, 5kg"
                        value={variant.label}
                        onChange={(e) => handleVariantChange(index, 'label', e.target.value)}
                        required
                        disabled={loading}
                        size="sm"
                      />

                      <Input
                        label="SKU Suffix"
                        placeholder="e.g., -1KG, -2KG"
                        value={variant.skuSuffix}
                        onChange={(e) => handleVariantChange(index, 'skuSuffix', e.target.value)}
                        required
                        disabled={loading}
                        size="sm"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <Input
                        label="Price (₹)"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                        required
                        disabled={loading}
                        size="sm"
                      />
                    </div>

                    {/* Discount Section */}
                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Discount</p>
                        <Switch
                          isSelected={variant.isDiscountActive}
                          onValueChange={(value) => handleVariantChange(index, 'isDiscountActive', value)}
                          color="primary"
                          disabled={loading}
                          size="sm"
                        />
                      </div>
                      {variant.isDiscountActive && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-medium text-foreground block mb-1">Type</label>
                            <select
                              value={variant.discountType}
                              onChange={(e) => handleVariantChange(index, 'discountType', e.target.value)}
                              disabled={loading}
                              className="w-full px-2 py-1 text-xs border border-default-200 rounded bg-white dark:bg-default-100 text-foreground"
                            >
                              <option value="percentage">% Discount</option>
                              <option value="fixed_amount">Fixed ₹</option>
                            </select>
                          </div>
                          <Input
                            label={variant.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}
                            type="number"
                            placeholder="0"
                            step={variant.discountType === 'percentage' ? '1' : '0.01'}
                            max={variant.discountType === 'percentage' ? '100' : undefined}
                            value={variant.discountValue}
                            onChange={(e) => handleVariantChange(index, 'discountValue', e.target.value)}
                            disabled={loading}
                            size="sm"
                          />
                        </div>
                      )}
                      {variant.price && variant.discountValue && variant.isDiscountActive && (
                        <div className="text-xs text-default-600 bg-white dark:bg-default-100 rounded p-2">
                          Final: ₹{
                            variant.discountType === 'percentage'
                              ? (parseFloat(variant.price) - (parseFloat(variant.price) * parseFloat(variant.discountValue) / 100)).toFixed(2)
                              : (parseFloat(variant.price) - parseFloat(variant.discountValue)).toFixed(2)
                          }
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        label={`Quantity (${form.unit})`}
                        type="number"
                        placeholder="e.g., 500"
                        step="0.01"
                        value={variant.quantity}
                        onChange={(e) => handleVariantChange(index, 'quantity', e.target.value)}
                        required
                        disabled={loading}
                        size="sm"
                        description="Amount in variant"
                      />
                      <div>
                        <label className="text-xs font-medium text-foreground block mb-1">Variant Unit</label>
                        <select
                          value={variant.unit}
                          onChange={(e) => handleVariantChange(index, 'unit', e.target.value)}
                          disabled={loading}
                          className="w-full px-3 py-2 text-sm border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground"
                        >
                          {getAvailableVariantUnits(form.unit).map((unit) => (
                            <option key={unit} value={unit}>
                              {unit === 'gm' ? 'Gram' : unit === 'mg' ? 'Milligram' : unit === 'ml' ? 'Milliliter' : unit.charAt(0).toUpperCase() + unit.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-xs text-default-500 bg-default-100 dark:bg-default-200/50 rounded p-2">
                      Full name: <span className="font-semibold">{form.name} {variant.label}</span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </CardBody>
          </Card>

          {/* Submit */}
          <div className="flex gap-3">
            <Button
              type="submit"
              color="primary"
              size="lg"
              disabled={loading}
              className="flex-1"
            >
              {loading ? <Spinner size="sm" color="current" /> : 'Update Product Variants'}
            </Button>
            <Link href={`/seller/${orgId}/products`} className="flex-1">
              <Button
                as="span"
                color="default"
                variant="bordered"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
