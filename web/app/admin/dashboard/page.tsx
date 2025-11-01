'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import { Button } from '@heroui/button'
import { AdminHeader } from '@/components/headers/admin-header'
import { useAdmin } from '@/context/admin-context'
import Link from 'next/link'

interface DashboardStats {
  totalOrganizations: number
  totalSellers: number
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  deliveredOrders: number
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const { adminUser, clearAdmin } = useAdmin()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [storeLoaded, setStoreLoaded] = useState(false)

  // First effect: wait for context to load from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Second effect: check auth and load stats
  useEffect(() => {
    if (!storeLoaded) return

    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    const fetchStats = async () => {
      try {
        // Fetch real stats from dedicated endpoint
        const statsResponse = await fetch('http://localhost:3333/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!statsResponse.ok) {
          if (statsResponse.status === 401) {
            clearAdmin()
            router.push('/admin')
            return
          }
          throw new Error('Failed to fetch stats')
        }

        const statsData = await statsResponse.json()
        setStats(statsData.stats)
      } catch (err) {
        setError('Failed to load dashboard')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [router, clearAdmin, storeLoaded])

  return (
    <main className="min-h-screen bg-default-50">
      <AdminHeader userName={adminUser?.fullName} userEmail={adminUser?.email} />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner label="Loading dashboard..." />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardBody className="text-red-600 dark:text-red-400">{error}</CardBody>
          </Card>
        ) : stats ? (
          <>
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-default-500">System overview and management</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Organizations Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800">
                <CardBody className="space-y-2 p-6">
                  <p className="text-sm text-default-600">Total Organizations</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-blue-600">{stats.totalOrganizations}</p>
                    <p className="text-sm text-blue-500">active</p>
                  </div>
                </CardBody>
              </Card>

              {/* Sellers Card */}
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border border-green-200 dark:border-green-800">
                <CardBody className="space-y-2 p-6">
                  <p className="text-sm text-default-600">Total Sellers</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-green-600">{stats.totalSellers}</p>
                    <p className="text-sm text-green-500">across orgs</p>
                  </div>
                </CardBody>
              </Card>

              {/* Orders Card */}
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800">
                <CardBody className="space-y-2 p-6">
                  <p className="text-sm text-default-600">Total Orders</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-purple-600">{stats.totalOrders}</p>
                    <p className="text-sm text-purple-500">all time</p>
                  </div>
                </CardBody>
              </Card>

              {/* Revenue Card */}
              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/30 dark:to-yellow-900/30 border border-yellow-200 dark:border-yellow-800">
                <CardBody className="space-y-2 p-6">
                  <p className="text-sm text-default-600">Total Revenue</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-yellow-600">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                    <p className="text-sm text-yellow-500">earned</p>
                  </div>
                </CardBody>
              </Card>

              {/* Pending Orders Card */}
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border border-orange-200 dark:border-orange-800">
                <CardBody className="space-y-2 p-6">
                  <p className="text-sm text-default-600">Pending Orders</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-orange-600">{stats.pendingOrders}</p>
                    <p className="text-sm text-orange-500">processing</p>
                  </div>
                </CardBody>
              </Card>

              {/* Delivered Orders Card */}
              <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                <CardBody className="space-y-2 p-6">
                  <p className="text-sm text-default-600">Delivered Orders</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-4xl font-bold text-emerald-600">{stats.deliveredOrders}</p>
                    <p className="text-sm text-emerald-500">completed</p>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="flex flex-col gap-2">
                <p className="text-lg font-semibold">Quick Actions</p>
                <p className="text-sm text-default-500">Common management tasks</p>
              </CardHeader>
              <CardBody className="space-y-3">
                <a
                  href="/admin/organizations"
                  className="block p-4 border border-divider rounded-lg hover:bg-default-100 transition-colors"
                >
                  <p className="font-semibold text-blue-600">📦 Manage Organizations</p>
                  <p className="text-sm text-default-500">Create, edit, or view all organizations</p>
                </a>
                <a
                  href="/admin/sellers"
                  className="block p-4 border border-divider rounded-lg hover:bg-default-100 transition-colors"
                >
                  <p className="font-semibold text-green-600">👥 Manage Sellers</p>
                  <p className="text-sm text-default-500">View and manage seller accounts</p>
                </a>
                <a
                  href="/admin/orders"
                  className="block p-4 border border-divider rounded-lg hover:bg-default-100 transition-colors"
                >
                  <p className="font-semibold text-purple-600">📋 View Orders</p>
                  <p className="text-sm text-default-500">Global order management and tracking</p>
                </a>
              </CardBody>
            </Card>
          </>
        ) : null}
      </div>
    </main>
  )
}

