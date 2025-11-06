/**
 * Palette Showcase Component
 * Visual display of all available color palettes
 * Useful for testing and selecting palettes
 */

"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { COLOR_PALETTES, getActivePalette } from "@/config/theme-config";

export function PaletteShowcase() {
  const activePalette = getActivePalette();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Available Color Palettes</h2>
        <p className="text-default-600">
          Currently using: <strong>{activePalette.name}</strong> - {activePalette.description}
        </p>
        <p className="text-sm text-default-500 mt-2">
          To change the palette, edit <code className="bg-default-100 px-2 py-1 rounded">DEFAULT_PALETTE</code> in{" "}
          <code className="bg-default-100 px-2 py-1 rounded">config/theme-config.ts</code>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(COLOR_PALETTES).map(([key, palette]) => {
          const isActive = palette.name === activePalette.name;
          
          return (
            <Card
              key={key}
              className={`${
                isActive ? "ring-2 ring-primary" : ""
              }`}
            >
              <CardHeader className="flex-col items-start gap-1">
                <div className="flex items-center gap-2 w-full">
                  <h3 className="text-lg font-semibold">{palette.name}</h3>
                  {isActive && (
                    <Chip size="sm" color="primary" variant="flat">
                      Active
                    </Chip>
                  )}
                </div>
                <p className="text-sm text-default-500">{palette.description}</p>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(palette.colors).map(([colorName, colorValue]) => (
                    <div key={colorName} className="space-y-1">
                      <div
                        className="h-12 rounded-lg border border-default-200"
                        style={{ backgroundColor: colorValue }}
                      />
                      <p className="text-xs text-center capitalize">{colorName}</p>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
