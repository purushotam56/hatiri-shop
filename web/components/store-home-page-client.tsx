"use client";

import React, { useState, useEffect } from "react";
import { Product } from "./product";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { apiEndpoints } from "@/lib/api-client";
import { Spinner } from "@heroui/spinner";

const CATEGORY_EMOJIS: { [key: string]: string } = {
    "all": "🏪",
    "milk": "🥛",
    "snacks": "🍿",
    "vegetables": "🥬",
    "fruits": "🍎",
    "beverages": "🥤",
    "dairy": "🧀",
    "bakery": "🍞",
    "home and furnishing": "🛋️",
    "top deals": "🎁",
    "bedsheets": "🛏️",
    "home decor": "🏠",
    "storage": "📦",
    "tissues": "🧻",
    "cleaning": "🧹",
    "party decor": "🎉",
    "air freshners": "💨",
    "gardening": "🌱",
    "bathware": "🛁",
    "utilities": "🔧",
    "pooja": "🙏",
    "appliances": "⚙️",
    "repellants": "🚫",
    "sports": "🏋️",
    "stationery": "📝",
};

const getCategoryEmoji = (category: any): string => {
    // First check if category has an icon from backend
    if (category.icon) return category.icon;
    if (category.emoji) return category.emoji;

    // Fall back to hardcoded mapping by name
    return CATEGORY_EMOJIS[category.name?.toLowerCase()] || "📦";
};

// Sidebar Category Component
interface CategorySidebarProps {
    categories: any[];
    selectedCategory: string | null;
    onCategorySelect: (slug: string | null) => void;
}

function CategorySidebar({
    categories,
    selectedCategory,
    onCategorySelect,
}: CategorySidebarProps) {
    const allCategories = [
        { name: "All", slug: "all", id: "all" },
        ...categories.map((cat: any) => ({
            ...cat,
            slug: cat.slug || String(cat.id),
            id: cat.id || cat.slug,
        })),
    ];

    return (
        <Card className="hidden lg:flex lg:w-56 h-full" radius="none" shadow="sm">
            <CardHeader className="flex-col items-start gap-2 pb-0">
                <div className="flex items-center gap-2">
                    <svg
                        className="w-5 h-5 text-default-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                    </svg>
                    <h3 className="text-lg font-bold">Filters</h3>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="gap-0 p-0">
                <ScrollShadow className="h-full">
                    <div className="p-3 space-y-1">
                        <p className="text-xs font-semibold text-default-500 uppercase tracking-wide px-3 py-2">
                            Categories
                        </p>
                        {allCategories.map((category) => {
                            const isSelected = selectedCategory === (category.slug === "all" ? null : category.slug);
                            return (
                                <Button
                                    key={category.slug || category.name}
                                    variant={isSelected ? "flat" : "light"}
                                    color={isSelected ? "primary" : "default"}
                                    className="w-full justify-start"
                                    startContent={
                                        <span className="text-base">{getCategoryEmoji(category)}</span>
                                    }
                                    onPress={() =>
                                        onCategorySelect(
                                            category.slug === "all" ? null : category.slug
                                        )
                                    }
                                >
                                    <span className="flex-1 text-left truncate text-sm">{category.name}</span>
                                </Button>
                            );
                        })}
                    </div>
                </ScrollShadow>
            </CardBody>
        </Card>
    );
}

// Mobile Category Sidebar Component
interface MobileSidebarProps {
    categories: any[];
    selectedCategory: string | null;
    onCategorySelect: (slug: string | null) => void;
}

function MobileSidebar({
    categories,
    selectedCategory,
    onCategorySelect,
}: MobileSidebarProps) {
    const allCategories = [
        { name: "All", slug: "all", id: "all" },
        ...categories.map((cat: any) => ({
            ...cat,
            slug: cat.slug || String(cat.id),
            id: cat.id || cat.slug,
        })),
    ];

    return (
        <ScrollShadow className="h-full">
            <div className="p-2 space-y-2">
                {allCategories.map((category) => {
                    const isSelected = selectedCategory === (category.slug === "all" ? null : category.slug);
                    return (
                        <Button
                            key={category.slug || category.name}
                            variant={isSelected ? "flat" : "light"}
                            color={isSelected ? "primary" : "default"}
                            className="w-full h-auto py-2 flex-col min-w-0"
                            size="sm"
                            onPress={() =>
                                onCategorySelect(
                                    category.slug === "all" ? null : category.slug
                                )
                            }
                            title={category.name}
                        >
                            <span className="text-lg">{getCategoryEmoji(category)}</span>
                            <span className="line-clamp-1 text-[10px]">{category.name}</span>
                        </Button>
                    );
                })}
            </div>
        </ScrollShadow>
    );
}

