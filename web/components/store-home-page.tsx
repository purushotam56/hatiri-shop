import React from "react";
import { Product } from "./product";
import { CartSidebar } from "./cart-sidebar";

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
  "dairy": "�",
  "bakery": "🍞",
};

const getCategoryEmoji = (categoryName: string): string => {
  return CATEGORY_EMOJIS[categoryName.toLowerCase()] || "📦";
};

const extractCategoriesFromProducts = (products: ProductType[]): string[] => {
  const categories = new Set<string>();
  categories.add("All"); // Always add "All" category
  
  products.forEach((product) => {
    if (product.category && product.category.trim()) {
      categories.add(product.category.trim());
    }
  });
  
  return Array.from(categories);
};

const getGroupedProducts = (products: ProductType[]) => {
  const grouped: { [key: string]: ProductType[] } = {};

  products.forEach((product) => {
    const skuParts = product.sku?.split("-") || [];
    const baseSku =
      skuParts.slice(0, -1).join("-") || product.sku || product.name;

    if (!grouped[baseSku]) {
      grouped[baseSku] = [];
    }
    grouped[baseSku].push(product);
  });

  return Object.values(grouped).map((variants) => ({
    baseProduct: variants[0],
    variants,
  }));
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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-slate-600 text-xl font-semibold">Store not found</p>
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
  const groupedProducts = getGroupedProducts(products);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-b from-white via-white to-white shadow-xl border-b-2 border-blue-100/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-6">
            {/* Logo Section */}
            <div className="flex items-center gap-3 min-w-fit">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-md">
                {storeCode.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-xl text-slate-900">
                  {storeCode}
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  ⚡ 10 mins delivery
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="🔍 Search products..."
                  className="w-full px-4 py-3 rounded-full bg-slate-100 border-2 border-slate-200 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Cart Button - Client Component */}
            <CartSidebar />
          </div>
        </div>

        {/* Divider Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-blue-200/40 to-transparent"></div>

        {/* Category Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 whitespace-nowrap pb-1">
            {allCategories.map((category: any) => (
              <button
                key={category.slug || category.name}
                className="px-5 py-2.5 rounded-full font-semibold text-sm bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md border border-slate-200/50 transition-all duration-300"
              >
                <span className="text-base">{getCategoryEmoji(category.name)}</span>
                <span className="hidden sm:inline ml-2">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Smooth scroll indicator */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        <div className="px-4 py-8">
          {/* Results Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              All Products
            </h2>
            <p className="text-slate-600 font-medium">
              {products.length} product{products.length !== 1 ? "s" : ""}{" "}
              available
            </p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-300">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-slate-600 text-xl font-semibold mb-2">
                No products available
              </p>
              <p className="text-slate-500">Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {groupedProducts.map((group) => (
                <Product
                  key={group.baseProduct.id}
                  group={group}
                  onProductClick={(id) => `/product/${id}`}
                  getCategoryEmoji={getCategoryEmoji}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
