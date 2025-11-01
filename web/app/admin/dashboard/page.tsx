'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader, CardFooter } from '@heroui/card'
import { Input } from '@heroui/input'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal'
import { Tabs, Tab } from '@heroui/tabs'
import Link from 'next/link'
import { AdminLayout } from '@/components/layouts/admin-layout'

interface Organisation {
  id: number
  name: string
  code: string
  currency: string
  _count?: { branch: number }
}

export default function AdminDashboard() {
  const router = useRouter()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [organisations, setOrganisations] = useState<Organisation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    organisationUniqueCode: '',
    currency: 'INR',
    addressLine1: '',
    blockBuildingNo: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const user = localStorage.getItem('adminUser')

    if (!token || !user) {
      router.push('/admin')
      return
    }

    setCurrentUser(JSON.parse(user))
    fetchOrganisations(token)
  }, [router])

  const fetchOrganisations = async (token: string) => {
    try {
      const response = await fetch('http://localhost:3333/api/admin/organisations', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      setOrganisations(data.organisations || [])
    } catch (err) {
      setError('Failed to load organizations')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateOrg = async () => {
    setSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('http://localhost:3333/api/admin/organisations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Failed to create organization')
        return
      }

      // Add new org to list
      setOrganisations([...organisations, data.organisation])

      // Reset form
      setFormData({
        name: '',
        organisationUniqueCode: '',
        currency: 'INR',
        addressLine1: '',
        blockBuildingNo: '',
      })

      onOpenChange()
    } catch (err) {
      setError('Connection error')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin')
  }

  return (
    <AdminLayout>
      <main className="min-h-screen bg-default-50 dark:bg-default-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-default-600">Welcome, {currentUser?.fullName}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardBody className="py-6">
                <p className="text-default-600 text-sm">Total Organizations</p>
                <p className="text-4xl font-bold text-primary">{organisations.length}</p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="py-6">
                <p className="text-default-600 text-sm">Total Branches</p>
                <p className="text-4xl font-bold text-primary">
                  {organisations.reduce((sum, org) => sum + (org._count?.branch || 0), 0)}
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardBody className="py-6">
                <p className="text-default-600 text-sm">Active Sellers</p>
                <p className="text-4xl font-bold text-primary">-</p>
            </CardBody>
          </Card>
        </div>

        {/* Organizations Section */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Organizations</h2>
            <Button color="primary" onPress={onOpen}>
              + Create Organization
            </Button>
          </CardHeader>
          <CardBody>
            {loading ? (
              <p className="text-default-600">Loading...</p>
            ) : error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">{error}</div>
            ) : organisations.length === 0 ? (
              <p className="text-default-600">No organizations yet. Create one to get started!</p>
            ) : (
              <div className="space-y-3">
                {organisations.map((org) => (
                  <div key={org.id} className="p-4 bg-default-100 dark:bg-default-200 rounded-lg flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{org.name}</h3>
                      <p className="text-sm text-default-600">Code: {org.code}</p>
                      <p className="text-sm text-default-600">{org._count?.branch || 0} branches</p>
                    </div>
                    <Link href={`/admin/organisations/${org.id}`}>
                      <Button variant="flat" size="sm">
                        Manage →
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Create Organization Modal */}
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader>Create New Organization</ModalHeader>
                <ModalBody>
                  <Input
                    label="Organization Name"
                    placeholder="e.g., Fresh Mart Downtown"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Unique Code"
                    placeholder="e.g., freshmart-dl"
                    value={formData.organisationUniqueCode}
                    onChange={(e) => setFormData({ ...formData, organisationUniqueCode: e.target.value })}
                  />
                  <Input
                    label="Address"
                    placeholder="Street address"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  />
                  <Input
                    label="Building/Block"
                    placeholder="Building number"
                    value={formData.blockBuildingNo}
                    onChange={(e) => setFormData({ ...formData, blockBuildingNo: e.target.value })}
                  />
                  {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 text-sm rounded-lg">{error}</div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onOpenChange}>
                    Cancel
                  </Button>
                  <Button color="primary" isLoading={submitting} onPress={handleCreateOrg}>
                    Create
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </main>
    </AdminLayout>
  )
}

