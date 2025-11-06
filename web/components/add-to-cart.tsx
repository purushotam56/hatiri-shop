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

export function AddToCart({ group }: AddToCartProps) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<number>(
    group.variants[0]?.id || 0
  );
  const [showVariants, setShowVariants] = useState(false);

  const selected = group.variants.find((v) => v.id === selectedVariant);
  const isOutOfStock =
    group.variants.length > 0 && group.variants.every((v) => v.stock === 0);

  const handleAddClick = () => {
    if (group.variants.length > 1) {
      setShowVariants(true);
    } else if (selected && selected.stock > 0) {
      addToCart({
        id: selected.id,
        name: group.name,
        price: selected.price,
        currency: group.currency,
        stock: selected.stock,
        sku: selected.sku,
        unit: selected.unit,
        bannerImage: (group as any).bannerImage,
        image: (group as any).image,
        images: (group as any).images,
      });
    }
  };

  return (
    <>
      <button
        onClick={handleAddClick}
        disabled={isOutOfStock || (selected?.stock || 0) === 0}
        className={`w-full py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 ${
          isOutOfStock || (selected?.stock || 0) === 0
            ? "bg-default-200 text-default-500 cursor-not-allowed"
            : "bg-primary text-primary-foreground hover:bg-primary-600 active:scale-95"
        }`}
      >
        <span>🛒</span>
        {isOutOfStock ? "Out" : "Add"}
      </button>

      {showVariants && group.variants.length > 1 && (
        <>
          <div
            className="fixed inset-0 bg-overlay/50 z-40"
            onClick={() => setShowVariants(false)}
          />
          
          <div className="fixed bottom-0 left-0 right-0 bg-content1 rounded-t-2xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-default-300" />
            </div>

            <div className="px-4 pb-8 pt-2">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">
                  Select Size
                </h3>
                <button
                  onClick={() => setShowVariants(false)}
                  className="text-default-500 hover:text-foreground text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                {group.variants.map((variant) => {
                  const isDisabled = variant.stock === 0;
                  const isSelected = variant.id === selectedVariant;

                  return (
                    <button
                      key={variant.id}
                      onClick={() => !isDisabled && setSelectedVariant(variant.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-lg border transition-all ${
                        isSelected
                          ? "border-primary bg-primary-50"
                          : isDisabled
                          ? "border-divider bg-default-100 opacity-50 cursor-not-allowed"
                          : "border-divider hover:border-default-400"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-semibold text-foreground text-sm">
                          {variant.quantity && variant.unit
                            ? `${variant.quantity} ${variant.unit}`
                            : variant.unit || `Option ${variant.id}`}
                        </p>
                        <p className="text-primary font-bold text-sm mt-1">
                          ₹{parseFloat(String(variant.price)).toFixed(0)}
                        </p>
                      </div>
                      {isSelected && (
                        <span className="text-lg text-primary">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  if (selected && !isOutOfStock) {
                    addToCart({
                      id: selected.id,
                      name: group.name,
                      price: selected.price,
                      currency: group.currency,
                      stock: selected.stock,
                      sku: selected.sku,
                      unit: selected.unit,
                      bannerImage: (group as any).bannerImage,
                      image: (group as any).image,
                      images: (group as any).images,
                    });
                    setShowVariants(false);
                  }
                }}
                disabled={isOutOfStock}
                className="w-full mt-6 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-bold text-base transition-all hover:bg-primary-600 active:scale-95 disabled:opacity-50"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
