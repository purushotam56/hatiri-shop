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
import { Switch } from '@heroui/switch'

interface VariantForm {
  id: string
  label: string // e.g., "500 gm", "1 kg", "2 kg"
  skuSuffix: string // e.g., "-500GM", "-1KG"
  price: string
  quantity: string // e.g., "500" for 500 gm when group unit is kg
  unit: string // e.g., "gm", "ml" when group is in "kg" or "liter"
  stock: string // for independent inventory mode
  discountType: string // 'percentage' or 'fixed_amount'
  discountValue: string // discount percentage or fixed amount
  isDiscountActive: boolean
  description: string // for independent inventory mode
  useSameDescription: boolean // use main product description
  bannerImage: File | null // for independent inventory mode
  useSameBannerImage: boolean // use main product banner
  images: File[] // variant-specific images
  useSameImages: boolean // use main product images
}

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
    discountType: 'percentage',
    discountValue: '',
    isDiscountActive: false,
    stockMergeType: 'merged' as 'merged' | 'independent',
  })
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [productImages, setProductImages] = useState<File[]>([])
  
  // Variant management state
  const [hasVariants, setHasVariants] = useState(false)
  const [variants, setVariants] = useState<VariantForm[]>([
    { id: '1', label: '', skuSuffix: '', price: '', quantity: '', unit: 'kg', stock: '', discountType: 'percentage', discountValue: '', isDiscountActive: false, description: '', useSameDescription: true, bannerImage: null, useSameBannerImage: true, images: [], useSameImages: true },
    { id: '2', label: '', skuSuffix: '', price: '', quantity: '', unit: 'kg', stock: '', discountType: 'percentage', discountValue: '', isDiscountActive: false, description: '', useSameDescription: true, bannerImage: null, useSameBannerImage: true, images: [], useSameImages: true }
  ])

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

  // Sync variant units with group unit when in merged mode
  useEffect(() => {
    if (form.stockMergeType === 'merged') {
      // When switching to merged mode, sync all variant units to group unit
      setVariants(variants.map(v => ({ ...v, unit: form.unit })))
    }
  }, [form.stockMergeType, form.unit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleVariantChange = (id: string, field: keyof VariantForm, value: string | boolean | File | null) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v))
  }

  const addVariant = () => {
    const newId = (Math.max(...variants.map(v => parseInt(v.id)), 0) + 1).toString()
    const availableUnits = getAvailableVariantUnits(form.unit)
    const defaultUnit = availableUnits[0] || 'piece'
    setVariants([...variants, { id: newId, label: '', skuSuffix: '', price: '', quantity: '', unit: defaultUnit, stock: '', discountType: 'percentage', discountValue: '', isDiscountActive: false, description: '', useSameDescription: true, bannerImage: null, useSameBannerImage: true, images: [], useSameImages: true }])
  }

  const removeVariant = (id: string) => {
    if (variants.length > 2) {
      setVariants(variants.filter(v => v.id !== id))
    }
  }

  // Helper function to check if units are compatible
  const isCompatibleUnits = (groupUnit: string, variantUnits: string[]): boolean => {
    const unitGroups: { [key: string]: string[] } = {
      kg: ['kg', 'gm', 'mg'],
      liter: ['liter', 'ml'],
      dozen: ['dozen', 'piece'],
      piece: ['piece']
    }
    const group = unitGroups[groupUnit] || [groupUnit]
    return variantUnits.every(u => group.includes(u))
  }

  // Get available variant units based on group unit
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

    try {
      const token = localStorage.getItem('sellerToken')
      if (!token) {
        router.push('/seller')
        return
      }

      // If creating with variants, use the new API endpoint
      if (hasVariants) {
        // Validate minimum 2 variants
        if (variants.length < 2) {
          setError('At least 2 variants are required')
          return
        }

        // Validate variants
        const invalidVariant = variants.find(v => !v.label || !v.skuSuffix || !v.price || !v.quantity || !v.unit)
        if (invalidVariant) {
          setError('Please fill in all variant fields (label, SKU, price, quantity, and unit)')
          return
        }

        // Validate stock based on merge type
        if (form.stockMergeType === 'merged') {
          if (!form.stock) {
            setError('Group stock is required for merged inventory mode')
            return
          }
        } else {
          // Independent mode - check that all variants have stock
          const variantWithoutStock = variants.find(v => !v.stock)
          if (variantWithoutStock) {
            setError('Each variant must have stock defined for independent inventory mode')
            return
          }
        }

        // Validate that all variants have compatible units
        const variantUnits = variants.map(v => v.unit)
        if (!isCompatibleUnits(form.unit, variantUnits)) {
          setError('All variant units must be compatible with the group unit')
          return
        }

        // Use FormData to handle file uploads
        const formData = new FormData()
        
        // Add base product data
        formData.append('name', form.name)
        formData.append('description', form.description)
        formData.append('sku', form.sku)
        formData.append('categoryId', form.categoryId)
        formData.append('organisationId', orgId as string)
        formData.append('details', form.details)
        formData.append('stock', form.stock)
        formData.append('unit', form.unit)
        formData.append('stockMergeType', form.stockMergeType)
        if (form.options) {
          formData.append('options', form.options)
        }

        // Add banner image if present
        if (bannerImage) {
          formData.append('bannerImage', bannerImage)
        }

        // Add shared product images
        productImages.forEach((image) => {
          formData.append('productImages', image)
        })

        // Add variants and their images
        variants.forEach((variant, index) => {
          formData.append(`variants[${index}][label]`, variant.label)
          formData.append(`variants[${index}][skuSuffix]`, variant.skuSuffix)
          formData.append(`variants[${index}][price]`, variant.price)
          formData.append(`variants[${index}][quantity]`, variant.quantity)
          formData.append(`variants[${index}][unit]`, variant.unit)
          
          // Add stock for independent mode
          if (form.stockMergeType === 'independent' && variant.stock) {
            formData.append(`variants[${index}][stock]`, variant.stock)
          }
          
          // Add variant-specific assets for independent mode
          if (form.stockMergeType === 'independent') {
            // Description
            if (!variant.useSameDescription && variant.description) {
              formData.append(`variants[${index}][description]`, variant.description)
            }
            formData.append(`variants[${index}][useSameDescription]`, String(variant.useSameDescription))
            
            // Banner image
            if (!variant.useSameBannerImage && variant.bannerImage) {
              formData.append(`variants[${index}][bannerImage]`, variant.bannerImage)
            }
            formData.append(`variants[${index}][useSameBannerImage]`, String(variant.useSameBannerImage))
            
            // Images
            if (!variant.useSameImages) {
              variant.images.forEach((image) => {
                formData.append(`variants[${index}][images]`, image)
              })
            }
            formData.append(`variants[${index}][useSameImages]`, String(variant.useSameImages))
          } else {
            // Merged mode - only add variant images
            variant.images.forEach((image) => {
              formData.append(`variants[${index}][images]`, image)
            })
          }
          
          // Add discount fields if active
          if (variant.isDiscountActive && variant.discountValue) {
            formData.append(`variants[${index}][isDiscountActive]`, 'true')
            formData.append(`variants[${index}][discountType]`, variant.discountType)
            formData.append(`variants[${index}][discountValue]`, variant.discountValue)
          }
        })

        const data = await apiEndpoints.createProductWithVariants(orgId as string, formData, token)

        if (data.error) {
          setError(data.message || 'Failed to create product with variants')
          return
        }

        router.push(`/seller/${orgId}/products`)
      } else {
        // Original single product creation with image upload
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
        
        // Add discount fields if discount is active
        if (form.isDiscountActive && form.discountValue) {
          formData.append('isDiscountActive', 'true')
          formData.append('discountType', form.discountType)
          formData.append('discountValue', form.discountValue)
        }
        
        if (form.productGroupId) {
          formData.append('productGroupId', form.productGroupId)
        }
        if (form.options) {
          formData.append('options', form.options)
        }

        if (bannerImage) {
          formData.append('bannerImage', bannerImage)
        }

        productImages.forEach((image, index) => {
          formData.append(`productImages`, image)
        })

        const data = await apiUpload('/products', formData, token)

        if (data.error) {
          setError(data.message || 'Failed to create product')
          return
        }

        router.push(`/seller/${orgId}/products`)
      }
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
                description={hasVariants ? "Base name (variants will be like 'Fresh Tomatoes 1kg')" : ""}
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

              {/* Category */}
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

              {/* Variant Toggle */}
              <Card className="bg-primary-50 dark:bg-primary-950/20 border-2 border-primary-200 dark:border-primary-800">
                <CardBody className="py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-primary-700 dark:text-primary-400">
                        Product has multiple variants?
                      </p>
                      <p className="text-sm text-primary-600 dark:text-primary-500">
                        e.g., different sizes like 1kg, 2kg, 5kg
                      </p>
                    </div>
                    <Switch
                      isSelected={hasVariants}
                      onValueChange={setHasVariants}
                      color="primary"
                      disabled={loading}
                    />
                  </div>
                </CardBody>
              </Card>

              {!hasVariants ? (
                <>
                  {/* Single Product Form */}
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

                  {/* Discount Section */}
                  <Card className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-blue-700 dark:text-blue-400">Discount Settings</p>
                        <Switch
                          isSelected={form.isDiscountActive}
                          onValueChange={(value) => setForm(prev => ({ ...prev, isDiscountActive: value }))}
                          color="primary"
                          disabled={loading}
                        />
                      </div>
                    </CardHeader>
                    {form.isDiscountActive && (
                      <CardBody className="space-y-3 pt-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-foreground block mb-2">Discount Type</label>
                            <select
                              name="discountType"
                              value={form.discountType}
                              onChange={handleChange}
                              disabled={loading}
                              className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground"
                            >
                              <option value="percentage">Percentage (%)</option>
                              <option value="fixed_amount">Fixed Amount (₹)</option>
                            </select>
                          </div>
                          <Input
                            label={form.discountType === 'percentage' ? 'Discount (%)' : 'Discount (₹)'}
                            name="discountValue"
                            type="number"
                            placeholder={form.discountType === 'percentage' ? '0-100' : '0.00'}
                            step={form.discountType === 'percentage' ? '1' : '0.01'}
                            max={form.discountType === 'percentage' ? '100' : undefined}
                            value={form.discountValue}
                            onChange={handleChange}
                            disabled={loading}
                          />
                        </div>
                        {form.price && form.discountValue && (
                          <div className="p-3 bg-white dark:bg-default-100 rounded-lg border border-default-200">
                            <p className="text-sm text-default-600">
                              Original Price: ₹{parseFloat(form.price).toFixed(2)}<br />
                              Discount: {form.discountType === 'percentage' ? `${form.discountValue}%` : `₹${form.discountValue}`}<br />
                              <span className="font-semibold text-success-600 dark:text-success-400">
                                Final Price: ₹{
                                  form.discountType === 'percentage'
                                    ? (parseFloat(form.price) - (parseFloat(form.price) * parseFloat(form.discountValue) / 100)).toFixed(2)
                                    : (parseFloat(form.price) - parseFloat(form.discountValue)).toFixed(2)
                                }
                              </span>
                            </p>
                          </div>
                        )}
                      </CardBody>
                    )}
                  </Card>

                  <div>
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

                  {/* Product Group ID (optional) */}
                  <Input
                    label="Product Group ID (optional)"
                    name="productGroupId"
                    type="number"
                    placeholder="Leave empty for new group"
                    value={form.productGroupId}
                    onChange={handleChange}
                    disabled={loading}
                    description="Group similar products together"
                  />

                  {/* Product Options (optional) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Options (optional)</label>
                    <textarea
                      name="options"
                      placeholder='e.g., ["Color: Red", "Size: Large"]'
                      value={form.options}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground min-h-20 font-mono text-sm"
                    />
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
                </>
              ) : (
                <>
                  {/* Variant Builder */}
                  <Input
                    label="Base SKU"
                    name="sku"
                    placeholder="e.g., TOM"
                    value={form.sku}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    description="Each variant will have this as prefix (e.g., TOM-1KG, TOM-2KG)"
                  />

                  {/* Unit Selector - Always visible */}
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

                  {/* Group-level Inventory Management */}
                  <div className="bg-white dark:bg-default-100 rounded-lg p-4 border border-primary-300 dark:border-primary-700 space-y-4">
                    {/* Inventory Type Toggle */}
                    <div className="flex items-center justify-between pb-3 border-b border-primary-200 dark:border-primary-800">
                      <div>
                        <p className="text-sm font-medium text-primary-700 dark:text-primary-400">
                          {form.stockMergeType === 'merged' ? 'Inventory (shared by all variants)' : 'Inventory (independent per variant)'}
                        </p>
                        <p className="text-xs text-primary-600 dark:text-primary-500">
                          {form.stockMergeType === 'merged' ? 'All variants share the same inventory pool' : 'Each variant has independent stock'}
                        </p>
                      </div>
                      <Switch
                        isSelected={form.stockMergeType === 'merged'}
                        onValueChange={(value) => setForm(prev => ({ ...prev, stockMergeType: value ? 'merged' : 'independent' }))}
                        color="primary"
                        disabled={loading}
                      />
                    </div>
                    
                    {/* Show global stock only when inventory is merged */}
                    {form.stockMergeType === 'merged' && (
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
                    )}
                  </div>

                  <Card className="border-2 border-primary-200 dark:border-primary-800">
                    <CardHeader className="flex justify-between items-center pb-3">
                      <div>
                        <p className="font-semibold">Product Variants</p>
                        <p className="text-sm text-default-500">Add different sizes or options</p>
                      </div>
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onPress={addVariant}
                        disabled={loading}
                      >
                        + Add Variant
                      </Button>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      {variants.map((variant, index) => (
                        <Card key={variant.id} className="bg-default-50 dark:bg-default-100/50">
                          <CardBody className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-semibold text-default-700">
                                Variant {index + 1}
                              </p>
                              {variants.length > 2 && (
                                <Button
                                  isIconOnly
                                  size="sm"
                                  variant="light"
                                  color="danger"
                                  onPress={() => removeVariant(variant.id)}
                                  disabled={loading}
                                  title="Minimum 2 variants required"
                                >
                                  ✕
                                </Button>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <Input
                                label="Variant Label"
                                placeholder="e.g., 1kg, 2kg, 5kg"
                                value={variant.label}
                                onChange={(e) => handleVariantChange(variant.id, 'label', e.target.value)}
                                required
                                disabled={loading}
                                size="sm"
                              />

                              <Input
                                label="SKU Suffix"
                                placeholder="e.g., -1KG, -2KG"
                                value={variant.skuSuffix}
                                onChange={(e) => handleVariantChange(variant.id, 'skuSuffix', e.target.value)}
                                required
                                disabled={loading}
                                size="sm"
                                description={`Full SKU: ${form.sku}${variant.skuSuffix}`}
                              />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                              <Input
                                label="Price (₹)"
                                type="number"
                                placeholder="0.00"
                                step="0.01"
                                value={variant.price}
                                onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                                required
                                disabled={loading}
                                size="sm"
                              />
                            </div>

                            {/* Variant Discount */}
                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-blue-700 dark:text-blue-400">Discount</p>
                                <Switch
                                  isSelected={variant.isDiscountActive}
                                  onValueChange={(value) => handleVariantChange(variant.id, 'isDiscountActive', value ? 'true' : 'false')}
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
                                      onChange={(e) => handleVariantChange(variant.id, 'discountType', e.target.value)}
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
                                    onChange={(e) => handleVariantChange(variant.id, 'discountValue', e.target.value)}
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
                                onChange={(e) => handleVariantChange(variant.id, 'quantity', e.target.value)}
                                required
                                disabled={loading}
                                size="sm"
                                description="Amount in variant"
                              />
                              <div>
                                <label className="text-xs font-medium text-foreground block mb-1">Variant Unit</label>
                                <select
                                  value={variant.unit}
                                  onChange={(e) => handleVariantChange(variant.id, 'unit', e.target.value)}
                                  disabled={loading}
                                  className="w-full px-3 py-2 text-sm border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground"
                                >
                                  {getAvailableVariantUnits(form.unit).map((unit) => (
                                    <option key={unit} value={unit}>
                                      {unit === 'gm' ? 'Gram' : unit === 'mg' ? 'Milligram' : unit === 'ml' ? 'Milliliter' : unit.charAt(0).toUpperCase() + unit.slice(1)}
                                    </option>
                                  ))}
                                </select>
                                {form.stockMergeType === 'merged' && (
                                  <p className="text-xs text-default-500 mt-1">Related to master unit: {form.unit === 'gm' ? 'Gram' : form.unit === 'mg' ? 'Milligram' : form.unit === 'ml' ? 'Milliliter' : form.unit.charAt(0).toUpperCase() + form.unit.slice(1)}</p>
                                )}
                              </div>
                            </div>

                            {/* Show stock input only for independent inventory mode */}
                            {form.stockMergeType === 'independent' && (
                              <Input
                                label="Stock"
                                type="number"
                                placeholder="0"
                                value={variant.stock}
                                onChange={(e) => handleVariantChange(variant.id, 'stock', e.target.value)}
                                required
                                disabled={loading}
                                size="sm"
                                description="Stock for this variant only"
                              />
                            )}

                            <div className="text-xs text-default-500 bg-default-100 dark:bg-default-200/50 rounded p-2">
                              Full name: <span className="font-semibold">{form.name} {variant.label}</span>
                            </div>

                            {/* Independent Mode: Variant-specific assets (skip for Variant 1 as it's the main) */}
                            {form.stockMergeType === 'independent' && index > 0 && (
                              <div className="space-y-4 pt-3 border-t-2 border-primary-300">
                                {/* Variant Description */}
                                <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-medium text-blue-700 dark:text-blue-400">Description</label>
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        isSelected={variant.useSameDescription}
                                        onValueChange={(value) => handleVariantChange(variant.id, 'useSameDescription', value)}
                                        color="primary"
                                        disabled={loading}
                                        size="sm"
                                      />
                                      <span className="text-xs text-blue-600 dark:text-blue-500">{variant.useSameDescription ? 'Using main' : 'Custom'}</span>
                                    </div>
                                  </div>
                                  {!variant.useSameDescription && (
                                    <textarea
                                      placeholder="Variant-specific description"
                                      value={variant.description}
                                      onChange={(e) => handleVariantChange(variant.id, 'description', e.target.value)}
                                      disabled={loading}
                                      className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground min-h-16 text-sm"
                                    />
                                  )}
                                </div>

                                {/* Variant Banner Image */}
                                <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-medium text-green-700 dark:text-green-400">Banner Image</label>
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        isSelected={variant.useSameBannerImage}
                                        onValueChange={(value) => handleVariantChange(variant.id, 'useSameBannerImage', value)}
                                        color="primary"
                                        disabled={loading}
                                        size="sm"
                                      />
                                      <span className="text-xs text-green-600 dark:text-green-500">{variant.useSameBannerImage ? 'Using main' : 'Custom'}</span>
                                    </div>
                                  </div>
                                  {!variant.useSameBannerImage && (
                                    <div className="flex flex-col gap-2">
                                      {variant.bannerImage && (
                                        <div className="relative w-full h-24 rounded-lg overflow-hidden border border-default-300">
                                          <img
                                            src={URL.createObjectURL(variant.bannerImage)}
                                            alt={`Variant ${index + 1} banner`}
                                            className="w-full h-full object-cover"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => handleVariantChange(variant.id, 'bannerImage', null)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      )}
                                      <label className="w-full px-3 py-2 border-2 border-dashed border-default-300 rounded-lg cursor-pointer hover:border-primary-400 hover:bg-primary-50 flex items-center justify-center text-sm">
                                        <input
                                          type="file"
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleVariantChange(variant.id, 'bannerImage', file)
                                          }}
                                          disabled={loading}
                                        />
                                        Click to upload banner
                                      </label>
                                    </div>
                                  )}
                                </div>

                                {/* Variant Images */}
                                <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                                  <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-medium text-purple-700 dark:text-purple-400">Images</label>
                                    <div className="flex items-center gap-2">
                                      <Switch
                                        isSelected={variant.useSameImages}
                                        onValueChange={(value) => handleVariantChange(variant.id, 'useSameImages', value)}
                                        color="primary"
                                        disabled={loading}
                                        size="sm"
                                      />
                                      <span className="text-xs text-purple-600 dark:text-purple-500">{variant.useSameImages ? 'Using main' : 'Custom'}</span>
                                    </div>
                                  </div>
                                  {!variant.useSameImages && (
                                    <div className="flex flex-wrap gap-2">
                                      {variant.images.map((img, imgIdx) => (
                                        <div key={imgIdx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-default-300">
                                          <img
                                            src={URL.createObjectURL(img)}
                                            alt={`Variant ${index + 1} image ${imgIdx + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const newImages = variant.images.filter((_, i) => i !== imgIdx)
                                              setVariants(variants.map(v => v.id === variant.id ? { ...v, images: newImages } : v))
                                            }}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                      <label className="w-20 h-20 rounded-lg border-2 border-dashed border-default-300 flex items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50">
                                        <input
                                          type="file"
                                          multiple
                                          accept="image/*"
                                          className="hidden"
                                          onChange={(e) => {
                                            const newFiles = Array.from(e.target.files || [])
                                            const updatedImages = [...variant.images, ...newFiles]
                                            setVariants(variants.map(v => v.id === variant.id ? { ...v, images: updatedImages } : v))
                                          }}
                                          disabled={loading}
                                        />
                                        <span className="text-2xl">+</span>
                                      </label>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </CardBody>
                        </Card>
                      ))}
                    </CardBody>
                  </Card>

                  {/* Shared Banner Image and Images - Only for merged mode */}
                  {form.stockMergeType === 'merged' && (
                    <>
                      <div className="pt-4 border-t border-default-300">
                        <p className="text-sm font-medium text-foreground mb-4">Shared Product Images</p>
                        <ImageUpload
                          label="Banner Image (applies to all variants)"
                          value={null}
                          onChange={setBannerImage}
                          disabled={loading}
                          aspectRatio="landscape"
                        />
                      </div>

                      <MultipleImageUpload
                        label="Product Images (applies to all variants)"
                        value={productImages}
                        onChange={setProductImages}
                        disabled={loading}
                        maxImages={10}
                      />
                    </>
                  )}
                </>
              )}

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
