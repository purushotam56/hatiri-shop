/**
 * Theme Provider Component
 * Injects CSS variables for the active color palette
 */

"use client";

import { useEffect } from "react";
import { getActivePalette } from "@/config/theme-config";

export function ThemeInjector() {
  useEffect(() => {
    const palette = getActivePalette();
    
    // Extract HSL values from hsl() strings and format without commas
    const extractHSL = (hslString: string) => {
      const match = hslString.match(/hsl\(([^)]+)\)/);
      if (!match) return "0 0% 0%";
      // Remove commas and extra spaces: "199, 89%, 48%" -> "199 89% 48%"
      return match[1].replace(/,\s*/g, ' ');
    };

    // Set CSS variables on the root element
    document.documentElement.style.setProperty(
      "--theme-primary",
      extractHSL(palette.colors.primary)
    );
    document.documentElement.style.setProperty(
      "--theme-secondary",
      extractHSL(palette.colors.secondary)
    );
    document.documentElement.style.setProperty(
      "--theme-accent",
      extractHSL(palette.colors.accent)
    );
    document.documentElement.style.setProperty(
      "--theme-success",
      extractHSL(palette.colors.success)
    );
    document.documentElement.style.setProperty(
      "--theme-warning",
      extractHSL(palette.colors.warning)
    );
    document.documentElement.style.setProperty(
      "--theme-danger",
      extractHSL(palette.colors.danger)
    );
  }, []);

  return null;
}
