'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import Link from 'next/link'
import { useSellerStore } from '@/context/seller-store-context'

interface DashboardStats {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
  averageOrderValue: number
  totalCustomers: number
}

interface RecentOrder {
  id: string
  orderNumber: string
  status: string
  totalAmount: number
  customerName: string
  createdAt: string
}

export default function SellerDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id
  const { selectedStore, clearStore } = useSellerStore()
  
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
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

    // Verify that the selected store matches the URL param
    if (!selectedStore || (selectedStore?.id !== Number(orgId) && selectedStore?.id !== orgId)) {
      // If store doesn't match, redirect to store selection
      router.push('/seller/select-store')
      return
    }

    const fetchDashboard = async () => {
      try {
        const response = await fetch(`http://localhost:3333/api/seller/${orgId}/dashboard`, {
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
          throw new Error('Failed to fetch dashboard')
        }

        const data = await response.json()
        setStats(data.stats)
        setRecentOrders(data.recentOrders || [])
      } catch (err) {
        setError('Failed to load dashboard')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [orgId, router, selectedStore, storeLoaded])

  const handleLogout = () => {
    localStorage.removeItem('sellerToken')
    localStorage.removeItem('sellerUser')
    clearStore()
    router.push('/seller')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Loading dashboard..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardBody className="text-center space-y-4">
            <p className="text-red-600">{error}</p>
            <Button onPress={handleLogout} color="primary">
              Back to Login
            </Button>
          </CardBody>
        </Card>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200 dark:border-blue-900/30">
            <CardBody className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-default-600 text-sm font-medium">Total Orders</p>
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V4a1 1 0 011-1zm0 6h18a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1v-8a1 1 0 011-1zm0 10h18a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 011-1z"/>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-blue-600">{stats?.totalOrders || 0}</p>
              <p className="text-xs text-default-500">{stats?.pendingOrders || 0} pending</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200 dark:border-green-900/30">
            <CardBody className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-default-600 text-sm font-medium">Completed Orders</p>
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600">{stats?.completedOrders || 0}</p>
              <p className="text-xs text-default-500">Successfully delivered</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200 dark:border-purple-900/30">
            <CardBody className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-default-600 text-sm font-medium">Total Revenue</p>
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-600">
                ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-default-500">Avg: ₹{(stats?.averageOrderValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </CardBody>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-200 dark:border-orange-900/30">
            <CardBody className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-default-600 text-sm font-medium">Total Customers</p>
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-orange-600">{stats?.totalCustomers || 0}</p>
              <p className="text-xs text-default-500">Unique customers</p>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href={`/seller/${orgId}/products`}>
            <Button
              fullWidth
              size="lg"
              variant="bordered"
              className="h-28 flex flex-col items-center justify-center bg-gradient-to-br from-transparent to-blue-500/5 hover:from-blue-500/10 hover:to-blue-500/10 border-blue-200 dark:border-blue-900/30 transition"
            >
              <svg className="w-8 h-8 mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8-4m-8 4v10l8-4M9 5l8 4" />
              </svg>
              <span className="text-xs text-center font-medium">Products</span>
            </Button>
          </Link>

          <Link href={`/seller/${orgId}/orders`}>
            <Button
              fullWidth
              size="lg"
              variant="bordered"
              className="h-28 flex flex-col items-center justify-center bg-gradient-to-br from-transparent to-green-500/5 hover:from-green-500/10 hover:to-green-500/10 border-green-200 dark:border-green-900/30 transition"
            >
              <svg className="w-8 h-8 mb-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs text-center font-medium">Orders</span>
            </Button>
          </Link>

          <Link href={`/seller/${orgId}/customers`}>
            <Button
              fullWidth
              size="lg"
              variant="bordered"
              className="h-28 flex flex-col items-center justify-center bg-gradient-to-br from-transparent to-purple-500/5 hover:from-purple-500/10 hover:to-purple-500/10 border-purple-200 dark:border-purple-900/30 transition"
            >
              <svg className="w-8 h-8 mb-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.673" />
              </svg>
              <span className="text-xs text-center font-medium">Customers</span>
            </Button>
          </Link>

          <Link href={`/seller/${orgId}/settings`}>
            <Button
              fullWidth
              size="lg"
              variant="bordered"
              className="h-28 flex flex-col items-center justify-center bg-gradient-to-br from-transparent to-orange-500/5 hover:from-orange-500/10 hover:to-orange-500/10 border-orange-200 dark:border-orange-900/30 transition"
            >
              <svg className="w-8 h-8 mb-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-center font-medium">Settings</span>
            </Button>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex items-center justify-between bg-gradient-to-r from-blue-500/5 to-transparent pb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href={`/seller/${orgId}/orders`}>
              <Button size="sm" variant="light" color="primary">
                View All →
              </Button>
            </Link>
          </CardHeader>
          <CardBody>
            {recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 mx-auto text-default-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-default-600">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <Link key={order.id} href={`/seller/${orgId}/orders/${order.id}`}>
                    <div className="flex items-center justify-between p-4 bg-default-50 rounded-lg hover:bg-default-100 transition cursor-pointer border border-transparent hover:border-blue-200">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm truncate">{order.orderNumber}</p>
                            <p className="text-xs text-default-600 truncate">{order.customerName}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1 ml-4 flex-shrink-0">
                        <div>
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : order.status === 'cancelled'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : order.status === 'pending'
                                ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-sm font-bold text-foreground">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
