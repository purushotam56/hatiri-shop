/**
 * Complete HeroUI Component Showcase
 * Tests all HeroUI components with theme colors
 */

"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";

export function HeroUIShowcase() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">HeroUI Components - Theme Colors</h3>
        </CardHeader>
        <CardBody className="space-y-8">
          {/* Buttons Section */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button color="primary" size="sm">Primary</Button>
              <Button color="secondary" size="sm">Secondary</Button>
              <Button color="success" size="sm">Success</Button>
              <Button color="warning" size="sm">Warning</Button>
              <Button color="danger" size="sm">Danger</Button>
            </div>
          </div>

          {/* Button Variants */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">Button Variants (Primary)</h4>
            <div className="flex flex-wrap gap-3">
              <Button color="primary" variant="solid" size="sm">Solid</Button>
              <Button color="primary" variant="bordered" size="sm">Bordered</Button>
              <Button color="primary" variant="light" size="sm">Light</Button>
              <Button color="primary" variant="flat" size="sm">Flat</Button>
              <Button color="primary" variant="faded" size="sm">Faded</Button>
              <Button color="primary" variant="shadow" size="sm">Shadow</Button>
              <Button color="primary" variant="ghost" size="sm">Ghost</Button>
            </div>
          </div>

          {/* Chips */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">Chips</h4>
            <div className="flex flex-wrap gap-2">
              <Chip color="primary" size="sm">Primary</Chip>
              <Chip color="secondary" size="sm">Secondary</Chip>
              <Chip color="success" size="sm">Success</Chip>
              <Chip color="warning" size="sm">Warning</Chip>
              <Chip color="danger" size="sm">Danger</Chip>
            </div>
          </div>

          {/* Chip Variants */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">Chip Variants (Primary)</h4>
            <div className="flex flex-wrap gap-2">
              <Chip color="primary" variant="solid" size="sm">Solid</Chip>
              <Chip color="primary" variant="bordered" size="sm">Bordered</Chip>
              <Chip color="primary" variant="light" size="sm">Light</Chip>
              <Chip color="primary" variant="flat" size="sm">Flat</Chip>
              <Chip color="primary" variant="faded" size="sm">Faded</Chip>
              <Chip color="primary" variant="dot" size="sm">Dot</Chip>
            </div>
          </div>

          {/* Avatars with Badge */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">Avatars with Badges</h4>
            <div className="flex flex-wrap gap-4">
              <Badge content="5" color="primary">
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" size="md" />
              </Badge>
              <Badge content="99+" color="danger">
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" size="md" />
              </Badge>
              <Badge content="" color="success" placement="bottom-right">
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" size="md" />
              </Badge>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">Inputs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Primary Input" 
                placeholder="Enter text" 
                color="primary"
                size="sm"
              />
              <Input 
                label="Secondary Input" 
                placeholder="Enter text" 
                color="secondary"
                size="sm"
              />
              <Input 
                label="Success Input" 
                placeholder="Enter text" 
                color="success"
                size="sm"
              />
              <Input 
                label="Warning Input" 
                placeholder="Enter text" 
                color="warning"
                size="sm"
              />
            </div>
          </div>

          {/* Progress Bars */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">Progress Bars</h4>
            <div className="space-y-3">
              <Progress color="primary" value={65} size="sm" />
              <Progress color="secondary" value={45} size="sm" />
              <Progress color="success" value={85} size="sm" />
              <Progress color="warning" value={55} size="sm" />
              <Progress color="danger" value={25} size="sm" />
            </div>
          </div>

          {/* Spinners */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">Spinners</h4>
            <div className="flex flex-wrap gap-4">
              <Spinner color="primary" size="sm" />
              <Spinner color="secondary" size="sm" />
              <Spinner color="success" size="sm" />
              <Spinner color="warning" size="sm" />
              <Spinner color="danger" size="sm" />
            </div>
          </div>

          {/* Switches */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">Switches</h4>
            <div className="flex flex-wrap gap-4">
              <Switch color="primary" size="sm" defaultSelected>Primary</Switch>
              <Switch color="secondary" size="sm" defaultSelected>Secondary</Switch>
              <Switch color="success" size="sm" defaultSelected>Success</Switch>
              <Switch color="warning" size="sm" defaultSelected>Warning</Switch>
              <Switch color="danger" size="sm" defaultSelected>Danger</Switch>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <p className="text-xs text-default-500">
            All components automatically use the active theme palette. 
            Switch palettes to see colors update in real-time.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
