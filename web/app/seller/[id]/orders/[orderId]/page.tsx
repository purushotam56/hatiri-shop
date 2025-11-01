'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import { Select, SelectItem } from '@heroui/select'
import Link from 'next/link'
import { useSellerStore } from '@/context/seller-store-context'

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  currency: string
}

interface Order {
  id: number
  orderNumber: string
  status: string
  totalAmount: number
  taxAmount: number
  deliveryAmount: number
  subtotal: number
  customerName: string
  customerPhone: string
  deliveryAddress: string
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

const statusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  preparing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  ready: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  out_for_delivery: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = Array.isArray(params.id) ? params.id[0] : params.id
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId
  const { selectedStore, clearStore } = useSellerStore()
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [storeLoaded, setStoreLoaded] = useState(false)

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

    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:3333/api/seller/${orgId}/orders/${orderId}`, {
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
          throw new Error('Failed to fetch order')
        }

        const data = await response.json()
        setOrder(data.order)
        setSelectedStatus(data.order.status)
      } catch (err) {
        setError('Failed to load order')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orgId, orderId, router, selectedStore, storeLoaded])

  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.status) return

    setUpdating(true)
    try {
      const token = localStorage.getItem('sellerToken')
      if (!token) {
        setError('Authentication token not found')
        setUpdating(false)
        return
      }

      const url = `http://localhost:3333/api/seller/${orgId}/orders/${orderId}/status`
      console.log('Updating order status at:', url)
      
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Failed to update status: ${response.status}`)
      }

      const data = await response.json()
      setOrder(data.order)
      setError('')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update order status'
      setError(errorMsg)
      console.error('Status update error:', err)
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('sellerToken')
    localStorage.removeItem('sellerUser')
    clearStore()
    router.push('/seller')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardBody className="text-red-600 dark:text-red-400">{error}</CardBody>
          </Card>
        ) : order ? (
          <>
            {/* Order Header */}
            <Card>
              <CardHeader className="flex justify-between items-start">
                <div>
                  <p className="text-xl font-bold">{order.orderNumber}</p>
                  <p className="text-sm text-default-500">{formatDate(order.createdAt)}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[order.status] || statusColors.pending}`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </CardHeader>
            </Card>

            {/* Customer Info */}
            <Card>
              <CardHeader className="flex flex-col gap-2">
                <p className="text-lg font-semibold">Customer Information</p>
              </CardHeader>
              <CardBody className="gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-default-600">Name</p>
                    <p className="font-medium">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600">Phone</p>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-default-600">Delivery Address</p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="flex flex-col gap-2">
                <p className="text-lg font-semibold">Order Items</p>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-default-100 dark:bg-default-100/50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-default-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹ {(Number(item.price) * Number(item.quantity)).toFixed(2)}</p>
                        <p className="text-xs text-default-600">₹ {Number(item.price).toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader className="flex flex-col gap-2">
                <p className="text-lg font-semibold">Order Summary</p>
              </CardHeader>
              <CardBody className="gap-3">
                <div className="flex justify-between">
                  <span className="text-default-600">Subtotal</span>
                  <span className="font-medium">₹ {Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Tax</span>
                  <span className="font-medium">₹ {Number(order.taxAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-default-600">Delivery</span>
                  <span className="font-medium">₹ {Number(order.deliveryAmount).toFixed(2)}</span>
                </div>
                <div className="border-t border-default-200 pt-3 flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold text-lg">₹ {Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </CardBody>
            </Card>

            {/* Status Update */}
            <Card>
              <CardHeader className="flex flex-col gap-2">
                <p className="text-lg font-semibold">Update Status</p>
              </CardHeader>
              <CardBody className="gap-4">
                <Select
                  label="Select Status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
                <Button
                  color="primary"
                  onPress={handleStatusUpdate}
                  isLoading={updating}
                  isDisabled={selectedStatus === order.status || updating}
                >
                  Update Status
                </Button>
              </CardBody>
            </Card>
          </>
        ) : null}
      </div>
    </main>
  )
}