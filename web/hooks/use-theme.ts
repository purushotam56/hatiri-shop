/**
 * Theme Hook
 * Custom hook for accessing theme colors and settings
 */

"use client";

import { useTheme as useNextTheme } from "next-themes";
import { getActivePalette, COLOR_PALETTES, type ColorPalette } from "@/config/theme-config";
import { useState, useEffect } from "react";

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return {
    theme: currentTheme,
    setTheme,
    isDark,
    mounted,
    palette: getActivePalette(),
    allPalettes: COLOR_PALETTES,
  };
}

export type UseThemeReturn = ReturnType<typeof useTheme>;
