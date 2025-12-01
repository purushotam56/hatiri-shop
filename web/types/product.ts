/**
 * Product Types - Centralized type definitions for all product-related interfaces
 */

export interface Upload {
  id: number;
  name: string;
  key: string;
  url: string;
}

export interface ProductImage {
  id: number;
  productId: number;
  uploadId: number;
  sortOrder: number;
  isActive: boolean;
  upload: Upload;
}

export interface BannerImage {
  id: number;
  name: string;
  key: string;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  sku?: string;
  quantity?: number;
  unit?: string;
  bannerImage?: BannerImage;
  image?: BannerImage;
  images?: ProductImage[];
  details?: string;
  variants?: Product[];
  categoryId?: number;
  organisationId?: number;
  productGroupId?: number | null;
  stockMergeType?: 'merged' | 'independent';
  taxRate?: number;
  taxType?: string;
  isActive?: boolean;
  discountType?: string | null;
  discountPercentage?: number | null;
  isDiscountActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  organisation?: {
    id?: number;
    name?: string;
    organisationUniqueCode?: string;
    priceVisibility?: any;
    whatsappNumber?: string;
    whatsappEnabled?: boolean;
    image?: BannerImage;
  };
}

export interface ProductGroup {
  // Core fields - required for components
  id: number; // Product/Group ID
  baseProduct: Product; // Base product for display
  variants: Product[]; // Available variants
  
  // ProductGroup-specific fields
  baseSku?: string;
  baseStock?: number;
  stockMergeType?: 'merged' | 'independent';
  organisationId?: number;
  
  // Base product reference
  baseName?: string;
  
  // Product display properties (for flattened usage in components)
  // These allow ProductGroup to be used directly like a Product in UI components
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  stock?: number;
  sku?: string;
  quantity?: number;
  unit?: string;
  category?: string;
  imageUrl?: string | null;
  bannerImage?: BannerImage;
  image?: BannerImage;
  images?: ProductImage[];
  details?: string;
  categoryId?: number;
  productGroupId?: number | null;
  taxRate?: number;
  taxType?: string;
  isActive?: boolean;
  discountType?: string | null;
  discountPercentage?: number | null;
  isDiscountActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Variant extends Product {
  // Variant-specific fields
  quantity?: number;
  options?: string | any[];
}

export interface ProductDetailClientProps {
  product: Product;
  variants: Product[];
  organisation?: any;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  image?: BannerImage;
  organisationId: number;
}
