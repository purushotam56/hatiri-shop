// API Configuration
// Reads from environment variables, with fallback to defaults

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  apiBaseUrl: `${API_BASE_URL}/api`,
  endpoints: {
    organisations: `${API_BASE_URL}/api/organisations`,
    products: (orgId: string | number) =>
      `${API_BASE_URL}/api/products?organisationId=${orgId}`,
    categories: (orgId: string | number) =>
      `${API_BASE_URL}/api/organisation/${orgId}/categories`,
  },
};

/**
 * Build full API URL from a relative path
 * @param path - Relative API path (e.g., "/orders", "/products/123")
 * @returns Full API URL
 */
export const buildApiUrl = (path: string): string => {
  if (!path) return API_CONFIG.apiBaseUrl;
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  return `${API_CONFIG.apiBaseUrl}${cleanPath}`;
};

export default API_CONFIG;
