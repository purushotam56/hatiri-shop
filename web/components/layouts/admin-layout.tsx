'use client'

import { ReactNode } from 'react'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return <div className="flex flex-col min-h-screen">{children}</div>
}
