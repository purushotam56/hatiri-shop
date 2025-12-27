"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { SellerFooter } from "@/components/footers/seller-footer";
import { SellerHeader } from "@/components/headers/seller-header";
import { useSellerStore, useSellerAuth } from "@/context/seller-store-context";

interface SellerLayoutProps {
  children: React.ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedStore } = useSellerStore();
  const { authState } = useSellerAuth();
  const [storeName, setStoreName] = useState("My Store");
  const [storeLogoUrl, setStoreLogoUrl] = useState<string | undefined>(
    undefined,
  );

  // Extract orgId from URL path
  const getOrgIdFromPath = () => {
    const parts = pathname.split("/");

    // Path format: /seller or /seller/[id]/...
    if (
      parts[2] &&
      parts[2] !== "login" &&
      parts[2] !== "register" &&
      parts[2] !== "select-store"
    ) {
      return parts[2];
    }

    return selectedStore?.id;
  };

  const orgId = getOrgIdFromPath();

  // Get user data from auth context
  const sellerName = authState.user?.fullName || "Seller";
  const sellerEmail = authState.user?.email || "seller@hatiri.com";

  // Update store name and logo when selected store changes
  useEffect(() => {
    Promise.resolve().then(() => {
      if (selectedStore?.name) {
        setStoreName(selectedStore.name);
      }
      if (selectedStore?.image) {
        if (
          typeof selectedStore.image === "object" &&
          "url" in selectedStore.image
        ) {
          setStoreLogoUrl(selectedStore.image.url);
        } else if (typeof selectedStore.image === "string") {
          setStoreLogoUrl(selectedStore.image);
        }
      }
    });
  }, [selectedStore]);

  const handleSwitchStore = () => {
    router.push("/seller/select-store");
  };

  // Show header only on authenticated pages (not login, register, select-store)
  const shouldShowHeader =
    authState.isAuthenticated &&
    !pathname.includes("/login") &&
    !pathname.includes("/register") &&
    !pathname.includes("/select-store");

  return (
    <div className="flex flex-col min-h-screen">
      {shouldShowHeader && (
        <SellerHeader
          orgId={orgId as string}
          sellerEmail={sellerEmail}
          sellerName={sellerName}
          storeLogoUrl={storeLogoUrl}
          storeName={storeName}
          onSwitchStore={handleSwitchStore}
        />
      )}
      <main className="flex-1 w-full">{children}</main>
      {shouldShowHeader && <SellerFooter />}
    </div>
  );
}
