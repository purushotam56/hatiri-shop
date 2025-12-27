/**
 * API Client Utilities
 * Centralized fetch wrapper that uses environment-based API URL
 */

import { buildApiUrl } from "@/config/api";

interface FetchOptions extends RequestInit {
  token?: string;
}

/**
 * Wrapper around fetch that automatically builds full API URLs
 * @param endpoint - API endpoint path (e.g., "/orders", "/products/123")
 * @param options - Fetch options (method, headers, body, etc.)
 * @returns Fetch response
 */
export async function apiCall(
  endpoint: string,
  options: FetchOptions = {},
): Promise<Response> {
  const { token, ...fetchOptions } = options;

  const url = buildApiUrl(endpoint);
  const headers = new Headers(fetchOptions.headers || {});

  // Add authorization header if token is provided
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Ensure content-type is set for JSON requests
  if (
    fetchOptions.method &&
    ["POST", "PUT", "PATCH"].includes(fetchOptions.method)
  ) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  return fetch(url, {
    ...fetchOptions,
    headers,
  });
}

/**
 * GET request wrapper
 */
export async function apiGet(endpoint: string, token?: string) {
  const response = await apiCall(endpoint, { method: "GET", token });

  return response.json();
}

/**
 * POST request wrapper
 */
export async function apiPost(endpoint: string, data?: Record<string, unknown>, token?: string) {
  const response = await apiCall(endpoint, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
    token,
  });

  return response.json();
}

/**
 * PUT request wrapper
 */
export async function apiPut(endpoint: string, data?: Record<string, unknown>, token?: string) {
  const response = await apiCall(endpoint, {
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
    token,
  });

  return response.json();
}

/**
 * PATCH request wrapper
 */
export async function apiPatch(endpoint: string, data?: Record<string, unknown>, token?: string) {
  const response = await apiCall(endpoint, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
    token,
  });

  return response.json();
}

/**
 * DELETE request wrapper
 */
export async function apiDelete(endpoint: string, token?: string) {
  const response = await apiCall(endpoint, {
    method: "DELETE",
    token,
  });

  return response.json();
}

/**
 * File upload wrapper for multipart/form-data
 */
export async function apiUpload(
  endpoint: string,
  formData: FormData,
  token?: string,
  method: "POST" | "PUT" = "POST",
) {
  const url = buildApiUrl(endpoint);
  const headers = new Headers();

  // Add authorization header if token is provided
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Don't set Content-Type for FormData - browser will set it with boundary
  const response = await fetch(url, {
    method,
    headers,
    body: formData,
  });

  const data = await response.json();

  // Check HTTP status code and add error flag if not successful
  if (!response.ok) {
    return {
      ...data,
      error: true,
    };
  }

  return data;
}

/**
 * Convenience methods for common endpoints
 */
