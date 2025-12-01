"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { useCart } from "@/context/cart-context";
import { generateDetailedInquiryWithLink, generateWhatsAppURL } from "@/lib/whatsapp-templates";
import { Product } from "@/types/product";

interface ProductInteractiveProps {
  product: Product;
  variants: Product[];
  organisation: any;
}

export function ProductInteractive({
  product,
  variants,
  organisation,
}: ProductInteractiveProps) {
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Image Gallery with Slider */}
      <div className="space-y-4">
        {/* Main Image with Slider Controls */}
        <Card className="relative overflow-hidden group" shadow="lg">
          <CardBody className="p-0">
            <div className="relative h-96 md:h-[500px] flex items-center justify-center p-8 bg-content2">
              {allImages.length > 0 ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-contain transition-opacity duration-300"
                />
              ) : (
                <div className="text-9xl">📦</div>
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

      {/* Product Info */}
      <div className="space-y-6">
        {/* Price */}
        <Card className="bg-primary/10 border-2 border-primary/20">
          <CardBody className="gap-2">
            <p className="text-foreground/70 font-medium">Price</p>
            <p className="text-4xl font-bold text-primary">
              ₹{parseFloat(String(product.price)).toFixed(0)}
            </p>
            {product.sku && (
              <Chip size="sm" variant="flat" className="font-mono mt-1">
                SKU: {product.sku}
              </Chip>
            )}
          </CardBody>
        </Card>

        {/* Stock Status */}
        <div className="flex items-center gap-3">
          <div
            className={`w-4 h-4 rounded-full ${
              product.stock > 0 ? "bg-success" : "bg-danger"
            }`}
          ></div>
          <p
            className={`font-semibold ${
              product.stock > 0 ? "text-success" : "text-danger"
            }`}
          >
            {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
          </p>
        </div>

        {/* Product Options - Clickable Variants with Images */}
        {variants.length > 0 && (
          <Card>
            <CardBody className="gap-4">
              <p className="text-sm text-foreground/70 font-medium">
                Available Options:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const variantImage =
                    variant.bannerImage?.url ||
                    variant.image?.url ||
                    (variant.images && variant.images[0]?.upload?.url);

                  return (
                    <Card
                      key={variant.id}
                      isPressable
                      onPress={() => {
                        setSelectedVariant(variant);
                        router.push(`/product/${variant.id}`);
                      }}
                      className={`transition-all ${
                        isSelected
                          ? "ring-2 ring-primary scale-105"
                          : "hover:scale-105"
                      }`}
                    >
                      <CardBody className="gap-2 p-2">
                        {/* Variant Image */}
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-content2">
                          {variantImage ? (
                            <img
                              src={variantImage}
                              alt={variant.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              📦
                            </div>
                          )}
                          {isSelected && (
                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-primary"
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
                        </div>

                        {/* Variant Info */}
                        <div className="text-center">
                          <p className="font-semibold text-xs text-foreground line-clamp-2">
                            {variant.quantity && variant.unit ? `${variant.quantity} ${variant.unit}` : (variant.unit || variant.name)}
                          </p>
                          <p className="text-xs text-primary font-bold mt-1">
                            ₹{parseFloat(String(variant.price)).toFixed(0)}
                          </p>
                          <Chip
                            size="sm"
                            color={variant.stock > 0 ? "success" : "danger"}
                            variant="flat"
                            className="mt-1"
                          >
                            {variant.stock > 0 ? `${variant.stock} left` : "Out"}
                          </Chip>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })}
              </div>
            </CardBody>
          </Card>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <span className="text-foreground font-medium">Quantity:</span>
          <div className="flex items-center gap-2 bg-default-100 rounded-lg p-1">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              −
            </Button>
            <span className="px-6 py-2 text-foreground font-bold text-lg min-w-[60px] text-center">
              {quantity}
            </span>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => setQuantity(quantity + 1)}
              isDisabled={quantity >= product.stock}
            >
              +
            </Button>
          </div>
        </div>

        {/* Add Button and WhatsApp */}
        <div className="flex gap-3">
          <Button
            fullWidth
            size="lg"
            color="primary"
            onPress={() => handleAddToCart(selectedVariant || product)}
            isDisabled={product.stock === 0}
            className="font-bold text-lg"
          >
            {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>

          {organisation?.whatsappEnabled && organisation?.whatsappNumber && (
            <Button
              size="lg"
              className="bg-green-500 hover:bg-green-600 text-white font-bold"
              onPress={handleWhatsAppClick}
              startContent={
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.56.934-2.846 2.271-3.694 3.853 1.02-1.31 2.313-2.381 3.77-3.088a9.9 9.9 0 014.955-1.143z" />
                </svg>
              }
            >
              Ask on WhatsApp
            </Button>
          )}
        </div>

        {addedMessage && (
          <Card className="bg-success/10 border-2 border-success">
            <CardBody className="py-3 text-center">
              <p className="text-success font-semibold">{addedMessage}</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
