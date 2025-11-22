"use client";

import React, { useState } from "react";
import { useCart } from "@/context/cart-context";
import { generateWhatsAppURL, getQuickProductMessageWithLink } from "@/lib/whatsapp-templates";

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
  organisation?: any;
}

export function AddToCart({ group, organisation }: AddToCartProps) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<number>(
    group.variants[0]?.id || 0
  );
  const [showVariants, setShowVariants] = useState(false);

  const selected = group.variants.find((v) => v.id === selectedVariant);

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (organisation?.whatsappNumber && organisation?.organisationUniqueCode) {
      const message = getQuickProductMessageWithLink(
        group,
        organisation.organisationUniqueCode
      );
      const whatsappUrl = generateWhatsAppURL(organisation.whatsappNumber, message);
      window.open(whatsappUrl, "_blank");
    }
  };
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
      <div className="flex gap-2">
        <button
          onClick={handleAddClick}
          disabled={isOutOfStock || (selected?.stock || 0) === 0}
          className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 ${
            isOutOfStock || (selected?.stock || 0) === 0
              ? "bg-default-200 text-default-500 cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary-600 active:scale-95"
          }`}
        >
          <span>🛒</span>
          {isOutOfStock ? "Out" : "Add"}
        </button>

        {organisation && organisation.whatsappNumber && (
          <button
            onClick={handleWhatsAppClick}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 px-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-1 disabled:opacity-50"
            title="Contact on WhatsApp"
            disabled={!organisation?.whatsappEnabled}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.56.934-2.846 2.271-3.694 3.853 1.02-1.31 2.313-2.381 3.77-3.088a9.9 9.9 0 014.955-1.143z" />
            </svg>
            <span className="hidden sm:inline">Ask</span>
          </button>
        )}
      </div>

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
