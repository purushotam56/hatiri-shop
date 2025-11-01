'use client'

import { SellerStoreProvider } from '@/context/seller-store-context'
import { SellerLayout } from '@/components/layouts/seller-layout'

export default function SellerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SellerStoreProvider>
      <SellerLayout>
        {children}
      </SellerLayout>
    </SellerStoreProvider>
  );
}
