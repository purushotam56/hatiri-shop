'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import { Button } from '@heroui/button'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import { Input } from '@heroui/input'
import { Switch } from '@heroui/switch'
import { Chip } from '@heroui/chip'
import { Select, SelectItem } from '@heroui/select'
import { apiEndpoints } from '@/lib/api-client'
import { AdminHeader } from '@/components/headers/admin-header'
import { useAdmin } from '@/context/admin-context'
import { CountryStateSelect } from '@/components/country-state-select'

interface Organisation {
  id: number
  name: string
  organisationUniqueCode: string
  currency: string
  status?: string
  trialEndDate?: string
}

interface OrganisationFormData {
  name: string
  organisationUniqueCode: string
  currency: string
  addressLine1: string
  addressLine2: string
  city: string
  stateCode: string
  postalCode: string
  countryCode: string
  whatsappNumber?: string
  whatsappEnabled?: boolean
  priceVisibility?: 'hidden' | 'login_only' | 'visible'
}

export default function OrganizationsPage() {
  const router = useRouter()
  const { adminUser, clearAdmin } = useAdmin()
  const [organisations, setOrganisations] = useState<Organisation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [storeLoaded, setStoreLoaded] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingOrgId, setEditingOrgId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [formData, setFormData] = useState<OrganisationFormData>({
    name: '',
    organisationUniqueCode: '',
    currency: 'INR',
    addressLine1: '',
    addressLine2: '',
    city: '',
    stateCode: '',
    postalCode: '',
    countryCode: '',
    whatsappNumber: '',
    whatsappEnabled: false,
    priceVisibility: 'visible',
  })

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
        const token = localStorage.getItem('adminToken');
        const data = await apiEndpoints.getAdminOrganisations(token || '');
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

  const handleCreateOrganisation = async () => {
    if (!formData.name || !formData.organisationUniqueCode) {
      setFormError('Name and organization code are required')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin')
        return
      }

      await apiEndpoints.createAdminOrganisation(formData, token)
      
      // Refresh the list
      const data = await apiEndpoints.getAdminOrganisations(token)
      setOrganisations(data.organisations || [])
      
      // Reset form and close modal
      setFormData({
        name: '',
        organisationUniqueCode: '',
        currency: 'INR',
        addressLine1: '',
        addressLine2: '',
        city: '',
        stateCode: '',
        postalCode: '',
        countryCode: '',
        whatsappNumber: '',
        whatsappEnabled: false,
        priceVisibility: 'visible',
      })
      setIsCreateModalOpen(false)
    } catch (err: any) {
      setFormError(err.message || 'Failed to create organization')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenEditModal = (org: any) => {
    setEditingOrgId(org.id)
    setFormData({
      name: org.name || '',
      organisationUniqueCode: org.organisationUniqueCode || '',
      currency: org.currency || 'INR',
      addressLine1: org.addressLine1 || '',
      addressLine2: org.addressLine2 || '',
      city: org.city || '',
      stateCode: org.stateCode || '',
      postalCode: org.postalCode || '',
      countryCode: org.countryCode || '',
      whatsappNumber: org.whatsappNumber || '',
      whatsappEnabled: org.whatsappEnabled || false,
      priceVisibility: org.priceVisibility || 'visible',
    })
    setFormError('')
    setIsEditModalOpen(true)
  }

  const handleUpdateOrganisation = async () => {
    if (!formData.name) {
      setFormError('Organization name is required')
      return
    }

    if (!editingOrgId) {
      setFormError('Organization ID not found')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin')
        return
      }

      await apiEndpoints.updateAdminOrganisation(editingOrgId, formData, token)
      
      // Refresh the list
      const data = await apiEndpoints.getAdminOrganisations(token)
      setOrganisations(data.organisations || [])
      
      // Close modal
      setIsEditModalOpen(false)
      setEditingOrgId(null)
    } catch (err: any) {
      setFormError(err.message || 'Failed to update organization')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleOrganisationStatus = async (id: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin')
        return
      }

      // Toggle status
      const currentOrg = organisations.find(o => o.id === id)
      const toggledStatus = newStatus === 'active' ? 'disabled' : 'active'
      
      await apiEndpoints.updateAdminOrganisation(id, { status: toggledStatus }, token)
      
      // Refresh the list
      const data = await apiEndpoints.getAdminOrganisations(token)
      setOrganisations(data.organisations || [])
    } catch (err: any) {
      setError(err.message || 'Failed to update organization status')
    }
  }

  const handleDeleteOrganisation = async (id: number) => {
    if (!confirm('Are you sure you want to delete this organization?')) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin')
        return
      }

      await apiEndpoints.deleteAdminOrganisation(id, token)
      
      // Refresh the list
      const data = await apiEndpoints.getAdminOrganisations(token)
      setOrganisations(data.organisations || [])
    } catch (err: any) {
      setError(err.message || 'Failed to delete organization')
    }
  }

  return (
    <main className="min-h-screen bg-default-50">
      <AdminHeader userName={adminUser?.fullName} userEmail={adminUser?.email} />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Organizations</h1>
            <p className="text-default-500">Manage all organizations in the system</p>
          </div>
          <Button color="primary" onPress={() => setIsCreateModalOpen(true)}>
            + Create Organization
          </Button>
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
              <Card key={org.id} className="hover:shadow-lg transition-shadow">
                <CardBody className="space-y-4 p-6">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-bold">{org.name}</h3>
                        <p className="text-sm text-default-500">Code: {org.organisationUniqueCode}</p>
                        <p className="text-sm text-default-500">Currency: {org.currency}</p>
                      </div>
                      <Chip
                        color={org.status === 'active' ? 'success' : org.status === 'trial' ? 'warning' : 'danger'}
                        variant="flat"
                        size="sm"
                      >
                        {org.status === 'active' ? '✓ Active' : org.status === 'trial' ? '⏱ Trial' : '✕ Disabled'}
                      </Chip>
                    </div>
                    {org.trialEndDate && org.status === 'trial' && (
                      <p className="text-xs text-default-500 mt-2">Trial ends: {new Date(org.trialEndDate).toLocaleDateString()}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-default-100 rounded-lg">
                      <span className="text-sm font-medium">Status</span>
                      <Switch
                        checked={org.status === 'active'}
                        onChange={(e) => handleToggleOrganisationStatus(org.id, org.status || 'trial')}
                        color="success"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="flat" color="primary" fullWidth
                      onPress={() => handleOpenEditModal(org)}
                    >
                      Edit
                    </Button>
                    <Button size="sm" variant="flat" color="danger" fullWidth
                      onPress={() => handleDeleteOrganisation(org.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Organization Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="2xl">
        <ModalContent>
          <ModalHeader>Edit Organization</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {formError && (
                <div className="p-3 bg-danger-50 text-danger rounded-lg text-sm">
                  {formError}
                </div>
              )}
              
              <Input
                label="Organization Name"
                placeholder="Enter organization name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                isRequired
              />
              
              <Input
                label="Currency"
                placeholder="Currency code"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              />
              
              <Input
                label="Address Line 1"
                placeholder="Enter address"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              />
              
              <Input
                label="Address Line 2"
                placeholder="Enter address line 2"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                
                <Input
                  label="Postal Code"
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>

              <CountryStateSelect
                selectedCountryCode={formData.countryCode}
                selectedStateCode={formData.stateCode}
                onCountryChange={(code) => setFormData({ ...formData, countryCode: code })}
                onStateChange={(code) => setFormData({ ...formData, stateCode: code })}
              />

              <Input
                label="WhatsApp Number"
                placeholder="Enter WhatsApp number"
                value={formData.whatsappNumber || ''}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
              />
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.whatsappEnabled || false}
                  onChange={(e) => setFormData({ ...formData, whatsappEnabled: e.target.checked })}
                />
                <span className="text-sm">Enable WhatsApp</span>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price Visibility</label>
                <select 
                  className="w-full p-2 border rounded-lg"
                  value={formData.priceVisibility || 'visible'}
                  onChange={(e) => setFormData({ ...formData, priceVisibility: e.target.value as any })}
                >
                  <option value="hidden">Hidden</option>
                  <option value="login_only">Login Only</option>
                  <option value="visible">Visible</option>
                </select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => setIsEditModalOpen(false)}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleUpdateOrganisation}
              isLoading={isSubmitting}
            >
              Update Organization
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Create Organization Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} size="2xl">
        <ModalContent>
          <ModalHeader>Create New Organization</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              {formError && (
                <div className="p-3 bg-danger-50 text-danger rounded-lg text-sm">
                  {formError}
                </div>
              )}
              
              <Input
                label="Organization Name"
                placeholder="Enter organization name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                isRequired
              />
              
              <Input
                label="Organization Code"
                placeholder="Enter unique code (e.g., org123)"
                value={formData.organisationUniqueCode}
                onChange={(e) => setFormData({ ...formData, organisationUniqueCode: e.target.value })}
                isRequired
              />
              
              <Input
                label="Currency"
                placeholder="Currency code"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              />
              
              <Input
                label="Address Line 1"
                placeholder="Enter address"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              />
              
              <Input
                label="Address Line 2"
                placeholder="Enter address line 2"
                value={formData.addressLine2}
                onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="City"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                
                <Input
                  label="Postal Code"
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                />
              </div>
              
              <CountryStateSelect
                selectedCountryCode={formData.countryCode}
                selectedStateCode={formData.stateCode}
                onCountryChange={(code) => setFormData({ ...formData, countryCode: code })}
                onStateChange={(code) => setFormData({ ...formData, stateCode: code })}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={() => setIsCreateModalOpen(false)}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleCreateOrganisation}
              isLoading={isSubmitting}
            >
              Create Organization
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </main>
  )
}
