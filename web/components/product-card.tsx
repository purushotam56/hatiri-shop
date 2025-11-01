"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  sku?: string;
  unit?: string;
  category?: string;
}

interface ProductGroup {
  baseProduct: Product;
  variants: Product[];
}

interface ProductCardProps {
  group: ProductGroup;
  selectedOptions: { [key: number]: Product };
  onSelectVariant: (productId: number, variant: Product) => void;
  onAddToCart: (product: Product) => void;
  getCategoryEmoji: (name: string) => string;
}

export function ProductCard({
  group,
  selectedOptions,
  onSelectVariant,
  onAddToCart,
  getCategoryEmoji,
}: ProductCardProps) {
  const router = useRouter();
  const product = group.baseProduct;
  const selectedVariant = selectedOptions[product.id]
    ? group.variants.find((v) => v.id === selectedOptions[product.id]?.id)
    : undefined;

  const handleAddClick = () => {
    if (group.variants.length > 1) {
      if (!selectedOptions[product.id]) {
        const availableVariant = group.variants.find((v) => v.stock > 0);
        if (availableVariant) {
          onSelectVariant(product.id, availableVariant);
        }
      }
      const variantToAdd = selectedOptions[product.id];
      if (variantToAdd && variantToAdd.stock > 0) {
        onAddToCart(variantToAdd);
      }
    } else if (product.stock > 0) {
      onAddToCart(product);
    }
  };

  const isOutOfStock =
    group.variants.length > 0 && group.variants.every((v) => v.stock === 0);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all border border-slate-200 hover:border-blue-400">
      {/* Product Image */}
      <div
        onClick={() => router.push(`/product/${product.id}`)}
        className="relative bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 h-40 flex items-center justify-center overflow-hidden border-b border-slate-200 cursor-pointer"
      >
        <div className="text-6xl group-hover:scale-125 transition-transform duration-300">
          {getCategoryEmoji(product.name)}
        </div>
        {(selectedVariant?.stock || product.stock) === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-sm">OUT OF STOCK</span>
          </div>
        )}
        {(selectedVariant?.stock || product.stock) < 5 &&
          (selectedVariant?.stock || product.stock) > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Only {selectedVariant?.stock || product.stock} left!
            </div>
          )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3
          onClick={() => router.push(`/product/${product.id}`)}
          className="font-bold text-slate-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors cursor-pointer"
        >
          {product.name}
        </h3>

        {/* Variants Display */}
        {group.variants.length > 1 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {group.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => onSelectVariant(product.id, variant)}
                className={`px-2 py-1 text-xs rounded-full font-semibold transition-all ${
                  selectedOptions[product.id]?.id === variant.id
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                } ${variant.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={variant.stock === 0}
              >
                {variant.unit || variant.name.split("-").pop()}
              </button>
            ))}
          </div>
        )}

        {(selectedVariant?.unit || product.unit) && (
          <p className="text-xs text-slate-500 mb-3 font-medium">
            {selectedVariant?.unit || product.unit}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline justify-between mb-4">
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            ₹{parseFloat(
              String(selectedVariant?.price || product.price)
            ).toFixed(0)}
          </span>
          {(selectedVariant?.sku || product.sku) && (
            <span className="text-xs text-slate-400 font-mono">
              {selectedVariant?.sku || product.sku}
            </span>
          )}
        </div>

        {/* Add Button */}
        <button
          type="button"
          onClick={handleAddClick}
          disabled={
            (group.variants.length > 1
              ? (selectedOptions[product.id]?.stock || 0) === 0
              : product.stock === 0) || isOutOfStock
          }
          className={`w-full py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-md ${
            isOutOfStock
              ? "bg-slate-200 text-slate-500 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-95"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "Add"}
        </button>
      </div>
    </div>
  );
}
