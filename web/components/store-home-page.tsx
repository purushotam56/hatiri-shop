import React from "react";
import { Product } from "./product";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import { ScrollShadow } from "@heroui/scroll-shadow";

interface ProductType {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  sku?: string;
  unit?: string;
  category?: string;
  imageUrl?: string | null;
  options?: string | any[];
}

// Category emoji mapping for display
const CATEGORY_EMOJIS: { [key: string]: string } = {
  "all": "🏪",
  "milk": "🥛",
  "snacks": "🍿",
  "vegetables": "🥬",
  "fruits": "🍎",
  "beverages": "🥤",
  "dairy": "🧀",
  "bakery": "🍞",
};

const getCategoryEmoji = (categoryName: string): string => {
  return CATEGORY_EMOJIS[categoryName.toLowerCase()] || "📦";
};

async function fetchStoreData(code: string) {
  try {
    const orgsRes = await fetch("http://localhost:3333/api/organisations", {
      next: { revalidate: 60 },
    });
    const orgsData = await orgsRes.json();
    const org = orgsData.organisations.find(
      (o: any) => o.organisationUniqueCode === code
    );

    if (!org) throw new Error("Store not found");

    const prodsRes = await fetch(
      `http://localhost:3333/api/products?organisationId=${org.id}`,
      {
        next: { revalidate: 60 },
      }
    );
    const prodsData = await prodsRes.json();

    // Fetch categories for this organisation
    const categoriesRes = await fetch(
      `http://localhost:3333/api/organisation/${org.id}/categories`,
      {
        next: { revalidate: 60 },
      }
    );
    const categoriesData = await categoriesRes.json();

    return {
      organisation: org,
      products: prodsData.data.data || [],
      categories: categoriesData.data || [],
    };
  } catch (error) {
    console.error("Failed to load store:", error);
    return null;
  }
}

export async function StoreHomePage({ storeCode }: { storeCode: string }) {
  const data = await fetchStoreData(storeCode);

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardBody className="gap-4 py-8 text-center items-center">
            <div className="text-6xl">❌</div>
            <div>
              <p className="text-foreground/60 text-xl font-semibold">Store not found</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const { products, categories } = data;
  // Add "All" category at the beginning
  const allCategories = [
    { name: "All", slug: "all" },
    ...categories,
  ];

  return (
    <div className="bg-background">
      {/* Mobile Category Bar - First on mobile */}
      <ScrollShadow hideScrollBar className="w-full bg-default-50 border-b border-divider lg:hidden">
        <div className="flex gap-2 p-2 sm:p-3 whitespace-nowrap">
          {allCategories.map((category: any) => (
            <Chip
              key={category.slug || category.name}
              avatar={<span className="text-base">{getCategoryEmoji(category.name)}</span>}
              variant="flat"
              className="flex-shrink-0 text-xs sm:text-sm"
              classNames={{
                content: "gap-1",
              }}
            >
              {category.name}
            </Chip>
          ))}
        </div>
      </ScrollShadow>

      <div className="flex flex-col lg:flex-row">
        {/* Vertical Category Sidebar - Hidden on mobile, shown on desktop */}
        <ScrollShadow hideScrollBar className="hidden lg:block lg:w-48 bg-default-50 border-r border-divider min-h-screen sticky top-16 overflow-y-auto">
          <div className="p-3 sm:p-4 space-y-2">
            {allCategories.map((category: any) => (
              <Button
                key={category.slug || category.name}
                className="w-full justify-start px-3 sm:px-4 py-2 sm:py-3 text-sm"
                variant="light"
                startContent={<span className="text-base">{getCategoryEmoji(category.name)}</span>}
              >
                <span className="truncate text-left">{category.name}</span>
              </Button>
            ))}
          </div>
        </ScrollShadow>

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div className="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6">
            {/* Results Header */}
            <div className="mb-4 sm:mb-5 md:mb-6">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground mb-2">
                All Products
              </h2>
              <Chip
                variant="flat"
                className="text-xs sm:text-sm"
              >
                {products.length} product{products.length !== 1 ? "s" : ""} available
              </Chip>
            </div>

            {products.length === 0 ? (
              <Card className="py-12 sm:py-16 md:py-20">
                <CardBody className="gap-4 flex items-center justify-center text-center">
                  <div className="text-5xl sm:text-6xl">🔍</div>
                  <div>
                    <p className="text-foreground text-base sm:text-lg font-semibold mb-1">
                      No products available
                    </p>
                    <p className="text-foreground/60 text-sm sm:text-base">Check back soon!</p>
                  </div>
                </CardBody>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {products.map((product: any) => (
                  <Product
                    key={product.id}
                    group={product}
                    onProductClick={(id) => `/product/${id}`}
                    getCategoryEmoji={getCategoryEmoji}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
