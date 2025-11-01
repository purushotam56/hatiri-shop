'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  isActive: boolean
  createdAt: string
}

export default function SellerProductsPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('sellerToken')
    if (!token) {
      router.push('/seller')
      return
    }

    // Note: We'll integrate actual product fetch once ProductController is set up
    // For now, show placeholder message
    setLoading(false)
  }, [router])

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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/seller/${orgId}/dashboard`}>
              <Button isIconOnly variant="light" size="sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Products</h1>
              <p className="text-sm text-default-600">Manage your products</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/seller/${orgId}/products/create`}>
              <Button color="primary" size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Product
              </Button>
            </Link>
            <Button isIconOnly color="default" variant="light" onPress={handleLogout}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner label="Loading products..." />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200">
            <CardBody>
              <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            </CardBody>
          </Card>
        ) : products.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center space-y-4">
              <div>
                <svg className="w-16 h-16 mx-auto text-default-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10" />
                </svg>
                <p className="text-default-600 text-lg">No products yet</p>
                <p className="text-default-500 text-sm">Create your first product to get started</p>
              </div>
              <Link href={`/seller/${orgId}/products/create`}>
                <Button color="primary" size="lg">
                  Create First Product
                </Button>
              </Link>
            </CardBody>
          </Card>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-default-200">
                  <th className="text-left p-3 font-semibold">Product Name</th>
                  <th className="text-left p-3 font-semibold">SKU</th>
                  <th className="text-right p-3 font-semibold">Price</th>
                  <th className="text-right p-3 font-semibold">Stock</th>
                  <th className="text-center p-3 font-semibold">Status</th>
                  <th className="text-center p-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-default-100 hover:bg-default-50">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3 text-default-600">{product.sku}</td>
                    <td className="p-3 text-right font-medium">₹{product.price?.toLocaleString('en-IN')}</td>
                    <td className="p-3 text-right">{product.stock}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          product.isActive
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <Link href={`/seller/${orgId}/products/${product.id}/edit`}>
                        <Button isIconOnly size="sm" variant="light" color="primary">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
