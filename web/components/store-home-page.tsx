import React from "react";
import { Product } from "./product";
import { StoreHeader } from "./store-header";

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-foreground/60 text-xl font-semibold">Store not found</p>
        </div>
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <StoreHeader storeCode={storeCode} />

      <div className="flex">
        {/* Vertical Category Sidebar */}
        <aside className="hidden md:block w-48 bg-default-50 border-r border-divider min-h-screen sticky top-16 overflow-y-auto">
          <div className="p-4 space-y-2">
            {allCategories.map((category: any) => (
              <button
                key={category.slug || category.name}
                className="w-full text-left px-4 py-3 rounded-lg font-medium text-sm bg-background hover:bg-default-100 text-foreground transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-base">{getCategoryEmoji(category.name)}</span>
                <span className="truncate">{category.name}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Mobile Category Bar */}
        <div className="md:hidden w-full bg-default-50 border-b border-divider">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-2 p-3 whitespace-nowrap">
              {allCategories.map((category: any) => (
                <button
                  key={category.slug || category.name}
                  className="px-4 py-2 rounded-full font-medium text-sm bg-background text-foreground border border-divider hover:bg-default-100 transition-all flex-shrink-0 flex items-center gap-1"
                >
                  <span className="text-base">{getCategoryEmoji(category.name)}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="px-4 py-6 md:px-6">
            {/* Results Header */}
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                All Products
              </h2>
              <p className="text-sm text-foreground/60">
                {products.length} product{products.length !== 1 ? "s" : ""}{" "}
                available
              </p>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-20 bg-default-50 rounded-lg border border-divider">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-foreground text-lg font-semibold mb-2">
                  No products available
                </p>
                <p className="text-foreground/60">Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
