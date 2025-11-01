"use client";

import { SellerHeader } from "@/components/headers/seller-header";
import { SellerFooter } from "@/components/footers/seller-footer";
import { useEffect, useState } from "react";

interface SellerLayoutProps {
  children: React.ReactNode;
}

export function SellerLayout({ children }: SellerLayoutProps) {
  const [sellerName, setSellerName] = useState("Seller");
  const [sellerEmail, setSellerEmail] = useState("seller@hatiri.com");
  const [storeName, setStoreName] = useState("My Store");

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

  return (
    <div className="flex flex-col min-h-screen">
      <SellerHeader
        sellerName={sellerName}
        sellerEmail={sellerEmail}
        storeName={storeName}
      />
      <main className="flex-1 w-full">
        {children}
      </main>
      <SellerFooter />
    </div>
  );
}
