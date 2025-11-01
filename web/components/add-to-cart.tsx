"use client";

import React, { useState } from "react";
import { useCart } from "@/context/cart-context";

interface Variant {
  id: number;
  sku?: string;
  price: number;
  stock: number;
  unit?: string;
  quantity?: string;
  options?: string | any[];
}

interface ProductGroup {
  id: number;
  name: string;
  price: number;
  currency: string;
  stock: number;
  unit?: string;
  variants: Variant[];
}

interface AddToCartProps {
  group: ProductGroup;
}

const getVariantName = (variant: Variant): string => {
  try {
    const opts =
      typeof variant.options === "string"
        ? JSON.parse(variant.options)
        : variant.options;
    return Array.isArray(opts) && opts.length > 0 ? opts[0] : variant.unit || `Option ${variant.id}`;
  } catch (e) {
    return variant.unit || `Option ${variant.id}`;
  }
};

export function AddToCart({ group }: AddToCartProps) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<number>(
    group.variants[0]?.id || 0
  );
  const [showVariantSlider, setShowVariantSlider] = useState(false);

  const selected = group.variants.find((v) => v.id === selectedVariant);

  const handleAddClick = () => {
    if (group.variants.length > 1) {
      setShowVariantSlider(true);
    } else if (selected && selected.stock > 0) {
      addToCart({
        id: selected.id,
        name: group.name,
        price: selected.price,
        currency: group.currency,
        stock: selected.stock,
        sku: selected.sku,
        unit: selected.unit,
      });
    }
  };

  const isOutOfStock =
    group.variants.length > 0 && group.variants.every((v) => v.stock === 0);

  return (
    <>
      {/* Add Button */}
      <button
        onClick={handleAddClick}
        disabled={isOutOfStock || (selected?.stock || 0) === 0}
        className={`w-full py-2 rounded-lg font-bold text-xs md:text-sm transition-all ${
          isOutOfStock || (selected?.stock || 0) === 0
            ? "bg-default-200 text-foreground/50 cursor-not-allowed opacity-50"
            : "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95"
        }`}
      >
        {isOutOfStock ? "Out of Stock" : "Add"}
      </button>

      {/* Bottom Slider Modal */}
      {showVariantSlider && group.variants.length > 1 && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowVariantSlider(false)}
          />

          {/* Slider Content */}
          <div className="fixed bottom-0 left-0 right-0 bg-background rounded-t-2xl shadow-2xl z-50 animate-in slide-in-from-bottom-5 duration-300">
            {/* Handle Bar */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-12 h-1 rounded-full bg-divider" />
            </div>

            {/* Content */}
            <div className="px-4 pb-6 pt-2 max-h-[60vh] overflow-y-auto">
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Select Option</h3>
                <button
                  onClick={() => setShowVariantSlider(false)}
                  className="text-foreground/60 hover:text-foreground text-xl font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Variant Options */}
              <div className="space-y-3 mb-6">
                {group.variants.map((variant) => {
                  const isDisabled = variant.stock === 0;

                  return (
                    <div
                      key={variant.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-default-50 hover:bg-default-100 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm">
                          {variant.quantity && variant.unit
                            ? `${variant.quantity} ${variant.unit}`
                            : variant.unit || `Option ${variant.id}`}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          ₹{parseFloat(String(variant.price)).toFixed(0)}
                        </p>
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => {
                          if (!isDisabled) {
                            addToCart({
                              id: variant.id,
                              name: group.name,
                              price: variant.price,
                              currency: group.currency,
                              stock: variant.stock,
                              sku: variant.sku,
                              unit: variant.unit,
                            });
                            setShowVariantSlider(false);
                          }
                        }}
                        disabled={isDisabled}
                        className="flex-shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-sm transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}