export const apiEndpoints = {
  // Auth
  login: (data: Record<string, unknown>) => apiPost("/login", data),
  register: (data: Record<string, unknown>) => apiPost("/register", data),
  logout: (token: string) => apiPost("/logout", {}, token),
  session: (token: string) => apiGet("/customer/session", token),

  // Products - List and browse
  getProducts: (query?: string) => apiGet(`/products${query || ""}`),
  // Fetch products from organisation/seller - uses /products API with organisationId filter
  // Supports filtering by type: 'single' | 'variant' | undefined for all products
  getProductsByOrg: (
    orgId: string,
    query?: string,
    type?: "single" | "variant",
  ) => {
    const typeParam = type ? `&type=${type}` : "";

    return apiGet(
      `/products?organisationId=${orgId}${typeParam}${query ? `&${query}` : ""}`,
    );
  },

  // Products - API endpoints
  getProduct: (id: string | number) => apiGet(`/products/${id}`),
  createProduct: (data: Record<string, unknown>, token: string) =>
    apiPost("/products", data, token),
  updateProduct: (id: string | number, data: FormData, token: string) =>
    apiUpload(`/products/${id}`, data, token, "PUT"),
  deleteProduct: (id: string | number, token: string) =>
    apiDelete(`/products/${id}`, token),

  // Orders
  getOrders: (token: string) => apiGet("/orders", token),
  getOrder: (id: string | number, token: string) =>
    apiGet(`/orders/${id}`, token),
  createOrder: (data: Record<string, unknown>, token: string) => apiPost("/orders", data, token),
  updateOrderStatus: (id: string | number, status: string, token: string) =>
    apiPatch(`/orders/${id}/status`, { status }, token),
  getOrderInvoice: (id: string | number, token: string) =>
    apiCall(`/orders/${id}/invoice`, { method: "GET", token }),

  // Cart
  getCart: (token: string) => apiGet("/cart", token),
  addToCart: (data: Record<string, unknown>, token: string) => apiPost("/cart", data, token),
  updateCart: (id: string | number, data: Record<string, unknown>, token: string) =>
    apiPatch(`/cart/${id}`, data, token),
  removeFromCart: (id: string | number, token: string) =>
    apiDelete(`/cart/${id}`, token),
  clearCart: (token: string) => apiDelete("/cart", token),

  // Addresses
  getAddresses: (token: string) => apiGet("/addresses", token),
  createAddress: (data: Record<string, unknown>, token: string) =>
    apiPost("/addresses", data, token),
  updateAddress: (id: string | number, data: Record<string, unknown>, token: string) =>
    apiPut(`/addresses/${id}`, data, token),
  deleteAddress: (id: string | number, token: string) =>
    apiDelete(`/addresses/${id}`, token),

  // Organizations
  getOrganisations: () => apiGet("/organisations"),
  getOrganisation: (id: string | number) => apiGet(`/organisations/${id}`),
  getOrganisationByCode: (code: string) =>
    apiGet(`/organisation/by_code/${code}`),

  // Categories
  getCategories: (token?: string) =>
    token ? apiGet("/categories", token) : apiGet("/categories"),
  getOrganisationCategories: (orgId: string | number) =>
    apiGet(`/organisation/${orgId}/categories`),

  // Sellers
  sellerLogin: (data: Record<string, unknown>) => apiPost("/seller/login", data),
  sellerRegister: (data: Record<string, unknown>) => apiPost("/seller/register", data),
  sellerCheckAuth: (token: string) => apiGet("/seller/me", token),
  sellerSelectStore: (data: Record<string, unknown>, token: string) =>
    apiPost("/seller/select-store", data, token),
  getSellerOrders: (orgId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/orders`, token),
  getSellerDashboard: (orgId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/dashboard`, token),
  getSellerCustomers: (orgId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/customers`, token),

  // Admin
  adminLogin: (data: Record<string, unknown>) => apiPost("/admin/login", data),
  getAdminStats: (token: string) => apiGet("/admin/stats", token),
  getAdminOrganisations: (token: string) =>
    apiGet("/admin/organisations", token),
  createAdminOrganisation: (data: Record<string, unknown>, token: string) =>
    apiPost("/admin/organisations", data, token),
  updateAdminOrganisation: (id: number, data: Record<string, unknown>, token: string) =>
    apiPatch(`/admin/organisations/${id}/full-update`, data, token),
  deleteAdminOrganisation: (id: number, token: string) =>
    apiDelete(`/admin/organisations/${id}`, token),
  getMasterSellerToken: (orgId: number, token: string) =>
    apiPost(`/admin/organisations/${orgId}/master-seller-token`, {}, token),
  getAdminProducts: (token: string) => apiGet("/admin/products", token),
  getAdminOrders: (token: string) => apiGet("/admin/orders", token),
  getAdminSellers: (token: string) => apiGet("/admin/sellers", token),
  getAdminSettings: (token: string) => apiGet("/admin/settings", token),
  updateAdminSettings: (token: string, data: Record<string, unknown>) =>
    apiPut("/admin/settings", data, token),

  // Seller additional endpoints
  getSellerOrderDetail: (
    orgId: string | number,
    orderId: string | number,
    token: string,
  ) => apiGet(`/seller/${orgId}/orders/${orderId}`, token),
  updateSellerOrderStatus: (
    orgId: string | number,
    orderId: string | number,
    status: string,
    token: string,
  ) => apiPatch(`/seller/${orgId}/orders/${orderId}/status`, { status }, token),
  getSellerCustomerOrders: (
    orgId: string | number,
    customerId: string | number,
    token: string,
  ) => apiGet(`/seller/${orgId}/customers/${customerId}/orders`, token),
  getSellerProductGroups: (
    orgId: string | number,
    token: string,
    page?: number,
    limit?: number,
    search?: string,
    type?: "single" | "variant",
  ) => {
    const typeParam = type ? `&type=${type}` : "";

    return apiGet(
      `/seller/${orgId}/product-groups?page=${page || 1}&limit=${limit || 20}${search ? `&search=${encodeURIComponent(search)}` : ""}${typeParam}`,
      token,
    );
  },
  getSellerProductGroupDetail: (
    orgId: string | number,
    groupId: string | number,
    token: string,
  ) => apiGet(`/seller/${orgId}/product-groups/${groupId}`, token),
  createProductWithVariants: (
    orgId: string | number,
    data: FormData,
    token: string,
  ) => apiUpload(`/seller/${orgId}/products/variants`, data, token),
  updateProductVariants: (
    productId: string | number,
    data: FormData,
    token: string,
  ) => apiUpload(`/products/${productId}`, data, token, "PUT"),

  // NEW: Simplified product creation for sellers (simple or variant)
  createSellerProductV2: (data: Record<string, unknown>, token: string) =>
    apiPost("/products/create", data, token),

  updateSellerStore: (orgId: string | number, data: Record<string, unknown>, token: string) =>
    apiPut(`/seller/${orgId}/store`, data, token),

  // Public Data
  getCountries: () => apiGet("/public/countries"),
  getStates: (countryCode: string) => apiGet(`/public/state/${countryCode}`),

  // Seller Categories
  getSellerCategories: (orgId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/categories`, token),
  createSellerCategory: (orgId: string | number, data: Record<string, unknown>, token: string) =>
    apiPost(`/seller/${orgId}/categories`, data, token),
  updateSellerCategory: (
    orgId: string | number,
    categoryId: string | number,
    data: Record<string, unknown>,
    token: string,
  ) => apiPut(`/seller/${orgId}/categories/${categoryId}`, data, token),
  deleteSellerCategory: (
    orgId: string | number,
    categoryId: string | number,
    token: string,
  ) => apiDelete(`/seller/${orgId}/categories/${categoryId}`, token),

  // Analytics - Tracking endpoints (public, no auth)
  trackPageView: (orgId: string | number, data: Record<string, unknown>) =>
    apiPost(`/seller/${orgId}/analytics/track-page-view`, data),
  trackUserEvent: (orgId: string | number, data: Record<string, unknown>) =>
    apiPost(`/seller/${orgId}/analytics/track-event`, data),

  // Analytics - Stats endpoints (protected, requires auth)
  getSellerPageViewStats: (
    orgId: string | number,
    pageType: "about" | "contact" | "store" | "storefront" | "product-page",
    token: string,
  ) =>
    apiGet(`/seller/${orgId}/analytics/page-views?pageType=${pageType}`, token),
  getSellerEventStats: (
    orgId: string | number,
    eventType?: string,
    token?: string,
  ) => {
    const params = eventType ? `?eventType=${eventType}` : "";

    return apiGet(`/seller/${orgId}/analytics/events${params}`, token || "");
  },

  // Seller Pages - About & Contact (authenticated)
  getSellerAboutPage: async (orgId: string | number, token: string) => {
    const response = await apiGet(`/seller/${orgId}/pages/about`, token);

    return response.page || response;
  },
  saveSellerAboutPage: (
    orgId: string | number,
    content: string,
    token: string,
  ) => apiPost(`/seller/${orgId}/pages/about`, { content }, token),
  getSellerContactPage: async (orgId: string | number, token: string) => {
    const response = await apiGet(`/seller/${orgId}/pages/contact`, token);

    return response.page || response;
  },
  saveSellerContactPage: (orgId: string | number, data: Record<string, unknown>, token: string) =>
    apiPost(`/seller/${orgId}/pages/contact`, data, token),

  // Public Pages - About & Contact (for storefront display, no auth required)
  getPublicAboutPage: (orgCode: string) =>
    apiGet(`/organisation/${orgCode}/page/about`),
  getPublicContactPage: (orgCode: string) =>
    apiGet(`/organisation/${orgCode}/page/contact`),
};
