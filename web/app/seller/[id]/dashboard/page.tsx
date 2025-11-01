'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import Link from 'next/link'

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
  
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('sellerToken')
    if (!token) {
      router.push('/seller')
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
  }, [orgId, router])

  const handleLogout = () => {
    localStorage.removeItem('sellerToken')
    localStorage.removeItem('sellerUser')
    localStorage.removeItem('sellerOrg')
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
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-default-100 border-b border-default-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Seller Dashboard</h1>
            <p className="text-sm text-default-600">Manage your store</p>
          </div>
          <Button isIconOnly color="default" variant="light" onPress={handleLogout}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardBody className="space-y-2">
              <p className="text-default-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-primary">{stats?.totalOrders || 0}</p>
              <p className="text-xs text-default-500">{stats?.pendingOrders || 0} pending</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <p className="text-default-600 text-sm">Completed Orders</p>
              <p className="text-3xl font-bold text-success">{stats?.completedOrders || 0}</p>
              <p className="text-xs text-default-500">This month</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <p className="text-default-600 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-primary">
                ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN', {
                  maximumFractionDigits: 0,
                })}
              </p>
              <p className="text-xs text-default-500">Average: ₹{(stats?.averageOrderValue || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="space-y-2">
              <p className="text-default-600 text-sm">Total Customers</p>
              <p className="text-3xl font-bold text-warning">{stats?.totalCustomers || 0}</p>
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
              className="h-24 flex flex-col items-center justify-center"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8-4m-8 4v10l8-4M9 5l8 4" />
              </svg>
              <span className="text-xs text-center">Products</span>
            </Button>
          </Link>

          <Link href={`/seller/${orgId}/orders`}>
            <Button
              fullWidth
              size="lg"
              variant="bordered"
              className="h-24 flex flex-col items-center justify-center"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-xs text-center">Orders</span>
            </Button>
          </Link>

          <Link href={`/seller/${orgId}/customers`}>
            <Button
              fullWidth
              size="lg"
              variant="bordered"
              className="h-24 flex flex-col items-center justify-center"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.673" />
              </svg>
              <span className="text-xs text-center">Customers</span>
            </Button>
          </Link>

          <Link href={`/seller/${orgId}/settings`}>
            <Button
              fullWidth
              size="lg"
              variant="bordered"
              className="h-24 flex flex-col items-center justify-center"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs text-center">Settings</span>
            </Button>
          </Link>
        </div>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link href={`/seller/${orgId}/orders`}>
              <Button size="sm" variant="light" color="primary">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardBody>
            {recentOrders.length === 0 ? (
              <p className="text-default-600 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-default-50 rounded-lg hover:bg-default-100 transition"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-default-600">{order.customerName}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : order.status === 'cancelled'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm font-semibold">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </main>
  )
}
