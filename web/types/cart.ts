/**
 * Cart Types - Centralized type definitions for cart-related interfaces
 */

import { BannerImage, Product, ProductImage } from "./product";

export interface CartItem extends Record<string, unknown> {
  id: number;
  productId?: number;
  variantId?: number;
  name: string;
  price: number;
  quantity: number;
  currency: string;
  stock?: number;
  productQuantity?: number;
  unit?: string;
  sku?: string;
  bannerImage?: BannerImage;
  image?: BannerImage;
  images?: (ProductImage | BannerImage | Record<string, unknown>)[];
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem | Product | Record<string, unknown>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  syncCart: () => Promise<void>;
}
