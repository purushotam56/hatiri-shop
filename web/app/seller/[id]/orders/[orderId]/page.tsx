'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import Link from 'next/link'

interface OrderDetail {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  subtotal: number
  taxAmount: number
  deliveryAmount: number
  customerName: string
  customerPhone: string
  deliveryAddress: string
  notes: string
  createdAt: string
  items: Array<{
    id: string
    productName: string
    quantity: number
    price: number
    total: number
  }>
}

const statusColors: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  preparing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  ready: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  out_for_delivery: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

const statusFlow = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'out_for_delivery',
  'delivered',
]

export default function SellerOrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id
  const orderId = params.orderId
  
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('sellerToken')
    if (!token) {
      router.push('/seller')
      return
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `http://localhost:3333/api/seller/${orgId}/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

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
      } catch (err) {
        setError('Failed to load order details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orgId, orderId, router])

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return

    setUpdating(true)
    const token = localStorage.getItem('sellerToken')

    try {
      const response = await fetch(
        `http://localhost:3333/api/seller/${orgId}/orders/${orderId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to update status')
      }

      const data = await response.json()
      setOrder(data.order)
    } catch (err) {
      setError('Failed to update order status')
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('sellerToken')
    localStorage.removeItem('sellerUser')
    localStorage.removeItem('sellerOrg')
    router.push('/seller')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Loading order..." />
      </div>
    )
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-default-50 pb-20">
        <div className="sticky top-0 z-30 bg-white dark:bg-default-100 border-b border-default-200">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
            <Link href={`/seller/${orgId}/orders`}>
              <Button isIconOnly variant="light" size="sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <h1 className="text-xl font-bold">Order Details</h1>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200">
            <CardBody>
              <p className="text-red-600 dark:text-red-400 text-center">{error || 'Order not found'}</p>
            </CardBody>
          </Card>
        </div>
      </main>
    )
  }

  const currentStatusIndex = statusFlow.indexOf(order.status)

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-default-100 border-b border-default-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/seller/${orgId}/orders`}>
              <Button isIconOnly variant="light" size="sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">{order.orderNumber}</h1>
              <p className="text-xs text-default-600">
                {new Date(order.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
          <Button isIconOnly color="default" variant="light" onPress={handleLogout}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Status */}
        <Card>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Order Status</h2>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full ${
                  statusColors[order.status]
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-2">
              {statusFlow.map((status, index) => (
                <button
                  key={status}
                  onClick={() => {
                    if (index > currentStatusIndex && !updating) {
                      handleStatusUpdate(status)
                    }
                  }}
                  disabled={index <= currentStatusIndex || updating || order.status === 'cancelled'}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition ${
                    index <= currentStatusIndex
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : index === currentStatusIndex + 1
                      ? 'bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-50'
                      : 'bg-default-100 text-default-600 disabled:opacity-50'
                  }`}
                >
                  {status.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Customer Info */}
        <Card>
          <CardHeader className="font-semibold">Customer Information</CardHeader>
          <CardBody className="space-y-3">
            <div>
              <p className="text-xs text-default-600">Name</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-default-600">Phone</p>
              <p className="font-medium">{order.customerPhone}</p>
            </div>
            <div>
              <p className="text-xs text-default-600">Delivery Address</p>
              <p className="font-medium text-sm">{order.deliveryAddress}</p>
            </div>
            {order.notes && (
              <div>
                <p className="text-xs text-default-600">Notes</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader className="font-semibold">Order Items</CardHeader>
          <CardBody className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between pb-3 border-b border-default-200 last:pb-0 last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.productName}</p>
                  <p className="text-xs text-default-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-default-600">₹{item.price}</p>
                  <p className="font-semibold text-sm">₹{item.total.toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Bill Summary */}
        <Card>
          <CardHeader className="font-semibold">Bill Summary</CardHeader>
          <CardBody className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-default-600">Subtotal</span>
              <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-default-600">Tax</span>
              <span>₹{order.taxAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-default-600">Delivery</span>
              <span>₹{order.deliveryAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-default-200 font-semibold text-lg">
              <span>Total</span>
              <span className="text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
