'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@heroui/card'
import { Spinner } from '@heroui/spinner'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Select, SelectItem } from '@heroui/select'
import { Chip } from '@heroui/chip'
import { apiEndpoints } from '@/lib/api-client'
import { AdminHeader } from '@/components/headers/admin-header'
import { useAdmin } from '@/context/admin-context'

interface PlatformSettings {
  id: number
  freeTrialDays: number
  minTrialDays: number
  maxTrialDays: number
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const { adminUser, clearAdmin } = useAdmin()
  const [settings, setSettings] = useState<PlatformSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [storeLoaded, setStoreLoaded] = useState(false)
  const [formData, setFormData] = useState({
    freeTrialDays: '14',
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

    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('adminToken')
        const data = await apiEndpoints.getAdminSettings(token || '')
        setSettings(data.settings)
        setFormData({
          freeTrialDays: String(data.settings.freeTrialDays),
        })
      } catch (err) {
        setError('Failed to load settings')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [router, clearAdmin, storeLoaded])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
    setSuccess('')
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin')
        return
      }

      const trialDays = parseInt(formData.freeTrialDays, 10)

      if (isNaN(trialDays) || trialDays < 1 || trialDays > 365) {
        setError('Free trial days must be between 1 and 365')
        setSaving(false)
        return
      }

      const data = await apiEndpoints.updateAdminSettings(token, {
        freeTrialDays: trialDays,
      })

      setSettings(data.settings)
      setSuccess('Settings updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to save settings')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-default-50">
      <AdminHeader userName={adminUser?.fullName} userEmail={adminUser?.email} />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner label="Loading settings..." />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Platform Settings</h1>
              <p className="text-default-500">Configure system-wide settings for all sellers</p>
            </div>

            {/* Settings Card */}
            <Card>
              <CardHeader className="flex flex-col items-start px-6 py-4 border-b border-divider">
                <h2 className="text-xl font-semibold">Free Trial Configuration</h2>
                <p className="text-sm text-default-500 mt-1">Set the default free trial period for new sellers</p>
              </CardHeader>
              <CardBody className="gap-6 p-6">
                {error && (
                  <Chip color="danger" variant="flat" startContent={<span>⚠️</span>} className="w-full justify-start p-4">
                    {error}
                  </Chip>
                )}

                {success && (
                  <Chip color="success" variant="flat" startContent={<span>✓</span>} className="w-full justify-start p-4">
                    {success}
                  </Chip>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* Trial Days Input */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-default-700">Free Trial Days</label>
                      <p className="text-xs text-default-500 mt-1">Number of days new sellers get to try Hatiri for free</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Select
                        name="freeTrialDays"
                        value={formData.freeTrialDays}
                        onChange={handleChange as any}
                        className="max-w-xs"
                        label="Select trial period"
                      >
                        <SelectItem key="7">
                          7 days
                        </SelectItem>
                        <SelectItem key="14">
                          14 days (Recommended)
                        </SelectItem>
                        <SelectItem key="30">
                          30 days
                        </SelectItem>
                      </Select>
                      <div className="text-sm text-default-500">
                        or enter custom days (1-365)
                      </div>
                    </div>
                    <Input
                      type="number"
                      name="freeTrialDays"
                      value={formData.freeTrialDays}
                      onChange={handleChange}
                      placeholder="Enter number of days (1-365)"
                      min="1"
                      max="365"
                      variant="bordered"
                      description="Sellers will have this many days to use Hatiri free of charge"
                    />
                  </div>

                  {/* Current Setting Display */}
                  {settings && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm font-semibold text-blue-900">Current Setting</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">{settings.freeTrialDays} days</p>
                      <p className="text-xs text-blue-700 mt-2">This applies to all new seller sign-ups after this change is saved.</p>
                    </div>
                  )}

                  {/* Save Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      color="primary"
                      size="lg"
                      isLoading={saving}
                      isDisabled={saving}
                      className="font-semibold"
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
                    </Button>
                    <Button
                      variant="bordered"
                      size="lg"
                      onClick={() => router.back()}
                      isDisabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>

                {/* Info Section */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <p className="text-sm font-semibold text-yellow-900">💡 About Free Trials</p>
                  <ul className="text-xs text-yellow-800 mt-2 space-y-1 list-disc list-inside">
                    <li>New sellers automatically get the configured number of free trial days upon sign-up</li>
                    <li>During the trial period, sellers have access to all features</li>
                    <li>When the trial ends, sellers need to upgrade to a paid plan to continue</li>
                    <li>Changes to this setting apply to future sign-ups only</li>
                  </ul>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </main>
  )
}
