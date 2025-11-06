'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import { Button } from '@heroui/button'
import { apiEndpoints } from '@/lib/api-client'
import { AdminHeader } from '@/components/headers/admin-header'
import { useAdmin } from '@/context/admin-context'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'

interface Product {
  id: number
  name: string
  sku: string
  price: number
  stock: number
  isActive: boolean
}

export default function ProductsPage() {
  const router = useRouter()
  const { adminUser, clearAdmin } = useAdmin()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [storeLoaded, setStoreLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!storeLoaded) return

    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const data = await apiEndpoints.getAdminProducts(token || '');
        setProducts(data.products || [])
        setProducts(data.products || [])
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [router, clearAdmin, storeLoaded])

  return (
    <main className="min-h-screen bg-default-50">
      <AdminHeader userName={adminUser?.fullName} userEmail={adminUser?.email} />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Products</h1>
            <p className="text-default-500">Manage all products across all organizations</p>
          </div>
          <Button color="primary">+ Add Product</Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner label="Loading products..." />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardBody className="text-red-600 dark:text-red-400">{error}</CardBody>
          </Card>
        ) : products.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12 text-default-600">
              No products found
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-col gap-2">
              <p className="text-lg font-semibold">All Products ({products.length})</p>
            </CardHeader>
            <CardBody>
              <Table aria-label="Products table">
                <TableHeader>
                  <TableColumn>Product Name</TableColumn>
                  <TableColumn>SKU</TableColumn>
                  <TableColumn align="end">Price</TableColumn>
                  <TableColumn align="end">Stock</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn align="center">Action</TableColumn>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-default-600">{product.sku}</TableCell>
                      <TableCell className="text-right">₹{product.price}</TableCell>
                      <TableCell className="text-right font-semibold">{product.stock}</TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button size="sm" variant="light" color="primary">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        )}
      </div>
    </main>
  )
}
