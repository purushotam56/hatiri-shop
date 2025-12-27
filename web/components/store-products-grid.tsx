"use client";

import { Spinner } from "@heroui/spinner";
import React, { useEffect, useRef, useCallback, useState } from "react";

import { Product } from "./product";
import { Category, Organisation, ProductGroup, StoreProductsGridProps } from "@/types/store";

import { apiEndpoints } from "@/lib/api-client";

// Helper function for category emoji
const getCategoryEmoji = (categoryOrName: string | Record<string, unknown>): string => {
  // Handle string type (just name)
  if (typeof categoryOrName === "string") {
    return "📦";
  }

  // If it's a category object with emoji, use it
  if (typeof categoryOrName === "object" && categoryOrName !== null) {
    const cat = categoryOrName as Record<string, unknown>;
    if (cat.emoji && typeof cat.emoji === "string") {
      return cat.emoji;
    }
  }

  // Otherwise just return a default emoji
  return "📦";
};

export function StoreProductsGrid({
  organisation,
  categoryId,
}: StoreProductsGridProps) {
  const [products, setProducts] = useState<ProductGroup[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Reset pagination when category changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [categoryId]);

  // Fetch more products
  const fetchMore = useCallback(
    async (currentPage: number) => {
      setLoading(true);
      try {
        const nextPage = currentPage + 1;
        const queryString = categoryId
          ? `categoryId=${categoryId}&page=${nextPage}`
          : `page=${nextPage}`;

        const response = await apiEndpoints.getProductsByOrg(
          String(organisation.id),
          queryString,
        );
        const newProducts = response.data?.data || [];
        const pagination = response.data?.meta;

        if (newProducts.length === 0) {
          setHasMore(false);
        } else {
          setProducts((prev) => [...prev, ...newProducts]);
          setPage(nextPage);
          // Check if we've reached the last page
          if (pagination && nextPage >= pagination.last_page) {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch more products:", error);
      } finally {
        setLoading(false);
      }
    },
    [categoryId, organisation.id],
  );

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore(page);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchMore, hasMore, loading, page]);

  return (
    <>
      {products.map((product: ProductGroup) => (
        <Product
          key={product.id}
          getCategoryEmoji={getCategoryEmoji}
          group={product}
          organisation={organisation}
          priceVisibility={organisation?.priceVisibility}
          onProductClick={(id) => `/product/${id}`}
        />
      ))}

      {/* Infinite Scroll Trigger - This div triggers when it comes into view */}
      <div
        ref={observerTarget}
        className="w-full flex justify-center items-center py-12"
      >
        {loading && (
          <Spinner color="primary" label="Loading more products..." />
        )}
      </div>
    </>
  );
}
