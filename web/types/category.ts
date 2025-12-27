/**
 * Category Types - Centralized type definitions for category-related interfaces
 */

export interface CategoryFormData extends Record<string, unknown> {
  name: string;
  emoji: string;
  description: string;
}
