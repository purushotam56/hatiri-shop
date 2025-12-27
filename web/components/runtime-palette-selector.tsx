/**
 * Runtime Theme Palette Selector
 * Allows switching between color palettes at runtime (demonstration purposes)
 * Note: For production, palette should be set via config file
 */

"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { useState, useEffect } from "react";

import { COLOR_PALETTES } from "@/config/theme-config";

export function RuntimePaletteSelector() {
  const [selectedPalette, setSelectedPalette] = useState<string>("ocean");
  const [mounted, setMounted] = useState(false);
  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
    });
  }, []);

  const applyPalette = (paletteKey: string) => {
    const palette = COLOR_PALETTES[paletteKey];

    if (!palette) {
      console.error(`Palette ${paletteKey} not found`);

      return;
    }

    // Extract HSL values and format without commas
    const extractHSL = (hslString: string) => {
      const match = hslString.match(/hsl\(([^)]+)\)/);

      if (!match) return "0 0% 0%";

      // Remove commas and extra spaces: "199, 89%, 48%" -> "199 89% 48%"
      return match[1].replace(/,\s*/g, " ");
    };

    // Update CSS variables
    const root = document.documentElement;
    const primaryValue = extractHSL(palette.colors.primary);
    const secondaryValue = extractHSL(palette.colors.secondary);

    root.style.setProperty("--theme-primary", primaryValue);
    root.style.setProperty("--theme-secondary", secondaryValue);
    root.style.setProperty("--theme-accent", extractHSL(palette.colors.accent));
    root.style.setProperty(
      "--theme-success",
      extractHSL(palette.colors.success),
    );
    root.style.setProperty(
      "--theme-warning",
      extractHSL(palette.colors.warning),
    );
    root.style.setProperty("--theme-danger", extractHSL(palette.colors.danger));

    // Force re-render of components
    setSelectedPalette(paletteKey);
    setUpdateKey((prev) => prev + 1);

    // Log with visual indicator
  };

  if (!mounted) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Runtime Palette Switcher</h3>
          <p className="text-sm text-default-500">
            Click any palette to switch colors instantly. Changes are applied in
            real-time!
          </p>
          <div className="flex items-start gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <svg
              className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <div className="text-xs text-primary-800 dark:text-primary-200">
              <strong>Production Note:</strong> For permanent palette changes,
              update{" "}
              <code className="bg-primary-100 dark:bg-primary-900 px-1 rounded">
                DEFAULT_PALETTE
              </code>{" "}
              in{" "}
              <code className="bg-primary-100 dark:bg-primary-900 px-1 rounded">
                config/theme-config.ts
              </code>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {Object.entries(COLOR_PALETTES).map(([key, palette]) => (
            <Button
              key={key}
              className="h-auto py-3 flex-col items-start"
              color={selectedPalette === key ? "primary" : "default"}
              variant={selectedPalette === key ? "solid" : "bordered"}
              onClick={() => applyPalette(key)}
            >
              <span className="font-semibold text-sm">{palette.name}</span>
              <div className="flex gap-1 mt-2">
                {Object.values(palette.colors)
                  .slice(0, 3)
                  .map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-white/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
              </div>
            </Button>
          ))}
        </div>

        {selectedPalette !== "ocean" && (
          <div className="flex items-center justify-center p-4 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200 dark:border-success-800">
            <svg
              className="w-5 h-5 text-success-600 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            <p className="text-sm text-success-800 dark:text-success-200">
              Palette changed to{" "}
              <strong>{COLOR_PALETTES[selectedPalette]?.name}</strong> - Colors
              updated!
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
