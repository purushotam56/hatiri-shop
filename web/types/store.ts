/**
 * Store Types - Centralized type definitions for store-related interfaces
 */

import { ProductGroup as ProductGroupBase, Category as ProductCategory } from "./product";

// Re-export ProductGroup from product types for convenience
export type ProductGroup = ProductGroupBase;

export interface Category extends Record<string, unknown> {
  id: number | string;
  name: string;
  slug?: string;
  icon?: string;
  emoji?: string;
  description?: string;
}

export interface Organisation {
  id: number;
  name: string;
  organisationUniqueCode: string;
  currency: string;
  whatsappNumber?: string;
  priceVisibility?: "hidden" | "login_only" | "visible";
  [key: string]: unknown;
}

export interface StoreData {
  organisation: Organisation;
  products: ProductGroup[];
  categories: Category[];
}

export interface StoreHomePageClientProps {
  products: ProductGroup[];
  categories: Category[];
}

export interface CategorySidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (slug: string | null) => void;
}

export interface MobileSidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategorySelect: (slug: string | null) => void;
}

export interface MainContentProps {
  products: ProductGroup[];
  selectedCategory: string | null;
  getCategoryEmoji: (category: string | Record<string, unknown>) => string;
}

export interface StoreProductsGridProps {
  organisation: Organisation;
  categoryId?: string;
}

export interface StoreSEOProps {
  storeName: string;
  storeCode: string;
  description: string;
  productCount: number;
  organisation?: Organisation;
}
