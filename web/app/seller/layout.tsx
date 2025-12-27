"use client";

import { SellerLayout } from "@/components/layouts/seller-layout";
import { SellerStoreProvider } from "@/context/seller-store-context";

export default function SellerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SellerStoreProvider>
      <SellerLayout>{children}</SellerLayout>
    </SellerStoreProvider>
  );
}
