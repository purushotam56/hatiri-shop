"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { PanelType, PANEL_CONFIGS } from "@/types/panel";

/**
 * Hook to detect and return the current panel type based on URL pathname
 * @returns {Object} - { panelType, config, isAdminPanel, isSellerPanel, isStore, isOrders }
 */
export function usePanelType() {
  const pathname = usePathname();

  const result = useMemo(() => {
    let panelType = PanelType.LANDING;

    // Determine panel type based on pathname
    if (pathname.startsWith("/admin")) {
      panelType = PanelType.ADMIN;
    } else if (pathname.startsWith("/seller")) {
      panelType = PanelType.SELLER;
    } else if (pathname.startsWith("/store")) {
      panelType = PanelType.STORE;
    } else if (pathname.startsWith("/orders")) {
      panelType = PanelType.ORDERS;
    } else if (pathname.startsWith("/account")) {
      panelType = PanelType.ACCOUNT;
    } else if (pathname.startsWith("/cart")) {
      panelType = PanelType.CART;
    } else if (pathname.startsWith("/search")) {
      panelType = PanelType.SEARCH;
    } else if (pathname.startsWith("/product")) {
      panelType = PanelType.PRODUCT;
    } else if (pathname === "/") {
      panelType = PanelType.LANDING;
    }

    const config = PANEL_CONFIGS[panelType];

    return {
      panelType,
      config,
      isAdminPanel: panelType === PanelType.ADMIN,
      isSellerPanel: panelType === PanelType.SELLER,
      isStore: panelType === PanelType.STORE,
      isOrders: panelType === PanelType.ORDERS,
      isLanding: panelType === PanelType.LANDING,
      isAccountPage: panelType === PanelType.ACCOUNT,
    };
  }, [pathname]);

  return result;
}
