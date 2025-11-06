/**
 * Visual Palette Comparison
 * Shows current active colors vs all available palettes
 */

"use client";

import { useState, useEffect } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { COLOR_PALETTES } from "@/config/theme-config";
import { Button } from "@heroui/button";

export function VisualPaletteComparison() {
  const [currentColors, setCurrentColors] = useState<Record<string, string>>({});

  const readCurrentColors = () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    setCurrentColors({
      primary: computedStyle.getPropertyValue('--theme-primary').trim(),
      secondary: computedStyle.getPropertyValue('--theme-secondary').trim(),
    });
  };

  useEffect(() => {
    readCurrentColors();
    const interval = setInterval(readCurrentColors, 300);
    return () => clearInterval(interval);
  }, []);

  const extractHSL = (hslString: string) => {
    const match = hslString.match(/hsl\(([^)]+)\)/);
    return match ? match[1] : "0, 0%, 0%";
  };

  const matchesCurrent = (paletteKey: string) => {
    const palette = COLOR_PALETTES[paletteKey];
    const palettePrimary = extractHSL(palette.colors.primary);
    const paletteSecondary = extractHSL(palette.colors.secondary);
    
    return (
      currentColors.primary === palettePrimary &&
      currentColors.secondary === paletteSecondary
    );
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <h3 className="text-lg font-bold">Active Palette Detector</h3>
          <p className="text-xs text-default-500 mt-1">
            Shows which palette is currently active
          </p>
        </div>
      </CardHeader>
      <CardBody>
        <div className="space-y-2">
          {Object.entries(COLOR_PALETTES).map(([key, palette]) => {
            const isActive = matchesCurrent(key);
            const primary = extractHSL(palette.colors.primary);
            const secondary = extractHSL(palette.colors.secondary);
            
            return (
              <div
                key={key}
                className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                  isActive 
                    ? "border-primary bg-primary/10" 
                    : "border-default-200 bg-default-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div
                      className="w-8 h-8 rounded border border-default-300"
                      style={{ backgroundColor: `hsl(${primary})` }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded border border-default-300"
                      style={{ backgroundColor: `hsl(${secondary})` }}
                      title="Secondary"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{palette.name}</p>
                    <p className="text-xs text-default-500">{key}</p>
                  </div>
                </div>
                {isActive && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs font-semibold text-success">ACTIVE</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-default-100 rounded-lg">
          <p className="text-xs text-default-600">
            <strong>Current CSS Variables:</strong>
          </p>
          <div className="font-mono text-xs mt-2 space-y-1">
            <div>primary: {currentColors.primary || "not set"}</div>
            <div>secondary: {currentColors.secondary || "not set"}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
