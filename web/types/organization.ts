/**
 * Organization Types - Centralized type definitions for organization-related interfaces
 */

export interface OrganisationFormData extends Record<string, unknown> {
  name: string;
  organisationUniqueCode: string;
  currency: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateCode: string;
  postalCode: string;
  countryCode: string;
  whatsappNumber?: string;
  whatsappEnabled?: boolean;
  priceVisibility?: "hidden" | "login_only" | "visible";
}
