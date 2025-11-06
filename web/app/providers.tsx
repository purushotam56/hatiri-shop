"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { AddressProvider } from "@/context/address-context";
import { PanelProvider } from "@/context/panel-context";
import { ThemeInjector } from "@/components/theme-injector";
import { DEFAULT_THEME_MODE } from "@/config/theme-config";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider 
        {...themeProps}
        defaultTheme={themeProps?.defaultTheme || DEFAULT_THEME_MODE}
        attribute="class"
        enableSystem
      >
        <ThemeInjector />
        <AuthProvider>
          <PanelProvider>
            <AddressProvider>
              <CartProvider>{children}</CartProvider>
            </AddressProvider>
          </PanelProvider>
        </AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
