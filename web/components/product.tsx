import React from "react";
import Link from "next/link";
import { AddToCart } from "./add-to-cart";

interface Variant {
  id: number;
  sku?: string;
  price: number;
  stock: number;
  unit?: string;
  options?: string | any[];
}

interface ProductGroup {
  id: number;
  name: string;
  price: number;
  currency: string;
  stock: number;
  unit?: string;
  category?: string;
  imageUrl?: string | null;
  variants: Variant[];
}

interface ProductProps {
  group: ProductGroup;
  onProductClick: (productId: number) => string;
  getCategoryEmoji: (name: string) => string;
}

export function Product({ group, onProductClick, getCategoryEmoji }: ProductProps) {
  const product = group;

  return (
    <div className="group bg-default-50 rounded-xl overflow-hidden border border-divider hover:border-primary hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
      {/* Product Image */}
      <div className="relative bg-default-100 flex-shrink-0 h-24 md:h-32 flex items-center justify-center overflow-hidden border-b border-divider">
        <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform duration-300">
          {getCategoryEmoji(product.name)}
        </div>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center backdrop-blur-sm">
            <span className="text-foreground font-bold text-xs md:text-sm">SOLD OUT</span>
          </div>
        )}
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-1 right-1 bg-danger/90 text-background px-1.5 py-0.5 rounded-full text-xs font-bold shadow-sm">
            {product.stock}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 flex-1 flex flex-col">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-foreground text-xs md:text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.unit && (
          <p className="text-xs text-foreground/60 mb-2 font-medium">
            {product.unit}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center justify-between gap-2 mb-3 mt-auto">
          <span className="text-lg md:text-xl font-bold text-primary">
            ₹{parseFloat(String(product.price)).toFixed(0)}
          </span>
        </div>

        {/* Add To Cart Component */}
        <AddToCart group={group} />
      </div>
    </div>

  );
}
