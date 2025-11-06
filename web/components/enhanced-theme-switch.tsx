/**
 * Enhanced Theme Switcher
 * Allows switching between light/dark modes with visual feedback
 */

"use client";

import { FC } from "react";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { useTheme } from "@/hooks/use-theme";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";

export interface EnhancedThemeSwitchProps {
  className?: string;
  showLabel?: boolean;
}

export const EnhancedThemeSwitch: FC<EnhancedThemeSwitchProps> = ({
  className,
  showLabel = false,
}) => {
  const { theme, setTheme, isDark, mounted, palette } = useTheme();

  if (!mounted) {
    return null;
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          className={className}
          startContent={
            isDark ? (
              <MoonFilledIcon size={20} />
            ) : (
              <SunFilledIcon size={20} />
            )
          }
        >
          {showLabel && (isDark ? "Dark" : "Light")}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme selection"
        selectedKeys={[theme || "system"]}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;
          setTheme(selected);
        }}
      >
        <DropdownItem
          key="light"
          startContent={<SunFilledIcon size={18} />}
          description="Light theme"
        >
          Light
        </DropdownItem>
        <DropdownItem
          key="dark"
          startContent={<MoonFilledIcon size={18} />}
          description="Dark theme"
        >
          Dark
        </DropdownItem>
        <DropdownItem
          key="system"
          startContent={
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          description="Follow system"
        >
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
