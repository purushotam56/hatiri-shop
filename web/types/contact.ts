/**
 * Contact Types - Centralized type definitions for contact-related interfaces
 */

export interface ContactData extends Record<string, unknown> {
  address: string;
  additionalInfo: string;
}
