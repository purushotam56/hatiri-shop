/**
 * Palette Tester - Debug Component
 * Tests if CSS variables are being properly injected
 */

"use client";

import { Card, CardBody } from "@heroui/card";
import { useEffect, useState } from "react";

export function PaletteTester() {
  const [cssVars, setCssVars] = useState<Record<string, string>>({});
  const [updateKey, setUpdateKey] = useState(0);

  const readCSSVariables = () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);

    setCssVars({
      primary: computedStyle.getPropertyValue("--theme-primary").trim(),
      secondary: computedStyle.getPropertyValue("--theme-secondary").trim(),
      accent: computedStyle.getPropertyValue("--theme-accent").trim(),
      success: computedStyle.getPropertyValue("--theme-success").trim(),
      warning: computedStyle.getPropertyValue("--theme-warning").trim(),
      danger: computedStyle.getPropertyValue("--theme-danger").trim(),
    });
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      readCSSVariables();
    });

    // Poll for changes (in case CSS variables are updated)
    const interval = setInterval(readCSSVariables, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardBody>
        <h3 className="text-lg font-bold mb-4">CSS Variables Debug</h3>
        <div className="space-y-2 font-mono text-xs">
          {Object.entries(cssVars).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-default-500">--theme-{key}:</span>
              <span className="text-foreground">{value || "NOT SET"}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="h-12 bg-primary rounded" title="primary" />
          <div className="h-12 bg-secondary rounded" title="secondary" />
          <div className="h-12 bg-success rounded" title="success" />
        </div>
      </CardBody>
    </Card>
  );
}
