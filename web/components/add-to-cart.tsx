"use client";

import React, { useState } from "react";
import { useCart } from "@/context/cart-context";

interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  stock: number;
  sku?: string;
  unit?: string;
  options?: string | any[];
}

interface ProductGroup {
  baseProduct: Product;
  variants: Product[];
}

interface AddToCartProps {
  group: ProductGroup;
}

const getVariantName = (variant: Product): string => {
  try {
    const opts =
      typeof variant.options === "string"
        ? JSON.parse(variant.options)
        : variant.options;
    return Array.isArray(opts) && opts.length > 0 ? opts[0] : variant.name;
  } catch (e) {
    return variant.name;
  }
};

export function AddToCart({ group }: AddToCartProps) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<string>(
    getVariantName(group.variants[0])
  );

  const product = group.baseProduct;
  const selected = group.variants.find(
    (v) => getVariantName(v) === selectedVariant
  );

  const handleAddToCart = () => {
    if (selected && selected.stock > 0) {
      addToCart(selected);
    }
  };

  const isOutOfStock =
    group.variants.length > 0 && group.variants.every((v) => v.stock === 0);

  return (
    <div className="space-y-3">
      {/* Variant Selector Slider */}
      {group.variants.length > 1 && (
        <div>
          <label className="text-xs text-slate-600 mb-2 block font-medium">
            Select variant:
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {group.variants.map((variant) => {
              const variantName = getVariantName(variant);
              const isSelected = selectedVariant === variantName;
              return (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variantName)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold text-xs transition-all whitespace-nowrap border-2 ${
                    isSelected
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-slate-100 text-slate-700 border-slate-300 hover:border-blue-400"
                  } ${variant.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  disabled={variant.stock === 0}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{variant.unit || variant.name.split("-").pop()}</span>
                    {isSelected && (
                      <span className="text-xs font-bold">
                        ₹{parseFloat(String(variant.price)).toFixed(0)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Button */}
      <button
        onClick={handleAddToCart}
        disabled={isOutOfStock || (selected?.stock || 0) === 0}
        className={`w-full py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-md ${
          isOutOfStock || (selected?.stock || 0) === 0
            ? "bg-slate-200 text-slate-500 cursor-not-allowed opacity-50"
            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-95"
        }`}
      >
        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
      </button>
    </div>
  );
}
