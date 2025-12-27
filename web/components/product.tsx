import Link from "next/link";
import React from "react";

import { AddToCart } from "./add-to-cart";
import { PriceDisplay } from "./price-display";

import { ProductGroup } from "@/types/product";
import { Organisation } from "@/types/store";

interface ProductProps {
  group: ProductGroup;
  onProductClick: (productId: number) => string;
  getCategoryEmoji: (name: string | Record<string, unknown>) => string;
  organisation?: Organisation;
  priceVisibility?: "hidden" | "login_only" | "visible";
}

export function Product({
  group,
  onProductClick,
  getCategoryEmoji,
  organisation,
  priceVisibility = "visible",
}: ProductProps) {
  const product = group;
  const hasDiscount = false; // You can add discount logic later
  const discount = 0;

  return (
    <div className="group bg-white rounded-lg overflow-hidden border border-divider hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col hover:border-default-300">
      {/* Product Image Container */}
      <div className="relative bg-default-50 flex-shrink-0 h-28 sm:h-32 md:h-40 flex items-center justify-center overflow-hidden">
        <Link
          className="w-full h-full flex items-center justify-center"
          href={`/product/${product.id}`}
        >
          {product.bannerImage?.url ||
          product.image?.url ||
          (product.images && product.images[0]?.upload?.url) ? (
            <img
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              src={
                product.bannerImage?.url ||
                product.image?.url ||
                (product.images && product.images[0]?.upload?.url) ||
                ""
              }
            />
          ) : (
            <div className="text-5xl sm:text-6xl md:text-7xl group-hover:scale-105 transition-transform duration-300">
              {getCategoryEmoji(product.name || "")}
            </div>
          )}
        </Link>

        {/* Discount Badge */}
        {hasDiscount && discount > 0 && (
          <div className="absolute top-2 left-2 bg-success text-white px-2 py-1 rounded-lg text-xs font-bold">
            {discount}% OFF
          </div>
        )}

        {/* Stock Badge - Top Right */}
        {product.stock && product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-2 right-2 bg-danger/90 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-md">
            {product.stock} left
          </div>
        )}

        {/* Add Button - Floating */}
        {/* <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="bg-primary hover:bg-primary-600 text-primary-foreground rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div> */}

        {/* Sold Out Overlay */}
        {product.stock === 0 && product.stock !== undefined && (
          <Link
            className="absolute inset-0 bg-foreground/40 flex items-center justify-center backdrop-blur-sm"
            href={`/product/${product.id}`}
          >
            <span className="text-white font-bold text-sm">SOLD OUT</span>
          </Link>
        )}
      </div>

      {/* Product Info */}
      <div className="p-2 sm:p-3 md:p-4 flex-1 flex flex-col bg-background">
        {/* Product Name */}
        <h3 className="font-semibold text-foreground text-xs sm:text-sm md:text-base line-clamp-2 mb-1 sm:mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Unit/Description and Price Section */}
        <div className="mt-auto">
          <div className="flex items-center justify-between gap-2 mb-2">
            {(product.quantity || product.unit) && (
              <p className="text-xs text-foreground/70 font-medium">
                {product.quantity && product.unit
                  ? `${product.quantity} ${product.unit}`
                  : product.unit}
              </p>
            )}
            <PriceDisplay
              hasDiscount={hasDiscount}
              originalPrice={product.price || 0}
              price={product.price || 0}
              priceVisibility={priceVisibility}
            />
          </div>
        </div>

        {/* Add To Cart and WhatsApp Buttons */}
        <div className="mt-2 sm:mt-3">
          <AddToCart group={group} organisation={organisation} />
        </div>
      </div>
    </div>
  );
}
