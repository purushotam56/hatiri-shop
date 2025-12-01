"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Spinner } from "@heroui/spinner";
import { Product } from "./product";
import { apiEndpoints } from "@/lib/api-client";

// Helper function for category emoji
const getCategoryEmoji = (categoryOrName: any): string => {
  if (typeof categoryOrName === 'object' && categoryOrName?.emoji) {
    return categoryOrName.emoji;
  }
  return "📦";
};

interface StoreProductsGridProps {
  organisation: any;
  categoryId?: string;
}

export function StoreProductsGrid({
  organisation,
  categoryId,
}: StoreProductsGridProps) {
  const [products, setProducts] = useState<any[]>([]);
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
  const fetchMore = useCallback(async (currentPage: number) => {
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const queryString = categoryId
        ? `categoryId=${categoryId}&page=${nextPage}`
        : `page=${nextPage}`;

      const response = await apiEndpoints.getProductsByOrg(organisation.id, queryString);
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
  }, [categoryId, organisation.id]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (loading || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchMore(page);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [fetchMore, hasMore, loading, page]);

  return (
    <>
      {products.map((product: any) => (
        <Product
          key={product.id}
          group={product}
          onProductClick={(id) => `/product/${id}`}
          getCategoryEmoji={getCategoryEmoji}
          organisation={organisation}
          priceVisibility={organisation?.priceVisibility}
        />
      ))}

      {/* Infinite Scroll Trigger - This div triggers when it comes into view */}
      <div ref={observerTarget} className="w-full flex justify-center items-center py-12">
        {loading && (
          <Spinner
            color="primary"
            label="Loading more products..."
          />
        )}
      </div>

    </>
  );
}
