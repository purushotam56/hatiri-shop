'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import Link from 'next/link'
import { apiEndpoints } from '@/lib/api-client'
import { useSellerStore } from '@/context/seller-store-context'

interface Order {
  id: number
  orderNumber: string
  status: string
  totalAmount: number
  customerName: string
  createdAt: string
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

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id
  const customerId = params.customerId
  const { selectedStore, clearStore } = useSellerStore()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('sellerToken');
        const data = await apiEndpoints.getSellerCustomerOrders(String(orgId), String(customerId), token || '');
        setOrders(data.orders || [])
      } catch (err) {
        setError('Failed to load orders')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [orgId, customerId, router, selectedStore, storeLoaded])

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
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardBody className="text-red-600 dark:text-red-400">{error}</CardBody>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12 text-default-600">
              No orders found for this customer
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-lg font-semibold">Orders ({orders.length})</p>
              </div>
            </CardHeader>
            <CardBody>
              <Table aria-label="Orders table">
                <TableHeader>
                  <TableColumn>Order Number</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn align="end">Amount</TableColumn>
                  <TableColumn>Date</TableColumn>
                  <TableColumn align="center">Action</TableColumn>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderNumber}</TableCell>
                      <TableCell>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || statusColors.pending}`}>
                          {order.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">₹ {Number(order.totalAmount).toFixed(2)}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="text-center">
                        <Link href={`/seller/${orgId}/orders/${order.id}`}>
                          <Button size="sm" variant="light" color="primary">
                            View
                          </Button>
                        </Link>
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