// Main Content Area Component
interface MainContentProps {
    products: any[];
    selectedCategory: string | null;
    getCategoryEmoji: (category: any) => string;
}

function MainContent({
    products,
    selectedCategory,
    getCategoryEmoji,
}: MainContentProps) {
    return (
        <main className="flex-1 flex flex-col bg-default-50 lg:ml-0 ml-20 overflow-hidden h-[calc(100vh-88px)]">
            <ScrollShadow className="flex-1">
                <div className="w-full px-3 py-3 sm:px-5 sm:py-5 md:px-6 md:py-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Header with Filters and Sort - Hidden on mobile */}
                        <Card className="hidden sm:flex mb-6" shadow="sm">
                            <CardBody className="gap-4">
                                <div>
                                    <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                                        {selectedCategory ? "Category" : "All Products"}
                                    </h2>
                                    <Chip variant="flat" color="default" size="sm">
                                        {products.length} product{products.length !== 1 ? "s" : ""} available
                                    </Chip>
                                </div>

                                <div className="hidden sm:flex gap-3">
                                    <Button
                                        isIconOnly
                                        variant="bordered"
                                        size="sm"
                                        startContent={
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                                />
                                            </svg>
                                        }
                                    />
                                    <Button
                                        variant="flat"
                                        size="sm"
                                        endContent={
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                                />
                                            </svg>
                                        }
                                    >
                                        Sort By
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>

                        {/* Products Grid */}
                        {products.length === 0 ? (
                            <Card shadow="sm">
                                <CardBody className="py-16 text-center items-center gap-4">
                                    <div className="text-6xl">🔍</div>
                                    <div>
                                        <p className="text-lg font-semibold mb-2">
                                            No products available
                                        </p>
                                        <p className="text-default-500">Check back soon!</p>
                                    </div>
                                </CardBody>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
                                {products.map((product: any) => (
                                    <Card
                                        key={product.id}
                                        isPressable
                                        isHoverable
                                        shadow="sm"
                                        className="hover:shadow-lg transition-shadow"
                                    >
                                        <CardBody className="p-3">
                                            <Product
                                                group={product}
                                                onProductClick={(id) => `/product/${id}`}
                                                getCategoryEmoji={getCategoryEmoji}
                                            />
                                        </CardBody>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </ScrollShadow>
        </main>
    );
}

// Client Component for Interactivity
export function StoreHomePageClient({
    products: initialProducts,
    categories,
}: {
    products: any[];
    categories: any[];
}) {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [products, setProducts] = useState(initialProducts);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedCategory === null) {
            // Fetch all products
            fetchAllProducts();
        } else {
            // Fetch filtered products from backend
            fetchFilteredProducts(selectedCategory);
        }
    }, [selectedCategory]);

    const fetchAllProducts = async () => {
        try {
            setLoading(true);
            const prodsData = await apiEndpoints.getProducts();
            const allProducts = prodsData.data.data || prodsData.products || [];
            setProducts(Array.isArray(allProducts) ? allProducts : []);
        } catch (error) {
            console.error("Failed to fetch products:", error);
            setProducts(initialProducts || []);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredProducts = async (categorySlug: string) => {
        try {
            setLoading(true);
            // Build query with category ID or slug filter
            const query = `?categoryId=${categorySlug}`;
            const prodsData = await apiEndpoints.getProducts(query);
            const allProducts = prodsData.data || prodsData.products || [];
            setProducts(Array.isArray(allProducts) ? allProducts : []);
        } catch (error) {
            console.error("Failed to fetch filtered products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = loading ? [] : products;

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
                        selectedCategory={selectedCategory}
                        onCategorySelect={setSelectedCategory}
                    />
                </CardBody>
            </Card>

            {/* Desktop Sidebar */}
            <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-[calc(100vh - 80px)]">
                {loading ? (
                    <div className="flex-1 w-full bg-background lg:ml-0 ml-20 flex items-center justify-center">
                        <Spinner size="lg" label="Loading products..." color="primary" />
                    </div>
                ) : (
                    <MainContent
                        products={filteredProducts}
                        selectedCategory={selectedCategory}
                        getCategoryEmoji={getCategoryEmoji}
                    />
                )}
            </div>
        </div>
    );
}
