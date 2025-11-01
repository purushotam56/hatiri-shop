'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import Link from 'next/link'

interface Customer {
  id: string
  email: string
  fullName: string
  mobile: string
  createdAt: string
}

export default function SellerCustomersPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id
  
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('sellerToken')
    if (!token) {
      router.push('/seller')
      return
    }

    const fetchCustomers = async () => {
      try {
        const url = new URL(`http://localhost:3333/api/seller/${orgId}/customers`)
        url.searchParams.append('page', page.toString())

        const response = await fetch(url.toString(), {
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
          throw new Error('Failed to fetch customers')
        }

        const data = await response.json()
        setCustomers(data.customers || [])
        setHasMore(data.hasMore || false)
      } catch (err) {
        setError('Failed to load customers')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [orgId, router, page])

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
              <h1 className="text-2xl font-bold text-foreground">Customers</h1>
              <p className="text-sm text-default-600">View your customers</p>
            </div>
          </div>
          <Button isIconOnly color="default" variant="light" onPress={handleLogout}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Customers List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner label="Loading customers..." />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200">
            <CardBody>
              <p className="text-red-600 dark:text-red-400 text-center">{error}</p>
            </CardBody>
          </Card>
        ) : customers.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              <p className="text-default-600">No customers yet</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customers.map((customer) => (
              <Link key={customer.id} href={`/seller/${orgId}/customers/${customer.id}`}>
                <Card className="hover:shadow-md transition cursor-pointer h-full">
                  <CardBody className="space-y-3">
                    <div>
                      <p className="font-semibold text-foreground">{customer.fullName}</p>
                      <p className="text-xs text-default-500">{customer.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-default-600">Phone</p>
                      <p className="text-sm font-medium">{customer.mobile || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-default-600">Member Since</p>
                      <p className="text-sm">
                        {new Date(customer.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      color="primary"
                      variant="flat"
                      className="w-full"
                    >
                      View Orders
                    </Button>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && customers.length > 0 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              isDisabled={page === 1}
              onClick={() => setPage(page - 1)}
              variant="bordered"
            >
              Previous
            </Button>
            <span className="text-sm text-default-600">Page {page}</span>
            <Button
              isDisabled={!hasMore}
              onClick={() => setPage(page + 1)}
              variant="bordered"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}
