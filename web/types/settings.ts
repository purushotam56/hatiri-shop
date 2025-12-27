/**
 * Settings Types - Centralized type definitions for settings-related interfaces
 */

export interface SettingValue {
  value: string | number | boolean;
  label?: string;
  description?: string;
}
