"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

type PageType = "about" | "contact";

interface MenuItem {
  id: PageType;
  name: string;
  description: string;
  icon: string;
  href: string;
}

const MENU_PAGES: MenuItem[] = [
  {
    id: "about",
    name: "About",
    description: "Edit your store's about page with rich text",
    icon: "📄",
    href: "about",
  },
  {
    id: "contact",
    name: "Contact Us",
    description: "Edit your store's contact information and address",
    icon: "📞",
    href: "contact",
  },
];

export default function SellerPagesPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id as string;
  const [storeLoaded, setStoreLoaded] = useState(false);

  useEffect(() => {
    // Check for token - if no token, redirect to login
    const token = localStorage.getItem("sellerToken");

    if (!token) {
      router.push("/seller/login");

      return;
    }

    // If we have orgId and token, we can proceed
    // Use a micro-task to set state after effects
    Promise.resolve().then(() => {
      if (orgId && token) {
        setStoreLoaded(true);
      }
    });
  }, [orgId, router]);

  if (!storeLoaded) {
    return (
      <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Menu Pages
          </h1>
          <p className="text-foreground/70">
            Manage your store&apos;s publicly visible pages
          </p>
        </div>

        {/* Menu Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MENU_PAGES.map((page) => (
            <Link key={page.id} href={`/seller/${orgId}/pages/${page.href}`}>
              <Card
                isPressable
                className="h-full cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex gap-3">
                  <div className="text-4xl">{page.icon}</div>
                  <div className="flex flex-col">
                    <p className="text-lg font-semibold">{page.name}</p>
                    <p className="text-sm text-foreground/70">
                      {page.description}
                    </p>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="flex justify-between items-center">
                    <Chip color="primary" variant="flat">
                      Click to edit
                    </Chip>
                    <span className="text-foreground/50">→</span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        {/* Info Section */}
        <Card className="mt-8 bg-primary/10">
          <CardBody className="gap-4">
            <div>
              <h3 className="font-semibold mb-2">About Menu Pages</h3>
              <p className="text-sm text-foreground/80">
                These pages are displayed on your public store listing. Keep
                them updated to provide customers with accurate information
                about your store and how to contact you.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
