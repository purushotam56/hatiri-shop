/**
 * Panel Type Definitions
 * Identifies which panel/section a user is currently viewing
 */

export enum PanelType {
  LANDING = "landing", // Main marketplace homepage
  STORE = "store", // Store/vendor storefront
  ADMIN = "admin", // Admin dashboard
  SELLER = "seller", // Seller dashboard
  ORDERS = "orders", // Orders page
  ACCOUNT = "account", // User account page
  CART = "cart", // Shopping cart
  SEARCH = "search", // Search results
  PRODUCT = "product", // Product detail page
  UNKNOWN = "unknown", // Unknown/other pages
}

export interface PanelConfig {
  type: PanelType;
  name: string;
  description: string;
  headerColor?: string; // Tailwind color class
  footerColor?: string; // Tailwind color class
  layout?: "landing" | "admin" | "seller" | "store"; // Which layout to use
  requiresAuth?: boolean; // Whether authentication is required
  authType?: "user" | "admin" | "seller"; // Type of authentication required
}

// Panel configuration mapping
export const PANEL_CONFIGS: Record<PanelType, PanelConfig> = {
  [PanelType.LANDING]: {
    type: PanelType.LANDING,
    name: "Marketplace",
    description: "Main marketplace homepage",
    layout: "landing",
    requiresAuth: false,
  },
  [PanelType.STORE]: {
    type: PanelType.STORE,
    name: "Store",
    description: "Vendor storefront",
    layout: "store",
    requiresAuth: false,
  },
  [PanelType.ADMIN]: {
    type: PanelType.ADMIN,
    name: "Admin",
    description: "Admin dashboard",
    headerColor: "from-red-600 to-red-700",
    footerColor: "bg-red-50",
    layout: "admin",
    requiresAuth: true,
    authType: "admin",
  },
  [PanelType.SELLER]: {
    type: PanelType.SELLER,
    name: "Seller",
    description: "Seller dashboard",
    headerColor: "from-blue-600 to-blue-700",
    footerColor: "bg-blue-50",
    layout: "seller",
    requiresAuth: true,
    authType: "seller",
  },
  [PanelType.ORDERS]: {
    type: PanelType.ORDERS,
    name: "Orders",
    description: "User orders",
    layout: "landing",
    requiresAuth: true,
    authType: "user",
  },
  [PanelType.ACCOUNT]: {
    type: PanelType.ACCOUNT,
    name: "Account",
    description: "User account settings",
    layout: "landing",
    requiresAuth: true,
    authType: "user",
  },
  [PanelType.CART]: {
    type: PanelType.CART,
    name: "Cart",
    description: "Shopping cart",
    layout: "landing",
    requiresAuth: false,
  },
  [PanelType.SEARCH]: {
    type: PanelType.SEARCH,
    name: "Search",
    description: "Search results",
    layout: "landing",
    requiresAuth: false,
  },
  [PanelType.PRODUCT]: {
    type: PanelType.PRODUCT,
    name: "Product",
    description: "Product details",
    layout: "landing",
    requiresAuth: false,
  },
  [PanelType.UNKNOWN]: {
    type: PanelType.UNKNOWN,
    name: "Unknown",
    description: "Unknown page",
    layout: "landing",
    requiresAuth: false,
  },
};
