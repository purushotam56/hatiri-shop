"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Image } from "@heroui/image";
import { useRouter } from "next/navigation";
import React from "react";

import { Product, ProductGroup } from "@/types/product";

interface ProductCardProps {
  group: ProductGroup;
  selectedOptions: { [key: number]: Product };
  onSelectVariant: (productId: number, variant: Product) => void;
  onAddToCart: (product: Product) => void;
  getCategoryEmoji: (name: string) => string;
  priceVisibility?: "hidden" | "login_only" | "visible";
  isUserLoggedIn?: boolean;
}

export function ProductCard({
  group,
  selectedOptions,
  onSelectVariant,
  onAddToCart,
  getCategoryEmoji,
  priceVisibility = "visible",
  isUserLoggedIn = false,
}: ProductCardProps) {
  const router = useRouter();
  const product = group.baseProduct;
  const selectedVariant = selectedOptions[product.id]
    ? group.variants.find((v) => v.id === selectedOptions[product.id]?.id)
    : undefined;

  // Determine if price should be shown
  const shouldShowPrice =
    priceVisibility === "visible" ||
    (priceVisibility === "login_only" && isUserLoggedIn);

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

  const currentStock = selectedVariant?.stock || product.stock;
  const isLowStock = currentStock < 5 && currentStock > 0;

  return (
    <Card
      isHoverable
      isPressable
      className="group hover:shadow-lg transition-shadow"
      shadow="sm"
      onPress={() => router.push(`/product/${product.id}`)}
    >
      {/* Product Image */}
      <CardHeader className="p-0">
        <div className="relative bg-gradient-to-br from-default-100 via-default-50 to-default-100 w-full h-40 flex items-center justify-center overflow-hidden">
          {product.bannerImage?.url ||
          product.image?.url ||
          (product.images && product.images[0]?.upload?.url) ? (
            <Image
              removeWrapper
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              src={
                product.bannerImage?.url ||
                product.image?.url ||
                (product.images && product.images[0]?.upload?.url) ||
                ""
              }
            />
          ) : (
            <div className="text-6xl group-hover:scale-125 transition-transform duration-300">
              {getCategoryEmoji(product.name)}
            </div>
          )}

          {/* Out of Stock Overlay */}
          {currentStock === 0 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <Chip
                className="text-white bg-black/50"
                color="default"
                size="sm"
                variant="flat"
              >
                OUT OF STOCK
              </Chip>
            </div>
          )}

          {/* Low Stock Badge */}
          {isLowStock && (
            <Chip
              className="absolute top-3 right-3"
              color="danger"
              size="sm"
              variant="solid"
            >
              Only {currentStock} left!
            </Chip>
          )}
        </div>
      </CardHeader>

      {/* Product Info */}
      <CardBody className="gap-2">
        <h3 className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Variants Display */}
        {group.variants.length > 1 && (
          <div
            className="flex flex-wrap gap-1"
            role="group"
            aria-label="Product variants"
            onClick={(e) => e.stopPropagation()}
          >
            {group.variants.map((variant) => (
              <Button
                key={variant.id}
                className="min-w-unit-12 h-unit-6 text-xs"
                color={
                  selectedOptions[product.id]?.id === variant.id
                    ? "primary"
                    : "default"
                }
                isDisabled={variant.stock === 0}
                radius="full"
                size="sm"
                variant={
                  selectedOptions[product.id]?.id === variant.id
                    ? "solid"
                    : "flat"
                }
                onPress={() => onSelectVariant(product.id, variant)}
              >
                {variant.unit || variant.name.split("-").pop()}
              </Button>
            ))}
          </div>
        )}

        {(selectedVariant?.quantity ||
          selectedVariant?.unit ||
          product.quantity ||
          product.unit) && (
          <p className="text-xs text-default-500">
            {selectedVariant?.quantity && selectedVariant?.unit
              ? `${selectedVariant.quantity} ${selectedVariant.unit}`
              : selectedVariant?.unit || (product.quantity && product.unit)
                ? `${product.quantity} ${product.unit}`
                : product.unit}
          </p>
        )}

        {/* Price and SKU */}
        <div className="flex items-baseline justify-between">
          {shouldShowPrice ? (
            <span className="text-2xl font-bold text-primary">
              ₹
              {parseFloat(
                String(selectedVariant?.price || product.price),
              ).toFixed(0)}
            </span>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-default-300 blur-sm">
                ₹0000
              </span>
              {priceVisibility === "login_only" && (
                <span className="text-xs text-default-500 font-medium">
                  Login to view
                </span>
              )}
            </div>
          )}
          {(selectedVariant?.sku || product.sku) && (
            <Chip className="text-xs font-mono" size="sm" variant="light">
              {selectedVariant?.sku || product.sku}
            </Chip>
          )}
        </div>
      </CardBody>

      {/* Add Button */}
      <CardFooter onClick={(e) => e.stopPropagation()}>
        <Button
          fullWidth
          color={isOutOfStock || !shouldShowPrice ? "default" : "primary"}
          isDisabled={isOutOfStock || currentStock === 0 || !shouldShowPrice}
          variant={isOutOfStock || !shouldShowPrice ? "flat" : "solid"}
          onPress={handleAddClick}
        >
          {isOutOfStock
            ? "Out of Stock"
            : !shouldShowPrice
              ? "Login to View"
              : "Add"}
        </Button>
      </CardFooter>
    </Card>
  );
}
