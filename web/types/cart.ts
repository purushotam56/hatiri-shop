/**
 * Cart Types - Centralized type definitions for cart-related interfaces
 */

export interface CartItem {
  id: number;
  productId?: number;
  variantId?: number;
  name: string;
  price: number;
  quantity: number;
  currency: string;
  productQuantity?: number;
  unit?: string;
  sku?: string;
  bannerImage?: any;
  image?: any;
  images?: any[];
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  syncCart: () => Promise<void>;
}
