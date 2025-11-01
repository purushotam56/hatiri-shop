'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface AdminUser {
  id: number
  email: string
  fullName: string
}

interface AdminContextType {
  adminUser: AdminUser | null
  setAdminUser: (user: AdminUser | null) => void
  clearAdmin: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminUser')
    if (storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin))
      } catch (e) {
        console.error('Failed to parse admin user from localStorage:', e)
      }
    }
  }, [])

  const handleSetAdminUser = (user: AdminUser | null) => {
    setAdminUser(user)
    if (user) {
      localStorage.setItem('adminUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('adminUser')
    }
  }

  const clearAdmin = () => {
    setAdminUser(null)
    localStorage.removeItem('adminUser')
    localStorage.removeItem('adminToken')
  }

  return (
    <AdminContext.Provider value={{ adminUser, setAdminUser: handleSetAdminUser, clearAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
