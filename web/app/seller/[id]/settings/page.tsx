'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@heroui/button'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Input } from '@heroui/input'
import { Switch } from '@heroui/switch'
import { Chip } from '@heroui/chip'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal'
import Link from 'next/link'
import { apiEndpoints, apiUpload } from '@/lib/api-client'
import { useSellerStore } from '@/context/seller-store-context'
import { QRCodeGenerator } from '@/components/qr-code-generator'

export default function SellerSettingsPage() {
  const router = useRouter()
  const params = useParams()
  const orgId = params.id as string | number
  const { selectedStore, clearStore } = useSellerStore()
  const [storeLoaded, setStoreLoaded] = useState(false)
  
  // Organisation data state
  const [organisation, setOrganisation] = useState<any>(null)
  const [loadingOrg, setLoadingOrg] = useState(false)
  
  // WhatsApp settings state
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [whatsappEnabled, setWhatsappEnabled] = useState(false)
  const [whatsappSaving, setWhatsappSaving] = useState(false)
  const [whatsappError, setWhatsappError] = useState('')
  const [whatsappSuccess, setWhatsappSuccess] = useState('')
  
  // QR Code color state
  const [qrDarkColor, setQrDarkColor] = useState('#000000')
  const [qrLightColor, setQrLightColor] = useState('#FFFFFF')
  
  // Profile edit state
  const [editProfileOpen, setEditProfileOpen] = useState(false)
  const [sellerUser, setSellerUser] = useState<any>(null)
  const [profileFormData, setProfileFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState('')
  
  // Store settings state
  const [editStoreOpen, setEditStoreOpen] = useState(false)
  const [storeFormData, setStoreFormData] = useState({
    name: '',
    logoFile: null as File | null,
    logoPreview: '',
  })
  const [storeSaving, setStoreSaving] = useState(false)
  const [storeError, setStoreError] = useState('')
  const [storeSuccess, setStoreSuccess] = useState('')

  // First effect: wait for store to load from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreLoaded(true)
      
      // Load seller user data
      const userDataStr = localStorage.getItem('sellerUser')
      if (userDataStr) {
        try {
          const userData = JSON.parse(userDataStr)
          setSellerUser(userData)
          setProfileFormData({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
          })
        } catch (error) {
          console.error('Failed to parse seller user data:', error)
        }
      }
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

    // Verify store match
    if (!selectedStore || (selectedStore?.id !== Number(orgId) && selectedStore?.id !== orgId)) {
      router.push('/seller/select-store')
    }
  }, [router, orgId, selectedStore, storeLoaded])

  // Third effect: fetch organisation data using getSellerDashboard
  useEffect(() => {
    if (!storeLoaded || !selectedStore) return

    const token = localStorage.getItem('sellerToken')
    if (!token) return

    const fetchOrganisation = async () => {
      try {
        setLoadingOrg(true)
        console.log('Fetching seller dashboard with org ID:', orgId)
        const dashboardData = await apiEndpoints.getSellerDashboard(String(orgId), token)
        console.log('Dashboard data received:', dashboardData)
        
        // Extract organisation data from dashboard or use fallback
        const org = dashboardData.organisation || {
          id: selectedStore.id,
          name: selectedStore.name,
          organisationUniqueCode: selectedStore.code,
        }
        
        console.log('Processed organisation:', org)
        setOrganisation(org)
        
        // Set WhatsApp values if they exist
        if (org?.whatsappNumber) {
          setWhatsappNumber(org.whatsappNumber)
        }
        if (org?.whatsappEnabled !== undefined) {
          setWhatsappEnabled(org.whatsappEnabled)
        }
      } catch (error) {
        console.error('Failed to fetch organisation data:', error)
        // Fallback to using selectedStore data
        setOrganisation({
          id: selectedStore.id,
          name: selectedStore.name,
          organisationUniqueCode: selectedStore.code,
        })
      } finally {
        setLoadingOrg(false)
      }
    }

    fetchOrganisation()
  }, [storeLoaded, selectedStore, orgId])

  const handleLogout = () => {
    localStorage.removeItem('sellerToken')
    localStorage.removeItem('sellerUser')
    clearStore()
    router.push('/seller')
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileError('')
    setProfileSuccess('')

    try {
      // Validate form data
      if (!profileFormData.firstName || !profileFormData.lastName || !profileFormData.email) {
        setProfileError('All fields are required')
        setProfileSaving(false)
        return
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(profileFormData.email)) {
        setProfileError('Please enter a valid email address')
        setProfileSaving(false)
        return
      }

      // Update localStorage with new data
      const updatedUser = {
        ...sellerUser,
        firstName: profileFormData.firstName,
        lastName: profileFormData.lastName,
        email: profileFormData.email,
      }

      localStorage.setItem('sellerUser', JSON.stringify(updatedUser))
      setSellerUser(updatedUser)
      
      setProfileSuccess('Profile updated successfully!')
      setEditProfileOpen(false)
      setTimeout(() => setProfileSuccess(''), 3000)
    } catch (err: any) {
      setProfileError(err.message || 'Failed to save profile')
      console.error(err)
    } finally {
      setProfileSaving(false)
    }
  }

  const handleEditProfileOpen = () => {
    setProfileFormData({
      firstName: sellerUser?.firstName || '',
      lastName: sellerUser?.lastName || '',
      email: sellerUser?.email || '',
    })
    setEditProfileOpen(true)
  }

  const handleEditStoreOpen = () => {
    setStoreFormData({
      name: organisation?.name || '',
      logoFile: null,
      logoPreview: organisation?.image?.url || organisation?.image || '',
    })
    setStoreError('')
    setStoreSuccess('')
    setEditStoreOpen(true)
  }

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setStoreError('Please select an image file')
        return
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setStoreError('Image size must be less than 5MB')
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        setStoreFormData({
          ...storeFormData,
          logoFile: file,
          logoPreview: event.target?.result as string,
        })
        setStoreError('')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault()
    setStoreSaving(true)
    setStoreError('')
    setStoreSuccess('')

    try {
      const token = localStorage.getItem('sellerToken')
      if (!token) {
        router.push('/seller')
        return
      }

      // Validate store name
      if (!storeFormData.name || !storeFormData.name.trim()) {
        setStoreError('Store name is required')
        setStoreSaving(false)
        return
      }

      // Create FormData to send store name and logo file
      const formData = new FormData()
      formData.append('name', storeFormData.name)

      // Add logo file if a new one was selected
      if (storeFormData.logoFile) {
        formData.append('logo', storeFormData.logoFile)
      }

      // Call API to update store settings using multipart form
      const url = `/seller/${orgId}/store`
      const response = await apiUpload(url, formData, token, 'PUT')

      if (response.error) {
        setStoreError(response.message || 'Failed to save store settings')
        return
      }

      // Update local organisation state
      const updatedOrg = {
        ...organisation,
        name: storeFormData.name,
        image: response.store?.image || organisation?.image,
      }
      setOrganisation(updatedOrg)

      // Also update the store form data preview with the new logo URL
      if (response.store?.image) {
        const logoUrl = typeof response.store.image === 'string' 
          ? response.store.image 
          : response.store.image.url
        setStoreFormData({
          name: storeFormData.name,
          logoFile: null,
          logoPreview: logoUrl,
        })
      }

      setStoreSuccess('Store settings updated successfully!')
      setEditStoreOpen(false)
      setTimeout(() => setStoreSuccess(''), 3000)
    } catch (err: any) {
      setStoreError(err.message || 'Failed to save store settings')
      console.error(err)
    } finally {
      setStoreSaving(false)
    }
  }

  const handleSaveWhatsApp = async (e: React.FormEvent) => {
    e.preventDefault()
    setWhatsappSaving(true)
    setWhatsappError('')
    setWhatsappSuccess('')

    try {
      const token = localStorage.getItem('sellerToken')
      if (!token) {
        router.push('/seller')
        return
      }

      // Validate WhatsApp number format
      if (whatsappEnabled && !whatsappNumber) {
        setWhatsappError('WhatsApp number is required when enabled')
        setWhatsappSaving(false)
        return
      }

      // Validate phone number format (basic international format)
      if (whatsappNumber && !/^\+?[1-9]\d{1,14}$/.test(whatsappNumber.replace(/[^\d+]/g, ''))) {
        setWhatsappError('Please enter a valid WhatsApp number (e.g., +1234567890)')
        setWhatsappSaving(false)
        return
      }

      // Call API to update settings
      await apiEndpoints.updateSellerStore(orgId, {
        whatsappNumber: whatsappNumber || '',
        whatsappEnabled: whatsappEnabled,
      }, token)

      setWhatsappSuccess('WhatsApp settings updated successfully!')
      setTimeout(() => setWhatsappSuccess(''), 3000)
    } catch (err: any) {
      setWhatsappError(err.message || 'Failed to save WhatsApp settings')
      console.error(err)
    } finally {
      setWhatsappSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader className="font-semibold">Profile</CardHeader>
          <CardBody className="space-y-4">
            {sellerUser && (
              <div className="space-y-3 mb-2">
                <div>
                  <p className="text-sm text-default-500">Name</p>
                  <p className="font-medium">{sellerUser.firstName} {sellerUser.lastName}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Email</p>
                  <p className="font-medium">{sellerUser.email}</p>
                </div>
              </div>
            )}
            <Button
              variant="flat"
              className="w-full justify-start"
              onPress={handleEditProfileOpen}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Edit Profile
            </Button>
            <Button
              variant="flat"
              className="w-full justify-start"
              onPress={() => {}}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Change Password
            </Button>
          </CardBody>
        </Card>

        {/* Store Section */}
        <Card>
          <CardHeader className="font-semibold">Store</CardHeader>
          <CardBody className="space-y-4">
            {organisation && (
              <div className="space-y-3 mb-2 p-3 bg-default-100 rounded-lg">
                <div>
                  <p className="text-sm text-default-500">Store Name</p>
                  <p className="font-medium">{organisation.name}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Store Code</p>
                  <p className="font-medium text-sm">{organisation.organisationUniqueCode}</p>
                </div>
                {organisation.image && (
                  <div>
                    <p className="text-sm text-default-500 mb-2">Store Logo</p>
                    <img
                      src={
                        typeof organisation.image === 'string'
                          ? organisation.image
                          : organisation.image.url
                      }
                      alt="Store Logo"
                      className="h-16 w-auto rounded"
                    />
                  </div>
                )}
              </div>
            )}
            <Button
              variant="flat"
              className="w-full justify-start"
              onPress={handleEditStoreOpen}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Edit Store Settings
            </Button>
            <Button
              variant="flat"
              className="w-full justify-start"
              onPress={() => {}}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Billing & Payments
            </Button>
          </CardBody>
        </Card>

        {/* Support Section */}
        <Card>
          <CardHeader className="font-semibold">Support</CardHeader>
          <CardBody className="space-y-4">
            <Button
              variant="flat"
              className="w-full justify-start"
              onPress={() => {}}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Help & Support
            </Button>
          </CardBody>
        </Card>

        {/* WhatsApp Integration */}
        <Card>
          <CardHeader className="font-semibold">WhatsApp Integration</CardHeader>
          <CardBody className="space-y-4">
            {whatsappError && (
              <Chip
                variant="flat"
                color="danger"
                className="w-full justify-start"
              >
                {whatsappError}
              </Chip>
            )}
            {whatsappSuccess && (
              <Chip
                variant="flat"
                color="success"
                className="w-full justify-start"
              >
                {whatsappSuccess}
              </Chip>
            )}
            
            <form onSubmit={handleSaveWhatsApp} className="space-y-4">
              <div>
                <p className="text-sm text-default-600 mb-2">
                  Enable WhatsApp for customers to inquire about products directly
                </p>
              </div>

              <Input
                label="WhatsApp Number"
                placeholder="+1234567890"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                description="Include country code (e.g., +1 for US, +44 for UK)"
                disabled={whatsappSaving}
              />

              <div className="flex items-center justify-between p-3 bg-default-100 rounded-lg">
                <div>
                  <p className="font-medium">Enable WhatsApp</p>
                  <p className="text-sm text-default-600">
                    Show WhatsApp button on your products
                  </p>
                </div>
                <Switch
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                  disabled={whatsappSaving}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  color="primary"
                  isLoading={whatsappSaving}
                  disabled={whatsappSaving}
                >
                  Save WhatsApp Settings
                </Button>
                <Button
                  type="button"
                  variant="bordered"
                  onClick={() => {
                    setWhatsappNumber('')
                    setWhatsappEnabled(false)
                    setWhatsappError('')
                    setWhatsappSuccess('')
                  }}
                  disabled={whatsappSaving}
                >
                  Reset
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* QR Code Download */}
        {loadingOrg ? (
          <Card>
            <CardHeader className="font-semibold">Store QR Code</CardHeader>
            <CardBody className="flex items-center justify-center gap-3 py-8">
              <div className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-default-600">Loading...</p>
            </CardBody>
          </Card>
        ) : organisation ? (
          <Card>
            <CardHeader className="font-semibold">Store QR Code</CardHeader>
            <CardBody className="space-y-6">
              <p className="text-sm text-default-600">
                Download QR codes that link to your store. Share them on printed materials, social media, or packaging.
              </p>
              
              {/* Color Customization */}
              <div className="space-y-4 p-4 bg-default-100 rounded-lg">
                <h5 className="font-semibold text-sm text-foreground">Customize QR Code Colors</h5>
                <div className="grid grid-cols-2 gap-4">
                  {/* Dark Color Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">QR Code Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={qrDarkColor}
                        onChange={(e) => setQrDarkColor(e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-default-300"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={qrDarkColor}
                          onChange={(e) => setQrDarkColor(e.target.value)}
                          className="w-full px-3 py-2 text-sm border-1 border-default-300 rounded-lg bg-background"
                          placeholder="#000000"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Light Color Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Background Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={qrLightColor}
                        onChange={(e) => setQrLightColor(e.target.value)}
                        className="w-12 h-12 rounded-lg cursor-pointer border-2 border-default-300"
                      />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={qrLightColor}
                          onChange={(e) => setQrLightColor(e.target.value)}
                          className="w-full px-3 py-2 text-sm border-1 border-default-300 rounded-lg bg-background"
                          placeholder="#FFFFFF"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick color presets */}
                <div className="space-y-2 pt-2 border-t border-default-300">
                  <p className="text-xs font-medium text-default-600">Quick Presets</p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setQrDarkColor('#000000')
                        setQrLightColor('#FFFFFF')
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-black text-white border-2 border-default-300 hover:border-primary transition-colors"
                    >
                      Classic Black
                    </button>
                    <button
                      onClick={() => {
                        setQrDarkColor('#1f2937')
                        setQrLightColor('#f3f4f6')
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-gray-800 text-gray-100 border-2 border-default-300 hover:border-primary transition-colors"
                    >
                      Dark Mode
                    </button>
                    <button
                      onClick={() => {
                        setQrDarkColor('#0066cc')
                        setQrLightColor('#FFFFFF')
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-blue-600 text-white border-2 border-default-300 hover:border-primary transition-colors"
                    >
                      Brand Blue
                    </button>
                    <button
                      onClick={() => {
                        setQrDarkColor('#16a34a')
                        setQrLightColor('#FFFFFF')
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-green-600 text-white border-2 border-default-300 hover:border-primary transition-colors"
                    >
                      Green
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code Generator */}
              {(() => {
                let logoUrl: string | undefined
                if (organisation.image) {
                  // Handle both direct URL and object with url property
                  if (typeof organisation.image === 'string') {
                    logoUrl = organisation.image
                  } else if (organisation.image.url) {
                    logoUrl = organisation.image.url
                  }
                }
                console.log('Organisation data:', { organisation, logoUrl })
                return (
                  <QRCodeGenerator
                    organisationUniqueCode={organisation.organisationUniqueCode}
                    storeName={organisation.name}
                    logoUrl={logoUrl}
                    darkColor={qrDarkColor}
                    lightColor={qrLightColor}
                  />
                )
              })()}
            </CardBody>
          </Card>
        ) : null}

        {/* Danger Zone */}
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardHeader className="font-semibold text-red-600 dark:text-red-400">Danger Zone</CardHeader>
          <CardBody>
            <Button
              color="danger"
              variant="flat"
              className="w-full"
              onPress={handleLogout}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </CardBody>
        </Card>

        {/* Edit Profile Modal */}
        <Modal isOpen={editProfileOpen} onOpenChange={setEditProfileOpen} size="md">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Edit Profile</ModalHeader>
                <form onSubmit={handleSaveProfile}>
                  <ModalBody className="gap-4">
                    {profileError && (
                      <Chip
                        variant="flat"
                        color="danger"
                        className="w-full justify-start"
                      >
                        {profileError}
                      </Chip>
                    )}
                    {profileSuccess && (
                      <Chip
                        variant="flat"
                        color="success"
                        className="w-full justify-start"
                      >
                        {profileSuccess}
                      </Chip>
                    )}

                    <Input
                      label="First Name"
                      placeholder="Enter your first name"
                      value={profileFormData.firstName}
                      onChange={(e) =>
                        setProfileFormData({
                          ...profileFormData,
                          firstName: e.target.value,
                        })
                      }
                      disabled={profileSaving}
                    />

                    <Input
                      label="Last Name"
                      placeholder="Enter your last name"
                      value={profileFormData.lastName}
                      onChange={(e) =>
                        setProfileFormData({
                          ...profileFormData,
                          lastName: e.target.value,
                        })
                      }
                      disabled={profileSaving}
                    />

                    <Input
                      label="Email"
                      type="email"
                      placeholder="Enter your email"
                      value={profileFormData.email}
                      onChange={(e) =>
                        setProfileFormData({
                          ...profileFormData,
                          email: e.target.value,
                        })
                      }
                      disabled={profileSaving}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="default"
                      variant="light"
                      onPress={onClose}
                      disabled={profileSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      isLoading={profileSaving}
                      disabled={profileSaving}
                    >
                      Save Changes
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Edit Store Settings Modal */}
        <Modal isOpen={editStoreOpen} onOpenChange={setEditStoreOpen} size="md">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">Edit Store Settings</ModalHeader>
                <form onSubmit={handleSaveStore}>
                  <ModalBody className="gap-4">
                    {storeError && (
                      <Chip
                        variant="flat"
                        color="danger"
                        className="w-full justify-start"
                      >
                        {storeError}
                      </Chip>
                    )}
                    {storeSuccess && (
                      <Chip
                        variant="flat"
                        color="success"
                        className="w-full justify-start"
                      >
                        {storeSuccess}
                      </Chip>
                    )}

                    <Input
                      label="Store Name"
                      placeholder="Enter your store name"
                      value={storeFormData.name}
                      onChange={(e) =>
                        setStoreFormData({
                          ...storeFormData,
                          name: e.target.value,
                        })
                      }
                      disabled={storeSaving}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Store Logo</label>
                      <div className="flex items-center gap-3">
                        {storeFormData.logoPreview && (
                          <div className="relative">
                            <img
                              src={storeFormData.logoPreview}
                              alt="Logo Preview"
                              className="h-20 w-20 rounded-lg object-cover border-2 border-default-300"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setStoreFormData({
                                  ...storeFormData,
                                  logoFile: null,
                                  logoPreview: organisation?.image?.url || organisation?.image || '',
                                })
                              }
                              className="absolute -top-2 -right-2 bg-danger text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoFileChange}
                            disabled={storeSaving}
                            className="block w-full text-sm text-default-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded file:border-0
                              file:text-sm file:font-semibold
                              file:bg-primary file:text-primary-foreground
                              hover:file:bg-primary-600
                              cursor-pointer"
                          />
                          <p className="text-xs text-default-400 mt-1">
                            Max 5MB. Formats: JPG, PNG, WebP
                          </p>
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="default"
                      variant="light"
                      onPress={onClose}
                      disabled={storeSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      type="submit"
                      isLoading={storeSaving}
                      disabled={storeSaving}
                    >
                      Save Changes
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </main>
  )
}
