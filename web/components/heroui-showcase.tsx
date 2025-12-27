/**
 * Complete HeroUI Component Showcase
 * Tests all HeroUI components with theme colors
 */

"use client";

import { Avatar } from "@heroui/avatar";
import { Badge } from "@heroui/badge";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import { Switch } from "@heroui/switch";

export function HeroUIShowcase() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h3 className="text-xl font-bold">
            HeroUI Components - Theme Colors
          </h3>
        </CardHeader>
        <CardBody className="space-y-8">
          {/* Buttons Section */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">
              Buttons
            </h4>
            <div className="flex flex-wrap gap-3">
              <Button color="primary" size="sm">
                Primary
              </Button>
              <Button color="secondary" size="sm">
                Secondary
              </Button>
              <Button color="success" size="sm">
                Success
              </Button>
              <Button color="warning" size="sm">
                Warning
              </Button>
              <Button color="danger" size="sm">
                Danger
              </Button>
            </div>
          </div>

          {/* Button Variants */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">
              Button Variants (Primary)
            </h4>
            <div className="flex flex-wrap gap-3">
              <Button color="primary" size="sm" variant="solid">
                Solid
              </Button>
              <Button color="primary" size="sm" variant="bordered">
                Bordered
              </Button>
              <Button color="primary" size="sm" variant="light">
                Light
              </Button>
              <Button color="primary" size="sm" variant="flat">
                Flat
              </Button>
              <Button color="primary" size="sm" variant="faded">
                Faded
              </Button>
              <Button color="primary" size="sm" variant="shadow">
                Shadow
              </Button>
              <Button color="primary" size="sm" variant="ghost">
                Ghost
              </Button>
            </div>
          </div>

          {/* Chips */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">
              Chips
            </h4>
            <div className="flex flex-wrap gap-2">
              <Chip color="primary" size="sm">
                Primary
              </Chip>
              <Chip color="secondary" size="sm">
                Secondary
              </Chip>
              <Chip color="success" size="sm">
                Success
              </Chip>
              <Chip color="warning" size="sm">
                Warning
              </Chip>
              <Chip color="danger" size="sm">
                Danger
              </Chip>
            </div>
          </div>

          {/* Chip Variants */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">
              Chip Variants (Primary)
            </h4>
            <div className="flex flex-wrap gap-2">
              <Chip color="primary" size="sm" variant="solid">
                Solid
              </Chip>
              <Chip color="primary" size="sm" variant="bordered">
                Bordered
              </Chip>
              <Chip color="primary" size="sm" variant="light">
                Light
              </Chip>
              <Chip color="primary" size="sm" variant="flat">
                Flat
              </Chip>
              <Chip color="primary" size="sm" variant="faded">
                Faded
              </Chip>
              <Chip color="primary" size="sm" variant="dot">
                Dot
              </Chip>
            </div>
          </div>

          {/* Avatars with Badge */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">
              Avatars with Badges
            </h4>
            <div className="flex flex-wrap gap-4">
              <Badge color="primary" content="5">
                <Avatar
                  size="md"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                />
              </Badge>
              <Badge color="danger" content="99+">
                <Avatar
                  size="md"
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                />
              </Badge>
              <Badge color="success" content="" placement="bottom-right">
                <Avatar
                  size="md"
                  src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                />
              </Badge>
            </div>
          </div>

          {/* Inputs */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">
              Inputs
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                color="primary"
                label="Primary Input"
                placeholder="Enter text"
                size="sm"
              />
              <Input
                color="secondary"
                label="Secondary Input"
                placeholder="Enter text"
                size="sm"
              />
              <Input
                color="success"
                label="Success Input"
                placeholder="Enter text"
                size="sm"
              />
              <Input
                color="warning"
                label="Warning Input"
                placeholder="Enter text"
                size="sm"
              />
            </div>
          </div>

          {/* Progress Bars */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">
              Progress Bars
            </h4>
            <div className="space-y-3">
              <Progress color="primary" size="sm" value={65} />
              <Progress color="secondary" size="sm" value={45} />
              <Progress color="success" size="sm" value={85} />
              <Progress color="warning" size="sm" value={55} />
              <Progress color="danger" size="sm" value={25} />
            </div>
          </div>

          {/* Spinners */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-default-600">
              Spinners
            </h4>
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
            <h4 className="text-sm font-semibold mb-3 text-default-600">
              Switches
            </h4>
            <div className="flex flex-wrap gap-4">
              <Switch defaultSelected color="primary" size="sm">
                Primary
              </Switch>
              <Switch defaultSelected color="secondary" size="sm">
                Secondary
              </Switch>
              <Switch defaultSelected color="success" size="sm">
                Success
              </Switch>
              <Switch defaultSelected color="warning" size="sm">
                Warning
              </Switch>
              <Switch defaultSelected color="danger" size="sm">
                Danger
              </Switch>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <p className="text-xs text-default-500">
            All components automatically use the active theme palette. Switch
            palettes to see colors update in real-time.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
