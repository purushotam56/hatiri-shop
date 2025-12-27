/**
 * Address Types - Centralized type definitions for address-related interfaces
 */

export interface Address extends Record<string, unknown> {
  // Backend fields
  id?: number;
  userId?: number;
  name?: string;
  phone?: string;
  address?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode?: string;
  isDefault?: boolean;
  createdAt?: string;
  updatedAt?: string;
  
  // Form fields (aliases for UI)
  label?: string;
  fullName?: string;
  phoneNumber?: string;
  street?: string;
  pincode?: string;
}
