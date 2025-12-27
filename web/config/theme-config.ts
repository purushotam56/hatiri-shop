/**
 * Theme Configuration
 * Central configuration for color palettes and theme settings
 *
 * To change the active palette, modify the DEFAULT_PALETTE constant
 */

export type ColorPalette = {
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    danger: string;
  };
};

// ============================================================================
// COLOR PALETTES
// ============================================================================

export const COLOR_PALETTES: Record<string, ColorPalette> = {
  // Ocean Blue - Professional and trustworthy
  ocean: {
    name: "Ocean Blue",
    description: "Professional, trustworthy, tech-forward",
    colors: {
      primary: "hsl(199, 89%, 48%)", // Cyan-blue
      secondary: "hsl(142, 71%, 45%)", // Emerald green
      accent: "hsl(271, 81%, 56%)", // Violet purple
      success: "hsl(142, 71%, 45%)", // Green
      warning: "hsl(38, 92%, 50%)", // Amber
      danger: "hsl(0, 84%, 60%)", // Red
    },
  },

  // Sunset Orange - Energetic and vibrant
  sunset: {
    name: "Sunset Orange",
    description: "Energetic, vibrant, action-oriented",
    colors: {
      primary: "hsl(24, 95%, 53%)", // Orange
      secondary: "hsl(340, 82%, 52%)", // Pink-red
      accent: "hsl(45, 93%, 47%)", // Golden yellow
      success: "hsl(142, 71%, 45%)", // Green
      warning: "hsl(38, 92%, 50%)", // Amber
      danger: "hsl(0, 84%, 60%)", // Red
    },
  },

  // Forest Green - Natural and eco-friendly
  forest: {
    name: "Forest Green",
    description: "Natural, eco-friendly, organic",
    colors: {
      primary: "hsl(142, 76%, 36%)", // Forest green
      secondary: "hsl(84, 81%, 44%)", // Lime green
      accent: "hsl(173, 80%, 40%)", // Teal
      success: "hsl(142, 71%, 45%)", // Green
      warning: "hsl(38, 92%, 50%)", // Amber
      danger: "hsl(0, 84%, 60%)", // Red
    },
  },

  // Royal Purple - Premium and luxurious
  royal: {
    name: "Royal Purple",
    description: "Premium, luxurious, sophisticated",
    colors: {
      primary: "hsl(271, 81%, 56%)", // Purple
      secondary: "hsl(291, 47%, 51%)", // Magenta
      accent: "hsl(217, 91%, 60%)", // Blue
      success: "hsl(142, 71%, 45%)", // Green
      warning: "hsl(38, 92%, 50%)", // Amber
      danger: "hsl(0, 84%, 60%)", // Red
    },
  },

  // Cherry Red - Bold and passionate
  cherry: {
    name: "Cherry Red",
    description: "Bold, passionate, attention-grabbing",
    colors: {
      primary: "hsl(348, 83%, 47%)", // Cherry red
      secondary: "hsl(0, 72%, 51%)", // Red
      accent: "hsl(330, 81%, 60%)", // Pink
      success: "hsl(142, 71%, 45%)", // Green
      warning: "hsl(38, 92%, 50%)", // Amber
      danger: "hsl(0, 84%, 60%)", // Red
    },
  },

  // Slate Blue - Modern and minimal
  slate: {
    name: "Slate Blue",
    description: "Modern, minimal, elegant",
    colors: {
      primary: "hsl(215, 16%, 47%)", // Slate
      secondary: "hsl(217, 33%, 17%)", // Dark slate
      accent: "hsl(217, 91%, 60%)", // Blue
      success: "hsl(142, 71%, 45%)", // Green
      warning: "hsl(38, 92%, 50%)", // Amber
      danger: "hsl(0, 84%, 60%)", // Red
    },
  },

  // Mint Fresh - Clean and refreshing
  mint: {
    name: "Mint Fresh",
    description: "Clean, refreshing, modern",
    colors: {
      primary: "hsl(160, 84%, 39%)", // Mint green
      secondary: "hsl(173, 80%, 40%)", // Teal
      accent: "hsl(197, 71%, 73%)", // Sky blue
      success: "hsl(142, 71%, 45%)", // Green
      warning: "hsl(38, 92%, 50%)", // Amber
      danger: "hsl(0, 84%, 60%)", // Red
    },
  },

  // Cosmic Purple - Futuristic and innovative
  cosmic: {
    name: "Cosmic Purple",
    description: "Futuristic, innovative, tech-savvy",
    colors: {
      primary: "hsl(263, 70%, 50%)", // Deep purple
      secondary: "hsl(291, 47%, 51%)", // Magenta
      accent: "hsl(180, 100%, 50%)", // Cyan
      success: "hsl(142, 71%, 45%)", // Green
      warning: "hsl(38, 92%, 50%)", // Amber
      danger: "hsl(0, 84%, 60%)", // Red
    },
  },

  // Monochrome - Classic black and white
  monochrome: {
    name: "Monochrome",
    description: "Classic, timeless, professional",
    colors: {
      primary: "hsl(0, 0%, 9%)", // Almost black
      secondary: "hsl(0, 0%, 20%)", // Dark gray
      accent: "hsl(0, 0%, 60%)", // Medium gray
      success: "hsl(142, 71%, 45%)", // Green
      warning: "hsl(38, 92%, 50%)", // Amber
      danger: "hsl(0, 84%, 60%)", // Red
    },
  },
};

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Set the default color palette here
 * Options: 'ocean', 'sunset', 'forest', 'royal', 'cherry', 'slate', 'mint', 'cosmic', 'monochrome'
 */
export const DEFAULT_PALETTE: keyof typeof COLOR_PALETTES = "ocean";

/**
 * Default theme mode
 * Options: 'light', 'dark', 'system'
 */
export const DEFAULT_THEME_MODE: "light" | "dark" | "system" = "system";

/**
 * Get the currently active palette
 */
export function getActivePalette(): ColorPalette {
  return COLOR_PALETTES[DEFAULT_PALETTE];
}

/**
 * Get all available palette names
 */
export function getAvailablePalettes(): string[] {
  return Object.keys(COLOR_PALETTES);
}
