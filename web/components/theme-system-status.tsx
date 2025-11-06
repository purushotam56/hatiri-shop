/**
 * Theme System Status
 * Shows real-time status of theme system
 */

"use client";

import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { useTheme } from "@/hooks/use-theme";

export function ThemeSystemStatus() {
  const { theme, isDark, palette, mounted } = useTheme();
  const [cssVars, setCssVars] = useState<Record<string, string>>({});
  const [testColor, setTestColor] = useState(0);

  useEffect(() => {
    const readVars = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      setCssVars({
        primary: computedStyle.getPropertyValue('--theme-primary').trim(),
        secondary: computedStyle.getPropertyValue('--theme-secondary').trim(),
      });
    };

    readVars();
    const interval = setInterval(readVars, 500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return <div>Loading theme...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Theme Status */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold">Theme Status</h3>
        </CardHeader>
        <CardBody className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-default-500">Current Mode:</span>
            <Chip color={isDark ? "secondary" : "warning"} variant="flat">
              {theme}
            </Chip>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-default-500">Active Palette:</span>
            <Chip color="primary" variant="flat">
              {palette.name}
            </Chip>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-default-500">Mounted:</span>
            <Chip color="success" variant="flat">
              {mounted ? "Yes" : "No"}
            </Chip>
          </div>
        </CardBody>
      </Card>

      {/* CSS Variables */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold">CSS Variables</h3>
        </CardHeader>
        <CardBody className="space-y-2">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-default-500">--theme-primary:</span>
            <span className="text-foreground">{cssVars.primary || "NOT SET"}</span>
          </div>
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-default-500">--theme-secondary:</span>
            <span className="text-foreground">{cssVars.secondary || "NOT SET"}</span>
          </div>
          <div className="mt-4 flex gap-2">
            <div 
              className="flex-1 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold"
            >
              PRIMARY
            </div>
            <div 
              className="flex-1 h-12 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold"
            >
              SECONDARY
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Component Test */}
      <Card className="md:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-bold">Component Color Test</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-3 mb-4">
            <Button color="primary" size="sm" onPress={() => setTestColor(testColor + 1)}>
              Primary Button
            </Button>
            <Button color="secondary" size="sm" variant="flat">
              Secondary
            </Button>
            <Button color="success" size="sm" variant="bordered">
              Success
            </Button>
            <Button color="warning" size="sm">
              Warning
            </Button>
            <Button color="danger" size="sm" variant="light">
              Danger
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Chip color="primary" size="sm">Primary Chip</Chip>
            <Chip color="secondary" size="sm">Secondary</Chip>
            <Chip color="success" size="sm">Success</Chip>
            <Chip color="warning" size="sm">Warning</Chip>
            <Chip color="danger" size="sm">Danger</Chip>
          </div>

          <p className="text-xs text-default-500 mt-4">
            Click buttons to verify reactivity. Colors should match the selected palette.
            Update counter: {testColor}
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
