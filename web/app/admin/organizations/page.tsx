'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import { Button } from '@heroui/button'
import { AdminHeader } from '@/components/headers/admin-header'
import { useAdmin } from '@/context/admin-context'

interface Organisation {
  id: number
  name: string
  organisationUniqueCode: string
  currency: string
}

export default function OrganizationsPage() {
  const router = useRouter()
  const { adminUser, clearAdmin } = useAdmin()
  const [organisations, setOrganisations] = useState<Organisation[]>([])
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

    const fetchOrgs = async () => {
      try {
        const response = await fetch('http://localhost:3333/api/admin/organisations', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!response.ok) {
          if (response.status === 401) {
            clearAdmin()
            router.push('/admin')
            return
          }
          throw new Error('Failed to fetch organizations')
        }

        const data = await response.json()
        setOrganisations(data.organisations || [])
      } catch (err) {
        setError('Failed to load organizations')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrgs()
  }, [router, clearAdmin, storeLoaded])

  return (
    <main className="min-h-screen bg-default-50">
      <AdminHeader userName={adminUser?.fullName} userEmail={adminUser?.email} />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Organizations</h1>
            <p className="text-default-500">Manage all organizations in the system</p>
          </div>
          <Button color="primary">+ Create Organization</Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner label="Loading organizations..." />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardBody className="text-red-600 dark:text-red-400">{error}</CardBody>
          </Card>
        ) : organisations.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12 text-default-600">
              No organizations found. Create one to get started!
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organisations.map((org) => (
              <Card key={org.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="space-y-4 p-6">
                  <div>
                    <h3 className="text-lg font-bold">{org.name}</h3>
                    <p className="text-sm text-default-500">Code: {org.organisationUniqueCode}</p>
                    <p className="text-sm text-default-500">Currency: {org.currency}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="flat" color="primary">
                      Edit
                    </Button>
                    <Button size="sm" variant="flat" color="danger">
                      Delete
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
