'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { Input } from '@heroui/input'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal'
import { useSellerStore } from '@/context/seller-store-context'

interface Product {
  id: number
  name: string
  sku: string
  stock: number
  price: number
  isActive: boolean
  sold: number
}

export default function StockManagementPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id
  const { selectedStore } = useSellerStore()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [storeLoaded, setStoreLoaded] = useState(false)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [newStock, setNewStock] = useState('')
  const [updating, setUpdating] = useState(false)

  // First effect: wait for store to load from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Second effect: check auth and store selection
  useEffect(() => {
    if (!storeLoaded) return

    const token = localStorage.getItem('sellerToken')
    if (!token) {
      router.push('/seller')
      return
    }

    if (!selectedStore || (selectedStore?.id !== Number(orgId) && selectedStore?.id !== orgId)) {
      router.push('/seller/select-store')
      return
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:3333/api/seller/${orgId}/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('sellerToken')
            router.push('/seller')
            return
          }
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        setError('Failed to load products')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [orgId, router, selectedStore, storeLoaded])

  const handleEditStock = (product: Product) => {
    setSelectedProduct(product)
    setNewStock(product.stock.toString())
    onOpen()
  }

  const handleUpdateStock = async () => {
    if (!selectedProduct || !newStock) return

    setUpdating(true)
    try {
      const token = localStorage.getItem('sellerToken')
      const response = await fetch(`http://localhost:3333/api/products/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          stock: Number(newStock),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update stock')
      }

      // Update local state
      setProducts(
        products.map((p) =>
          p.id === selectedProduct.id ? { ...p, stock: Number(newStock) } : p
        )
      )

      onOpenChange()
    } catch (err) {
      console.error('Failed to update stock:', err)
      alert('Failed to update stock')
    } finally {
      setUpdating(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price)
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'danger', label: 'Out of Stock' }
    if (stock < 5) return { color: 'warning', label: 'Low Stock' }
    return { color: 'success', label: 'In Stock' }
  }

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
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
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Stock Management ({products.length})</p>
                <p className="text-sm text-default-500">Manage product inventory</p>
              </div>
            </CardHeader>
            <CardBody>
              <Table aria-label="Stock management table">
                <TableHeader>
                  <TableColumn>Product Name</TableColumn>
                  <TableColumn>SKU</TableColumn>
                  <TableColumn align="end">Price</TableColumn>
                  <TableColumn align="end">Stock</TableColumn>
                  <TableColumn align="end">Sold</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn align="center">Action</TableColumn>
                </TableHeader>
                <TableBody>
                  {products.map((product) => {
                    const stockStatus = getStockStatus(product.stock)
                    return (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-default-600">{product.sku}</TableCell>
                        <TableCell className="text-right">{formatPrice(product.price)}</TableCell>
                        <TableCell className="text-right font-semibold">{product.stock}</TableCell>
                        <TableCell className="text-right font-semibold text-green-600">{product.sold}</TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              stockStatus.color === 'danger'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                : stockStatus.color === 'warning'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            }`}
                          >
                            {stockStatus.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="light"
                            color="primary"
                            onPress={() => handleEditStock(product)}
                          >
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Stock Update Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Stock - {selectedProduct?.name}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-default-600 mb-1">Current Stock</p>
                    <p className="text-2xl font-bold">{selectedProduct?.stock}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600 mb-1">SKU</p>
                    <p className="text-sm">{selectedProduct?.sku}</p>
                  </div>
                  <Input
                    type="number"
                    label="New Stock Quantity"
                    placeholder="Enter new stock quantity"
                    value={newStock}
                    onValueChange={setNewStock}
                    min="0"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={handleUpdateStock}
                  isLoading={updating}
                  disabled={!newStock || updating}
                >
                  Update Stock
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  )
}
