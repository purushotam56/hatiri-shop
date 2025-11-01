"use client";

import React, { useState } from "react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import Link from "next/link";
import { SearchIcon } from "@/components/icons";
import { ProductCard } from "@/components/product-card";

const mockProducts = [
  { id: 1, name: "Fresh Red Apples", price: 4.99, currency: "USD", stock: 15, category: "Fruits" },
  { id: 2, name: "Organic Spinach", price: 3.49, currency: "USD", stock: 8, category: "Vegetables" },
  { id: 3, name: "Whole Wheat Bread", price: 2.99, currency: "USD", stock: 20, category: "Bakery" },
  { id: 4, name: "Premium Olive Oil", price: 12.99, currency: "USD", stock: 5, category: "Grocery" },
  { id: 5, name: "Non-Stick Pan", price: 34.99, currency: "USD", stock: 12, category: "Kitchenware" },
  { id: 6, name: "Smart Home Speaker", price: 79.99, currency: "USD", stock: 0, category: "Electronics" },
  { id: 7, name: "Wooden Dining Chair", price: 129.99, currency: "USD", stock: 3, category: "Furniture" },
  { id: 8, name: "Banana Bunch", price: 2.49, currency: "USD", stock: 25, category: "Fruits" },
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "Apples",
    "Bread",
    "Milk",
    "Rice",
  ]);

  const filteredProducts = searchQuery.trim()
    ? mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 3)]);
    }
  };

  const handleRecentSearch = (search: string) => {
    setSearchQuery(search);
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <main className="min-h-screen bg-white dark:bg-default-100 pt-2 pb-24">
      <div className="max-w-4xl mx-auto px-3">
        {/* Header */}
        <div className="mb-4 flex items-center gap-2">
          <Link href="/">
            <Button isIconOnly variant="light" size="sm">
              ←
            </Button>
          </Link>
          <h1 className="text-xl md:text-2xl font-bold">Search</h1>
        </div>

        {/* Search Input */}
        <div className="mb-4">
          <Input
            aria-label="Search products"
            placeholder="Search for items..."
            startContent={<SearchIcon className="text-base text-default-400" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch(searchQuery);
              }
            }}
            isClearable
            onClear={handleClear}
            size="lg"
            classNames={{
              inputWrapper: "bg-default-100 h-11",
              input: "text-sm",
            }}
          />
        </div>

        {!searchQuery.trim() ? (
          <>
            {/* Recent Searches */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-default-600 mb-3">Recent Searches</h2>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, idx) => (
                  <Button
                    key={idx}
                    variant="flat"
                    size="sm"
                    onClick={() => handleRecentSearch(search)}
                    className="text-xs"
                  >
                    🔍 {search}
                  </Button>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div>
              <h2 className="text-sm font-semibold text-default-600 mb-3">Popular Searches</h2>
              <div className="grid grid-cols-2 gap-3">
                {["Fresh Produce", "Dairy", "Bakery", "Snacks", "Beverages", "Health"].map(
                  (item, idx) => (
                    <Button
                      key={idx}
                      variant="light"
                      fullWidth
                      size="sm"
                      onClick={() => handleSearch(item)}
                      className="text-xs"
                    >
                      {item}
                    </Button>
                  )
                )}
              </div>
            </div>
          </>
        ) : filteredProducts.length > 0 ? (
          <>
            {/* Results */}
            <div className="mb-4">
              <p className="text-xs md:text-sm text-default-600 mb-3">
                {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onAddToCart={(id) => console.log("Added to cart:", id)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* No Results */}
            <Card className="text-center py-12 bg-default-50 dark:bg-default-200">
              <CardBody>
                <p className="text-3xl mb-3">🔍</p>
                <p className="text-base font-semibold mb-1">No results found</p>
                <p className="text-xs md:text-sm text-default-600 mb-4">
                  Try different keywords or browse categories
                </p>
                <Button size="sm" as={Link} href="/" variant="flat" className="text-xs">
                  Browse All Products
                </Button>
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
