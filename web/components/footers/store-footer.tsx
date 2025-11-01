"use client";

import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";

export function StoreFooter({ storeCode }: { storeCode?: string }) {
  return (
    <footer className="bg-background border-t border-divider mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-foreground/60 gap-4">
          <p>&copy; 2025 {storeCode || "Hatiri"} Store. All rights reserved.</p>
          <div className="flex gap-4">
            <Button
              as="a"
              href="#"
              size="sm"
              variant="light"
              className="text-foreground/60"
            >
              About
            </Button>
            <Button
              as="a"
              href="#"
              size="sm"
              variant="light"
              className="text-foreground/60"
            >
              Contact
            </Button>
            <Button
              as="a"
              href="#"
              size="sm"
              variant="light"
              className="text-foreground/60"
            >
              Privacy
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
