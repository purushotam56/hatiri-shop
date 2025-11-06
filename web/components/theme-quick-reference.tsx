/**
 * Theme Quick Reference
 * Quick guide for using theme colors in your components
 */

"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Snippet } from "@heroui/snippet";
import { Tabs, Tab } from "@heroui/tabs";

export function ThemeQuickReference() {
  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-xl font-bold">Quick Reference</h3>
      </CardHeader>
      <CardBody>
        <Tabs aria-label="Theme usage examples">
          <Tab key="tailwind" title="Tailwind Classes">
            <div className="space-y-3 pt-4">
              <div>
                <p className="text-sm font-semibold mb-2">Background Colors:</p>
                <div className="space-y-1">
                  <Snippet size="sm" symbol="">bg-primary</Snippet>
                  <Snippet size="sm" symbol="">bg-secondary</Snippet>
                  <Snippet size="sm" symbol="">bg-success</Snippet>
                  <Snippet size="sm" symbol="">bg-warning</Snippet>
                  <Snippet size="sm" symbol="">bg-danger</Snippet>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-semibold mb-2">Text Colors:</p>
                <div className="space-y-1">
                  <Snippet size="sm" symbol="">text-primary</Snippet>
                  <Snippet size="sm" symbol="">text-primary-foreground</Snippet>
                </div>
              </div>
            </div>
          </Tab>
          
          <Tab key="components" title="Components">
            <div className="space-y-3 pt-4">
              <div>
                <p className="text-sm font-semibold mb-2">Buttons:</p>
                <Snippet size="sm" symbol="">{`<Button color="primary">Click</Button>`}</Snippet>
              </div>
              
              <div>
                <p className="text-sm font-semibold mb-2">Chips:</p>
                <Snippet size="sm" symbol="">{`<Chip color="success">Status</Chip>`}</Snippet>
              </div>
              
              <div>
                <p className="text-sm font-semibold mb-2">Cards:</p>
                <Snippet size="sm" symbol="">{`<Card className="bg-primary" />`}</Snippet>
              </div>
            </div>
          </Tab>
          
          <Tab key="hook" title="Custom Hook">
            <div className="space-y-3 pt-4">
              <Snippet size="sm" symbol="" className="w-full">
                {`const { theme, isDark, palette } = useTheme();`}
              </Snippet>
              
              <div className="text-sm space-y-2 mt-4">
                <p><code className="bg-default-100 px-2 py-1 rounded">theme</code> - Current theme: "light" | "dark"</p>
                <p><code className="bg-default-100 px-2 py-1 rounded">isDark</code> - Boolean for dark mode</p>
                <p><code className="bg-default-100 px-2 py-1 rounded">palette</code> - Current color palette</p>
                <p><code className="bg-default-100 px-2 py-1 rounded">setTheme()</code> - Change theme</p>
              </div>
            </div>
          </Tab>
          
          <Tab key="config" title="Configuration">
            <div className="space-y-3 pt-4">
              <div>
                <p className="text-sm font-semibold mb-2">Change Palette:</p>
                <Snippet size="sm" symbol="" className="w-full">
                  {`// config/theme-config.ts\nexport const DEFAULT_PALETTE = "ocean";`}
                </Snippet>
              </div>
              
              <div>
                <p className="text-sm font-semibold mb-2">Available Palettes:</p>
                <div className="text-xs space-y-1 mt-2">
                  <p>ocean, sunset, forest, royal, cherry,</p>
                  <p>slate, mint, cosmic, monochrome</p>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  );
}
