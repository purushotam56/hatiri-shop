/**
 * Global Theme System
 * Centralized color, gradient, and styling constants for the application
 * Color Palette: Hatiri Brand Colors with HeroUI Integration
 */

// ============================================================================
// UNIFIED COLOR PALETTE - Hatiri Brand
// ============================================================================
// Primary: Cyan-Blue (modern, trustworthy, tech-forward)
// Secondary: Emerald-Green (growth, freshness, commerce)
// Accent: Violet-Purple (premium, magic, special offers)
// Supporting: Amber-Orange (urgency, alerts, actions)

export const COLORS = {
  // Brand Primary (Cyan-Blue)
  primary: {
    50: "#e0f2fe",
    100: "#b6e4fd",
    200: "#7dd3fc",
    300: "#38bdf8",
    400: "#0ea5e9",
    500: "#0284c7",
    600: "#0369a1",
    700: "#075985",
    800: "#0c4a6e",
    900: "#082f49",
  },

  // Brand Secondary (Emerald-Green)
  secondary: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Brand Accent (Violet-Purple)
  accent: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
  },

  // Supporting Color (Amber-Orange)
  warning: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },

  // Success (for checkout, delivery)
  success: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Error
  error: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },

  // Neutral/Dark (UI backgrounds)
  dark: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
  },
};

// Role-based colors
export const ROLE_COLORS = {
  // Customer Portal
  customer: {
    primary: COLORS.primary,
    button:
      "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700",
    ring: "ring-cyan-500/20",
    border: "border-cyan-500",
  },

  // Seller Portal
  seller: {
    primary: COLORS.secondary,
    button:
      "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700",
    ring: "ring-emerald-500/20",
    border: "border-emerald-500",
  },

  // Admin Portal
  admin: {
    primary: COLORS.accent,
    button:
      "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700",
    ring: "ring-violet-500/20",
    border: "border-violet-500",
  },
};

// ============================================================================
// GRADIENT BACKGROUNDS
// ============================================================================

export const GRADIENTS = {
  page: {
    dark: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900",
    darkAlt: "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950",
  },

  orbs: {
    cyan: "bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse",
    emerald:
      "bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse",
    violet:
      "bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse",
    amber:
      "bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse",
  },

  header: {
    customer: "bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600",
    seller: "bg-gradient-to-r from-emerald-500 via-green-500 to-green-600",
    admin: "bg-gradient-to-r from-violet-500 via-purple-500 to-purple-600",
  },
};

// ============================================================================
// COMPONENT STYLES (HeroUI Compatible)
// ============================================================================

export const COMPONENTS = {
  button: {
    primary:
      "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 shadow-lg shadow-cyan-500/50 transition-all duration-200",
    seller:
      "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/50 transition-all duration-200",
    admin:
      "bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/50 transition-all duration-200",
    success:
      "bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/50",
    warning:
      "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/50",
    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/50",
  },

  input: {
    base: "px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 transition-all duration-200",
    focus:
      "focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50",
    primary: "focus:border-cyan-500 focus:ring-cyan-500/30",
    seller: "focus:border-emerald-500 focus:ring-emerald-500/30",
    admin: "focus:border-violet-500 focus:ring-violet-500/30",
  },

  card: {
    base: "bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl transition-all duration-300",
    hover:
      "hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/20 hover:bg-slate-800/80",
    interactive: "hover:border-slate-600 transition-colors cursor-pointer",
    hoverLift:
      "hover:shadow-xl hover:-translate-y-1 transition-all duration-300",
  },

  header: {
    base: "bg-slate-900/90 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40",
  },

  badge: {
    primary: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30",
    seller: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    admin: "bg-violet-500/20 text-violet-300 border border-violet-500/30",
    success: "bg-green-500/20 text-green-300 border border-green-500/30",
    warning: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
  },
};

// ============================================================================
// UTILITIES
// ============================================================================

export const UTILS = {
  loadingSpinner:
    "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin",

  backdrop: "absolute inset-0 overflow-hidden pointer-events-none",

  animation: {
    pulse: "animate-pulse",
    spin: "animate-spin",
    fadeIn: "animate-in fade-in duration-500",
    slideUp: "animate-in slide-in-from-bottom-4 duration-500",
  },
};

// ============================================================================
// THEME VARIANTS
// ============================================================================

export const THEME_VARIANTS = {
  customer: {
    colors: COLORS.primary,
    roleColor: ROLE_COLORS.customer,
    gradient: GRADIENTS.header.customer,
    button: COMPONENTS.button.primary,
    input: COMPONENTS.input.primary,
  },

  seller: {
    colors: COLORS.secondary,
    roleColor: ROLE_COLORS.seller,
    gradient: GRADIENTS.header.seller,
    button: COMPONENTS.button.seller,
    input: COMPONENTS.input.seller,
  },

  admin: {
    colors: COLORS.accent,
    roleColor: ROLE_COLORS.admin,
    gradient: GRADIENTS.header.admin,
    button: COMPONENTS.button.admin,
    input: COMPONENTS.input.admin,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getTheme = (
  variant: "customer" | "seller" | "admin" = "customer",
) => {
  return THEME_VARIANTS[variant];
};

export const combineClasses = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(" ");
};
