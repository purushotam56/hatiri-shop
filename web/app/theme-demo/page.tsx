/**
 * Theme Demo Page
 * Showcases all color palettes and theme features
 */

import { PaletteShowcase } from "@/components/palette-showcase";
import { EnhancedThemeSwitch } from "@/components/enhanced-theme-switch";
import { ThemeQuickReference } from "@/components/theme-quick-reference";
import { RuntimePaletteSelector } from "@/components/runtime-palette-selector";
import { PaletteTester } from "@/components/palette-tester";
import { ThemeSystemStatus } from "@/components/theme-system-status";
import { HeroUIShowcase } from "@/components/heroui-showcase";
import { VisualPaletteComparison } from "@/components/visual-palette-comparison";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";

export default function ThemeDemoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">Theme System Demo</h1>
            <p className="text-default-600">
              Complete theming system with dark/light modes and multiple color palettes
            </p>
          </div>
          <EnhancedThemeSwitch showLabel />
        </div>

        {/* Theme System Status */}
        <div className="mb-8">
          <ThemeSystemStatus />
        </div>

        {/* Quick Reference */}
        <div className="mb-8">
          <ThemeQuickReference />
        </div>

        {/* Runtime Palette Switcher */}
        <div className="mb-8">
          <RuntimePaletteSelector />
        </div>

        {/* Visual Palette Comparison */}
        <div className="mb-8">
          <VisualPaletteComparison />
        </div>

        {/* HeroUI Components Showcase */}
        <div className="mb-8">
          <HeroUIShowcase />
        </div>

        {/* Theme Colors Demo */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold">Current Theme Colors</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-2">
                <div className="bg-primary h-20 rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold">Primary</span>
                </div>
                <p className="text-xs text-center">bg-primary</p>
              </div>
              <div className="space-y-2">
                <div className="bg-secondary h-20 rounded-lg flex items-center justify-center">
                  <span className="text-secondary-foreground font-semibold">Secondary</span>
                </div>
                <p className="text-xs text-center">bg-secondary</p>
              </div>
              <div className="space-y-2">
                <div className="bg-success h-20 rounded-lg flex items-center justify-center">
                  <span className="text-success-foreground font-semibold">Success</span>
                </div>
                <p className="text-xs text-center">bg-success</p>
              </div>
              <div className="space-y-2">
                <div className="bg-warning h-20 rounded-lg flex items-center justify-center">
                  <span className="text-warning-foreground font-semibold">Warning</span>
                </div>
                <p className="text-xs text-center">bg-warning</p>
              </div>
              <div className="space-y-2">
                <div className="bg-danger h-20 rounded-lg flex items-center justify-center">
                  <span className="text-danger-foreground font-semibold">Danger</span>
                </div>
                <p className="text-xs text-center">bg-danger</p>
              </div>
              <div className="space-y-2">
                <div className="bg-default h-20 rounded-lg flex items-center justify-center border border-default-200">
                  <span className="text-default-foreground font-semibold">Default</span>
                </div>
                <p className="text-xs text-center">bg-default</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Component Examples */}
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl font-bold">Component Examples</h2>
          </CardHeader>
          <CardBody className="space-y-6">
            {/* Buttons */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button color="primary">Primary</Button>
                <Button color="secondary">Secondary</Button>
                <Button color="success">Success</Button>
                <Button color="warning">Warning</Button>
                <Button color="danger">Danger</Button>
                <Button color="default">Default</Button>
              </div>
            </div>

            {/* Button Variants */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Button Variants</h3>
              <div className="flex flex-wrap gap-3">
                <Button color="primary" variant="solid">Solid</Button>
                <Button color="primary" variant="bordered">Bordered</Button>
                <Button color="primary" variant="light">Light</Button>
                <Button color="primary" variant="flat">Flat</Button>
                <Button color="primary" variant="faded">Faded</Button>
                <Button color="primary" variant="shadow">Shadow</Button>
                <Button color="primary" variant="ghost">Ghost</Button>
              </div>
            </div>

            {/* Chips */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Chips</h3>
              <div className="flex flex-wrap gap-3">
                <Chip color="primary">Primary</Chip>
                <Chip color="secondary">Secondary</Chip>
                <Chip color="success">Success</Chip>
                <Chip color="warning">Warning</Chip>
                <Chip color="danger">Danger</Chip>
                <Chip color="default">Default</Chip>
              </div>
            </div>

            {/* Cards */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Cards with Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-primary text-primary-foreground">
                  <CardBody>
                    <h4 className="font-semibold mb-1">Primary Card</h4>
                    <p className="text-sm opacity-80">Card with primary background</p>
                  </CardBody>
                </Card>
                <Card className="bg-secondary text-secondary-foreground">
                  <CardBody>
                    <h4 className="font-semibold mb-1">Secondary Card</h4>
                    <p className="text-sm opacity-80">Card with secondary background</p>
                  </CardBody>
                </Card>
                <Card className="bg-success text-success-foreground">
                  <CardBody>
                    <h4 className="font-semibold mb-1">Success Card</h4>
                    <p className="text-sm opacity-80">Card with success background</p>
                  </CardBody>
                </Card>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Palette Showcase */}
        <PaletteShowcase />
      </div>
    </div>
  );
}
