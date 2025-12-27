"use client";


import { AddressProvider } from "@/context/address-context";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import * as React from "react";
export interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <AuthProvider>
        <AddressProvider>


      <CartProvider>

      {children}
      </CartProvider>
        </AddressProvider>
      </AuthProvider>
    </HeroUIProvider>
  );
}
