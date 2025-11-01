import React from "react";
import Link from "next/link";
import { AddToCart } from "./add-to-cart";

interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  stock: number;
  sku?: string;
  unit?: string;
  options?: string | any[];
  category?: string;
}

interface ProductGroup {
  baseProduct: Product;
  variants: Product[];
}

interface ProductProps {
  group: ProductGroup;
  onProductClick: (productId: number) => string;
  getCategoryEmoji: (name: string) => string;
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

export function Product({ group, onProductClick, getCategoryEmoji }: ProductProps) {
  const product = group.baseProduct;
  const selectedVariant = group.variants[0];

  return (
    <Link href={onProductClick(product.id)}>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all border border-slate-200 hover:border-blue-400 cursor-pointer">
        {/* Product Image */}
        <div className="relative bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 h-40 flex items-center justify-center overflow-hidden border-b border-slate-200">
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
          <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>

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

        {/* Add To Cart Component */}
        <AddToCart group={group} />
      </div>
    </div>
    </Link>
  );
}
