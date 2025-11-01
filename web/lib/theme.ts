/**
 * Global Theme System
 * Centralized color, gradient, and styling constants for the application
 */

// ============================================================================
// COLOR PALETTES
// ============================================================================

export const COLORS = {
  // Primary Gradients
  primary: {
    from: "from-blue-400",
    to: "to-purple-500",
    text: "text-white",
  },
  
  // Seller (Orange/Red)
  seller: {
    from: "from-orange-500",
    to: "to-red-600",
    hover: "hover:from-orange-600 hover:to-red-700",
    ring: "focus:ring-orange-500/20",
    border: "focus:border-orange-500",
    shadow: "shadow-orange-500/50",
  },
  
  // Admin (Amber/Yellow)
  admin: {
    from: "from-amber-500",
    to: "to-yellow-600",
    hover: "hover:from-amber-600 hover:to-yellow-700",
    ring: "focus:ring-amber-500/20",
    border: "focus:border-amber-500",
    shadow: "shadow-amber-500/50",
  },
  
  // Customer (Blue/Purple)
  customer: {
    from: "from-blue-500",
    to: "to-purple-600",
    hover: "hover:from-blue-600 hover:to-purple-700",
    ring: "focus:ring-blue-500/20",
    border: "focus:border-blue-500",
    shadow: "shadow-blue-500/50",
  },
  
  // E-commerce (Green - for checkout, success)
  ecommerce: {
    from: "from-green-500",
    to: "to-emerald-600",
    hover: "hover:from-green-600 hover:to-emerald-700",
    ring: "focus:ring-green-500/20",
    border: "focus:border-green-500",
    shadow: "shadow-green-500/50",
  },
  
  // Neutral/Dark
  dark: {
    bg: "bg-slate-900",
    card: "bg-slate-800/50",
    border: "border-slate-700",
    text: "text-slate-200",
    secondary: "text-slate-400",
    muted: "text-slate-500",
  },
};

// ============================================================================
// GRADIENT BACKGROUNDS
// ============================================================================

export const GRADIENTS = {
  page: {
    light: "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900",
    dark: "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900",
  },
  
  orbs: {
    blue: "bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse",
    purple: "bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse",
    orange: "bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse",
    amber: "bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse",
    green: "bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse",
  },
  
  header: {
    primary: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
    seller: "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500",
    admin: "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500",
  },
};

// ============================================================================
// COMPONENT STYLES
// ============================================================================

export const COMPONENTS = {
  button: {
    primary: "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/50",
    seller: "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/50",
    admin: "bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 shadow-lg shadow-amber-500/50",
    success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/50",
  },
  
  input: {
    base: "px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500",
    focus: "focus:outline-none focus:ring-2 transition-all disabled:opacity-50",
    primary: "focus:border-blue-500 focus:ring-blue-500/20",
    seller: "focus:border-orange-500 focus:ring-orange-500/20",
    admin: "focus:border-amber-500 focus:ring-amber-500/20",
  },
  
  card: {
    base: "bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl",
    hover: "hover:border-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/20 transform hover:scale-105",
    interactive: "hover:border-slate-600 transition-colors",
  },
  
  header: {
    base: "bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-40",
  },
};

// ============================================================================
// UTILITIES
// ============================================================================

export const UTILS = {
  loadingSpinner: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin",
  
  backdrop: "absolute inset-0 overflow-hidden pointer-events-none",
  
  animation: {
    pulse: "animate-pulse",
    spin: "animate-spin",
    scale: "transform hover:scale-105 transition-all",
  },
};

// ============================================================================
// THEME VARIANTS
// ============================================================================

export const THEME_VARIANTS = {
  customer: {
    colors: COLORS.customer,
    gradient: GRADIENTS.header.primary,
    button: COMPONENTS.button.primary,
    input: COMPONENTS.input.primary,
    orb: [COLORS.dark.bg, "absolute top-20 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"],
  },
  
  seller: {
    colors: COLORS.seller,
    gradient: GRADIENTS.header.seller,
    button: COMPONENTS.button.seller,
    input: COMPONENTS.input.seller,
  },
  
  admin: {
    colors: COLORS.admin,
    gradient: GRADIENTS.header.admin,
    button: COMPONENTS.button.admin,
    input: COMPONENTS.input.admin,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getTheme = (variant: "customer" | "seller" | "admin" = "customer") => {
  return THEME_VARIANTS[variant];
};

export const combineClasses = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(" ");
};
