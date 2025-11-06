import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Product } from "./product";
import { apiEndpoints } from "@/lib/api-client";
import Link from "next/link";

// Helper function for category emoji - accepts category object or string
const getCategoryEmoji = (categoryOrName: any): string => {
    // If it's a category object with emoji, use it
    if (typeof categoryOrName === 'object' && categoryOrName?.emoji) {
        return categoryOrName.emoji;
    }
    // Otherwise just return a default emoji
    return "📦";
};

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

// Static Category Sidebar (No interactions)
function CategorySidebar({ categories, selectedCategoryId, currentPath }: { categories: any[]; selectedCategoryId?: string; currentPath: string }) {
    const isAllSelected = !selectedCategoryId;
    
    return (
        <aside className="hidden lg:block w-64 bg-content1 border-r border-divider flex-shrink-0 h-[calc(100vh - 80px)]">
            <Card className="h-full" radius="none" shadow="none">
                <CardHeader className="pb-2">
                    <h2 className="text-lg font-semibold text-foreground">Categories</h2>
                </CardHeader>
                <Divider />
                <CardBody className="p-0">
                    <ScrollShadow className="h-full">
                        <div className="flex flex-col gap-1 p-2">
                            {/* All Products */}
                            <Link href={currentPath} className="block">
                                <div className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                                    isAllSelected 
                                        ? 'bg-primary/10 text-primary' 
                                        : 'text-default-700 hover:bg-default-100'
                                }`}>
                                    <span className="mr-2">🏪</span>
                                    All Products
                                </div>
                            </Link>

                            {/* Category List */}
                            {categories.map((category: any) => {
                                const isSelected = selectedCategoryId === String(category.id);
                                return (
                                    <Link 
                                        key={category.id} 
                                        href={`${currentPath}?category=${category.id}`}
                                        className="block"
                                    >
                                        <div className={`px-4 py-3 rounded-lg transition-colors ${
                                            isSelected 
                                                ? 'bg-primary/10 text-primary font-medium' 
                                                : 'text-default-700 hover:bg-default-100'
                                        }`}>
                                            <span className="mr-2">{getCategoryEmoji(category)}</span>
                                            {category.name}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </ScrollShadow>
                </CardBody>
            </Card>
        </aside>
    );
}

// Static Mobile Sidebar (No interactions)
function MobileSidebar({ categories, selectedCategoryId, currentPath }: { categories: any[]; selectedCategoryId?: string; currentPath: string }) {
    const isAllSelected = !selectedCategoryId;
    
    return (
        <ScrollShadow className="h-full">
            <div className="flex flex-col gap-2 py-4">
                {/* All Products */}
                <Link href={currentPath}>
                    <div className={`flex flex-col items-center justify-center p-3 rounded-lg mx-2 transition-colors ${
                        isAllSelected 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-default-100'
                    }`}>
                        <span className="text-2xl">🏪</span>
                        <span className="text-[10px] mt-1 font-medium text-center">All</span>
                    </div>
                </Link>

                {/* Categories */}
                {categories.map((category: any) => {
                    const isSelected = selectedCategoryId === String(category.id);
                    return (
                        <Link key={category.id} href={`${currentPath}?category=${category.id}`}>
                            <div className={`flex flex-col items-center justify-center p-3 rounded-lg mx-2 transition-colors ${
                                isSelected 
                                    ? 'bg-primary/10 text-primary' 
                                    : 'hover:bg-default-100'
                            }`}>
                                <span className="text-2xl">{getCategoryEmoji(category)}</span>
                                <span className="text-[10px] mt-1 text-center line-clamp-2">
                                    {category.name}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </ScrollShadow>
    );
}

// Main Content Component
function MainContent({ products }: { products: any[] }) {
    return (
        <main className="flex-1 bg-background lg:ml-0 ml-20 overflow-hidden h-full">
            <ScrollShadow className="h-full">
                <div className="container mx-auto p-4 lg:p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-bold text-foreground">All Products</h1>
                            <Chip color="primary" variant="flat" size="lg">
                                {products.length} items
                            </Chip>
                        </div>
                        <Divider />
                    </div>

                    {/* Products Grid */}
                    <div className="pb-8">
                        {products.length === 0 ? (
                            <Card className="p-8">
                                <CardBody>
                                    <div className="text-center text-default-500">
                                        <p className="text-lg font-medium mb-2">No products found</p>
                                        <p className="text-sm">Try browsing all categories</p>
                                    </div>
                                </CardBody>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                </div>
            </ScrollShadow>
        </main>
    );
}

// Fetch server-side data
async function fetchStoreData(code: string,categoryId?:string) {
  try {
    // Fetch all organisations to find the one with matching code
    const orgsData = await apiEndpoints.getOrganisations();
    const org = orgsData.organisations?.find(
      (o: any) => o.organisationUniqueCode === code
    );

    if (!org) throw new Error("Store not found");

    // Fetch products - filter by organisation on the backend or here
    const prodsData = await apiEndpoints.getProductsByOrg(org.id,categoryId ? `categoryId=${categoryId}`: undefined);
    const products = prodsData.data.data || [];
    
    // Filter products by organisation ID
    // const products = Array.isArray(allProducts) 
    //   ? allProducts.filter((p: any) => p.organisationId === org.id || p.organisationId === String(org.id))
    //   : [];

    // Fetch categories for this organisation
    const categoriesData = await apiEndpoints.getOrganisationCategories(org.id);
    const categories = Array.isArray(categoriesData.data) 
      ? categoriesData.data 
      : (Array.isArray(categoriesData) ? categoriesData : []);

    return {
      organisation: org,
      products,
      categories,
    };
  } catch (error) {
    console.error("Failed to load store:", error);
    return null;
  }
}

// Main Store Home Page Component - Server Component
export async function StoreHomePage({ storeCode, selectedCategoryId }: { storeCode: string; selectedCategoryId?: string }) {
  const data = await fetchStoreData(storeCode,selectedCategoryId);

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardBody className="gap-4 py-8 text-center items-center">
            <div className="text-6xl">❌</div>
            <div>
              <p className="text-foreground/60 text-xl font-semibold">
                Store not found
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  const { products, categories } = data;
  
  // Filter products by category if selectedCategoryId is provided
  const filteredProducts = selectedCategoryId 
    ? products.filter((p: any) => String(p.categoryId) === selectedCategoryId)
    : products;
  
  const currentPath = `/store/${storeCode.toLowerCase()}`;

  return (
    <div className="flex flex-col lg:flex-row bg-default-50 min-h-screen overflow-hidden h-[calc(100vh - 300px)]">
      {/* Mobile Sidebar - Absolute positioned */}
      <Card 
        className="lg:hidden absolute left-0 z-30 w-20 h-full" 
        radius="none" 
        shadow="sm"
      >
        <CardBody className="p-0">
          <MobileSidebar 
            categories={categories} 
            selectedCategoryId={selectedCategoryId}
            currentPath={currentPath}
          />
        </CardBody>
      </Card>

      {/* Desktop Sidebar */}
      <CategorySidebar 
        categories={categories} 
        selectedCategoryId={selectedCategoryId}
        currentPath={currentPath}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh - 80px)]">
        <MainContent products={filteredProducts} />
      </div>
    </div>
  );
}
