"use client";

import React, { useState } from "react";
import { useCart } from "@/context/cart-context";
import { generateWhatsAppURL, getQuickProductMessageWithLink } from "@/lib/whatsapp-templates";
import { Variant, ProductGroup } from "@/types/product";

interface AddToCartProps {
  group: ProductGroup;
  organisation?: any;
}

export function AddToCart({ group, organisation }: AddToCartProps) {
  const { addToCart, cart, updateQuantity } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<number>(
    group.variants[0]?.id || 0
  );
  const [showVariants, setShowVariants] = useState(false);

  const selected = group.variants.find((v) => v.id === selectedVariant);
  
  // Check if this product is already in cart
  const cartItem = cart.find((item) => item.variantId === selectedVariant);
  const cartQuantity = cartItem?.quantity || 0;

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
        productId: group.id,
        variantId: selected.id,
        name: group.name,
        price: selected.price,
        currency: group.currency,
        stock: selected.stock,
        sku: selected.sku,
        productQuantity: selected.quantity,
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
        {/* Quantity Controls - Show when item is in cart */}
        {cartQuantity > 0 ? (
          <div className="flex-1 flex items-center justify-between bg-primary rounded-lg">
            <button
              onClick={() => updateQuantity(selectedVariant, cartQuantity - 1)}
              className="flex-1 py-2.5 text-primary-foreground font-bold hover:bg-primary-600 transition-colors"
            >
              −
            </button>
            <span className="text-primary-foreground font-bold text-sm px-2">
              {cartQuantity}
            </span>
            <button
              onClick={() => {
                if ((selected?.stock || 0) > cartQuantity) {
                  updateQuantity(selectedVariant, cartQuantity + 1);
                }
              }}
              disabled={(selected?.stock || 0) <= cartQuantity}
              className="flex-1 py-2.5 text-primary-foreground font-bold hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddClick}
            disabled={isOutOfStock || (selected?.stock || 0) === 0}
            className={`flex-1 py-2.5 px-3 rounded-lg font-semibold text-sm transition-all duration-150 flex items-center justify-center gap-2 ${
              isOutOfStock || (selected?.stock || 0) === 0
                ? "bg-default-200 text-default-500 cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary-600 active:scale-95"
            }`}
          >
            <span>+</span>
            {isOutOfStock ? "Out" : "ADD"}
          </button>
        )}

        {organisation && organisation.whatsappNumber && (
          <button
            onClick={handleWhatsAppClick}
            className="flex-shrink-0 text-white font-semibold py-2.5 px-3 rounded-lg transition-colors text-sm flex items-center justify-center disabled:opacity-50"
            title="Contact on WhatsApp"
            disabled={!organisation?.whatsappEnabled}
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#1daa61" className="bi bi-whatsapp" viewBox="0 0 16 16">
  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
</svg>
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
                      productId: group.id,
                      variantId: selected.id,
                      name: group.name,
                      price: selected.price,
                      currency: group.currency,
                      stock: selected.stock,
                      sku: selected.sku,
                      productQuantity: selected.quantity,
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
