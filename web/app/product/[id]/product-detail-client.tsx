"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useCart } from "@/context/cart-context";
import { generateDetailedInquiryWithLink, generateWhatsAppURL } from "@/lib/whatsapp-templates";
import { AddToCart } from "@/components/add-to-cart";
import { Variant } from "framer-motion";
import { PriceDisplay } from "@/components/price-display";
import { Product, ProductDetailClientProps } from "@/types/product";

export function ProductDetailClient({
  product,
  variants,
  organisation,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(product);
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Keyboard navigation for image slider
  useEffect(() => {
    const allImages: string[] = [];
    if (product.bannerImage?.url) allImages.push(product.bannerImage.url);
    if (product.image?.url) allImages.push(product.image.url);
    if (product.images) {
      product.images.forEach((img) => {
        if (img.upload?.url) allImages.push(img.upload.url);
      });
    }

    if (allImages.length <= 1) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setSelectedImageIndex((prev) =>
          prev === 0 ? allImages.length - 1 : prev - 1
        );
      } else if (e.key === "ArrowRight") {
        setSelectedImageIndex((prev) =>
          prev === allImages.length - 1 ? 0 : prev + 1
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product]);

  const handleAddToCart = (variantToAdd: Product) => {
    addToCart({
      ...variantToAdd,
      productId: product?.id || variantToAdd.id,
      variantId: variantToAdd.id,
      quantity: quantity,
    });

    setAddedMessage(`✓ Added to cart!`);
    setTimeout(() => {
      setAddedMessage("");
      setQuantity(1);
    }, 1500);
  };

  const handleWhatsAppClick = () => {
    if (!organisation?.whatsappNumber || !organisation?.organisationUniqueCode)
      return;

    const productToShare = selectedVariant || product;
    if (!productToShare) return;

    const message = generateDetailedInquiryWithLink({
      product: {
        id: productToShare.id,
        name: productToShare.name,
        price: productToShare.price,
        sku: productToShare.sku,
      },
      quantity: quantity,
      sellerName: organisation.name,
      organisationUniqueCode: organisation.organisationUniqueCode,
    });

    const whatsappUrl = generateWhatsAppURL(organisation.whatsappNumber, message);
    window.open(whatsappUrl, "_blank");
  };

  const allImages: string[] = [];
  if (product.bannerImage?.url) allImages.push(product.bannerImage.url);
  if (product.image?.url) allImages.push(product.image.url);
  if (product.images) {
    product.images.forEach((img) => {
      if (img.upload?.url) allImages.push(img.upload.url);
    });
  }

  const hasMultipleImages = allImages.length > 1;
  const currentImage = allImages[selectedImageIndex] || allImages[0];

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? allImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === allImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="pb-28">
      {/* Header with Product Title and Info */}
      <div className="sticky top-0 z-30 bg-background/98 backdrop-blur-md p-4 border-b border-divider/50 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
          {(product.quantity || product.unit) && (
            <p className="text-base text-foreground/60 font-medium">
              {product.quantity && product.unit ? `${product.quantity} ${product.unit}` : product.unit}
            </p>
          )}
        </div>
      </div>

      {/* Main Product Grid - Image Left, Info Right */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 max-w-7xl mx-auto">
        {/* Product Image Gallery - Left (3 columns) */}
        <div className="lg:col-span-3 space-y-3">
          {/* Main Image with Slider Controls */}
          <Card className="relative overflow-hidden group border border-divider/50" shadow="none">
            <CardBody className="p-0">
              <div className="relative h-80 lg:h-96 flex items-center justify-center bg-content2/50 p-6">
                {allImages.length > 0 ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-contain transition-opacity duration-300"
                  />
                ) : (
                  <div className="text-6xl opacity-40">📦</div>
                )}

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <Button
                      isIconOnly
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 transition-all opacity-0 group-hover:opacity-100"
                    color="default"
                    variant="solid"
                    radius="full"
                    aria-label="Previous image"
                  >
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
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Button>
                  <Button
                    isIconOnly
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-all opacity-0 group-hover:opacity-100"
                    color="default"
                    variant="solid"
                    radius="full"
                    aria-label="Next image"
                  >
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
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>

                  {/* Image Counter */}
                  <Chip
                    className="absolute bottom-4 right-4"
                    color="default"
                    variant="solid"
                  >
                    {selectedImageIndex + 1} / {allImages.length}
                  </Chip>
                </>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Thumbnail Preview Grid */}
        {hasMultipleImages && (
          <div className="grid grid-cols-5 gap-2">
            {allImages.map((url, index) => (
              <Card
                key={index}
                isPressable
                onPress={() => setSelectedImageIndex(index)}
                className={`relative aspect-square transition-all ${
                  selectedImageIndex === index
                    ? "ring-2 ring-primary scale-105"
                    : "hover:scale-105"
                }`}
              >
                <CardBody className="p-0 overflow-hidden">
                  <img
                    src={url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedImageIndex === index && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
        </div>

        {/* Product Info - Right (1 column) */}
        <div className="space-y-4">
          {/* Product Options - Variants/Units Selection - PRIORITY */}
          {variants.length > 1 && (
            <div className="border border-divider/50 rounded-lg p-4 bg-content1/50">
              <p className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Select Option</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
              {variants.map((variant) => {
                const isSelected = selectedVariant?.id === variant.id;
                const variantName = variant.quantity && variant.unit ? `${variant.quantity} ${variant.unit}` : (variant.unit || variant.name);

                return (
                  <div
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      router.push(`/product/${variant.id}`);
                    }}
                    className={`rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                      isSelected
                        ? "border-success bg-success/10 ring-2 ring-success/50 shadow-lg"
                        : "border-divider/60 bg-default-50 hover:border-default-300 hover:bg-default-100"
                    }`}
                  >
                    {/* Variant Image */}
                    {variant.image?.url && (
                      <div className="relative w-full h-24 bg-gradient-to-br from-default-100 to-default-50">
                        <img
                          src={variant.image.url}
                          alt={variantName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* Variant Info */}
                    <div className="p-2.5 space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <p className="font-bold text-xs text-foreground line-clamp-1 flex-1">{variantName}</p>
                        {isSelected && (
                          <div className="flex-shrink-0">
                            <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>

                        <PriceDisplay
                                          price={variant.price}
                                          originalPrice={variant.price}
                                          priceVisibility={product?.organisation?.priceVisibility}
                                          hasDiscount={false}
                                        />

                      {variant.stock > 0 ? (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
                          <p className="text-xs font-semibold text-success">{variant.stock} left</p>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-danger"></div>
                          <p className="text-xs font-semibold text-danger">Out of stock</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              </div>
            </div>
          )}

        {/* Price, SKU, Unit, Stock - Single Row */}
        {!variants.length && (
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-lg p-3 border-2 border-primary/30">
          <div className="flex items-center justify-between gap-3">
            {/* Price - Big */}
            <div className="flex-1">
              <p className="text-foreground/60 text-xs font-medium">Price</p>
              <p className="text-2xl font-bold text-primary">
                ₹{parseFloat(String(product.price)).toFixed(0)}
              </p>
            </div>

            {/* Divider */}
            <div className="h-12 w-px bg-divider"></div>

            {/* SKU - Small */}
            {product.sku && (
              <div className="flex flex-col items-center gap-1">
                <p className="text-foreground/50 text-xs font-medium">SKU</p>
                <p className="text-xs font-mono font-bold text-foreground">{product.sku}</p>
              </div>
            )}

            {/* Unit - Medium */}
            {(product.quantity || product.unit) && (
              <div className="flex flex-col items-center gap-1">
                <p className="text-foreground/60 text-xs font-medium">Size</p>
                <p className="text-sm font-bold text-foreground">{product.quantity && product.unit ? `${product.quantity} ${product.unit}` : product.unit}</p>
              </div>
            )}

            {/* Stock - Small with Badge */}
            <div className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
              product.stock > 0 
                ? "bg-success/20" 
                : "bg-danger/20"
            }`}>
              <div className={`w-2.5 h-2.5 rounded-full ${
                product.stock > 0 ? "bg-success" : "bg-danger"
              }`}></div>
              <p className={`text-xs font-bold ${
                product.stock > 0 ? "text-success" : "text-danger"
              }`}>
                {product.stock > 0 ? `${product.stock}` : "Out"}
              </p>
            </div>
          </div>
        </div>
        )}
        </div>
      </div>

        {/* Floating Actions Footer - Using Add to Cart Component */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/99 dark:bg-zinc-950/99 backdrop-blur-md shadow-2xl border-t-2 border-divider/50 z-40">
          <div className="w-full max-w-7xl mx-auto px-4 py-4">
            <AddToCart 
              group={{
                id: product.id,
                name: product.name,
                price: product.price,
                currency: product.currency,
                stock: product.stock,
                unit: product.unit,
                baseProduct: product,
                variants: [{
                  ...(selectedVariant || product),
                  quantity: (selectedVariant || product).quantity,
                }],
              }}
              organisation={organisation}
            />
          </div>
        </div>

      {(product.description || product.details) && (
        <div className="border-t border-divider space-y-3 px-4 py-4">
          {product.description && (
            <div>
              <h3 className="font-bold text-sm text-foreground mb-2">Description</h3>
              <p className="text-foreground/80 text-sm leading-relaxed">{product.description}</p>
            </div>
          )}

          {product.details && (
            <div>
              <h3 className="font-bold text-sm text-foreground mb-2">Details</h3>
              <div
                className="prose prose-sm max-w-none text-foreground/80 text-sm"
                dangerouslySetInnerHTML={{ __html: product.details }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
