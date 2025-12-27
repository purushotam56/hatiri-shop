/**
 * Server-side panel type detection utilities
 * Use these functions in server components or API routes
 */

import { PanelType, PANEL_CONFIGS } from "@/types/panel";

/**
 * Detect panel type from pathname (server-side)
 * @param pathname - URL pathname
 * @returns PanelType
 */
export function getPanelTypeFromPath(pathname: string): PanelType {
  if (pathname.startsWith("/admin")) {
    return PanelType.ADMIN;
  } else if (pathname.startsWith("/seller")) {
    return PanelType.SELLER;
  } else if (pathname.startsWith("/store")) {
    return PanelType.STORE;
  } else if (pathname.startsWith("/orders")) {
    return PanelType.ORDERS;
  } else if (pathname.startsWith("/account")) {
    return PanelType.ACCOUNT;
  } else if (pathname.startsWith("/cart")) {
    return PanelType.CART;
  } else if (pathname.startsWith("/search")) {
    return PanelType.SEARCH;
  } else if (pathname.startsWith("/product")) {
    return PanelType.PRODUCT;
  } else if (pathname === "/") {
    return PanelType.LANDING;
  }

  return PanelType.UNKNOWN;
}

/**
 * Get panel configuration for a given panel type
 * @param panelType - Panel type
 * @returns Panel configuration
 */
export function getPanelConfig(panelType: PanelType) {
  return PANEL_CONFIGS[panelType] || PANEL_CONFIGS[PanelType.UNKNOWN];
}

/**
 * Check if a path belongs to admin panel
 */
export function isAdminPath(pathname: string): boolean {
  return pathname.startsWith("/admin");
}

/**
 * Check if a path belongs to seller panel
 */
export function isSellerPath(pathname: string): boolean {
  return pathname.startsWith("/seller");
}

/**
 * Check if a path belongs to store
 */
export function isStorePath(pathname: string): boolean {
  return pathname.startsWith("/store");
}

/**
 * Check if a path is orders page
 */
export function isOrdersPath(pathname: string): boolean {
  return pathname.startsWith("/orders");
}

/**
 * Check if a path requires authentication
 */
export function isAuthRequiredPath(pathname: string): boolean {
  const panelType = getPanelTypeFromPath(pathname);
  const config = getPanelConfig(panelType);

  return config.requiresAuth || false;
}

/**
 * Get required auth type for a path
 */
export function getRequiredAuthType(
  pathname: string,
): "user" | "admin" | "seller" | null {
  const panelType = getPanelTypeFromPath(pathname);
  const config = getPanelConfig(panelType);

  return config.authType || null;
}
