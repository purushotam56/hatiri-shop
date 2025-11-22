"use client";

import { SellerHeader } from "@/components/headers/seller-header";
import { SellerFooter } from "@/components/footers/seller-footer";
import { useEffect, useState } from "react";
import { useSellerStore } from "@/context/seller-store-context";
import { useRouter, usePathname } from "next/navigation";

interface SellerLayoutProps {
  children: React.ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedStore } = useSellerStore();
  const [sellerName, setSellerName] = useState("Seller");
  const [sellerEmail, setSellerEmail] = useState("seller@hatiri.com");
  const [storeName, setStoreName] = useState("My Store");
  const [storeLogoUrl, setStoreLogoUrl] = useState<string | undefined>(undefined);

  // Extract orgId from URL path
  const getOrgIdFromPath = () => {
    const parts = pathname.split('/');
    // Path format: /seller or /seller/[id]/...
    if (parts[2] && parts[2] !== 'login' && parts[2] !== 'register' && parts[2] !== 'select-store') {
      return parts[2];
    }
    return selectedStore?.id;
  };

  const orgId = getOrgIdFromPath();

  useEffect(() => {
    const user = localStorage.getItem("sellerUser");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setSellerName(parsedUser.name || "Seller");
        setSellerEmail(parsedUser.email || "seller@hatiri.com");
        setStoreName(parsedUser.storeName || "My Store");
      } catch (error) {
        console.error("Failed to parse seller user:", error);
      }
    }
  }, []);

  // Update store name and logo when selected store changes
  useEffect(() => {
    if (selectedStore?.name) {
      setStoreName(selectedStore.name);
    }
    if (selectedStore?.image) {
      if (typeof selectedStore.image === 'object' && 'url' in selectedStore.image) {
        setStoreLogoUrl(selectedStore.image.url);
      } else if (typeof selectedStore.image === 'string') {
        setStoreLogoUrl(selectedStore.image);
      }
    }
  }, [selectedStore]);

  const handleSwitchStore = () => {
    router.push("/seller/select-store");
  };

  // Hide header for login, register, and select-store pages
  const shouldShowHeader = !pathname.includes('/login') && 
                         !pathname.includes('/register') && 
                         !pathname.includes('/select-store');

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowHeader && (
        <SellerHeader
          sellerName={sellerName}
          sellerEmail={sellerEmail}
          storeName={storeName}
          storeLogoUrl={storeLogoUrl}
          onSwitchStore={handleSwitchStore}
          orgId={orgId as string}
        />
      )}
      <main className="flex-1 w-full">
        {children}
      </main>
      {shouldShowHeader && <SellerFooter />}
    </div>
  );
}
