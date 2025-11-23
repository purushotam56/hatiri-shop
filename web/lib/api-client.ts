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
  options: FetchOptions = {}
): Promise<Response> {
  const { token, ...fetchOptions } = options;

  const url = buildApiUrl(endpoint);
  const headers = new Headers(fetchOptions.headers || {});

  // Add authorization header if token is provided
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Ensure content-type is set for JSON requests
  if (fetchOptions.method && ["POST", "PUT", "PATCH"].includes(fetchOptions.method)) {
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
export async function apiPost(
  endpoint: string,
  data?: any,
  token?: string
) {
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
export async function apiPut(
  endpoint: string,
  data?: any,
  token?: string
) {
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
export async function apiPatch(
  endpoint: string,
  data?: any,
  token?: string
) {
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
  method: 'POST' | 'PUT' = 'POST'
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

  return response.json();
}

/**
 * Convenience methods for common endpoints
 */
export const apiEndpoints = {
  // Auth
  login: (data: any) => apiPost("/login", data),
  register: (data: any) => apiPost("/register", data),
  logout: (token: string) => apiPost("/logout", {}, token),
  session: (token: string) => apiGet("/customer/session", token),

  // Products
  getProducts: (query?: string) => apiGet(`/products${query || ""}`),
  getProductsByOrg: (orgId:string,query?: string) => apiGet(`/products?organisationId=${orgId}&${query || ""}`),
  getProduct: (id: string | number) => apiGet(`/products/${id}`),
  createProduct: (data: any, token: string) => apiPost("/products", data, token),
  updateProduct: (id: string | number, data: any, token: string) =>
    apiPut(`/products/${id}`, data, token),
  deleteProduct: (id: string | number, token: string) =>
    apiDelete(`/products/${id}`, token),

  // Orders
  getOrders: (token: string) => apiGet("/orders", token),
  getOrder: (id: string | number, token: string) =>
    apiGet(`/orders/${id}`, token),
  createOrder: (data: any, token: string) => apiPost("/orders", data, token),
  updateOrderStatus: (id: string | number, status: string, token: string) =>
    apiPatch(`/orders/${id}/status`, { status }, token),
  getOrderInvoice: (id: string | number, token: string) =>
    apiCall(`/orders/${id}/invoice`, { method: "GET", token }),

  // Cart
  getCart: (token: string) => apiGet("/cart", token),
  addToCart: (data: any, token: string) => apiPost("/cart", data, token),
  updateCart: (id: string | number, data: any, token: string) =>
    apiPatch(`/cart/${id}`, data, token),
  removeFromCart: (id: string | number, token: string) =>
    apiDelete(`/cart/${id}`, token),
  clearCart: (token: string) => apiDelete("/cart", token),

  // Addresses
  getAddresses: (token: string) => apiGet("/addresses", token),
  createAddress: (data: any, token: string) =>
    apiPost("/addresses", data, token),
  updateAddress: (id: string | number, data: any, token: string) =>
    apiPut(`/addresses/${id}`, data, token),
  deleteAddress: (id: string | number, token: string) =>
    apiDelete(`/addresses/${id}`, token),

  // Organizations
  getOrganisations: () => apiGet("/organisations"),
  getOrganisation: (id: string | number) => apiGet(`/organisations/${id}`),
  getOrganisationByCode: (code: string) => apiGet(`/organisation/by_code/${code}`),

  // Categories
  getCategories: (token?: string) => token ? apiGet("/categories", token) : apiGet("/categories"),
  getOrganisationCategories: (orgId: string | number) => apiGet(`/organisation/${orgId}/categories`),

  // Sellers
  sellerLogin: (data: any) => apiPost("/seller/login", data),
  sellerRegister: (data: any) => apiPost("/seller/register", data),
  sellerSelectStore: (data: any, token: string) =>
    apiPost("/seller/select-store", data, token),
  getSellerProducts: (orgId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/products`, token),
  getSellerOrders: (orgId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/orders`, token),
  getSellerDashboard: (orgId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/dashboard`, token),
  getSellerCustomers: (orgId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/customers`, token),

  // Admin
  adminLogin: (data: any) => apiPost("/admin/login", data),
  getAdminStats: (token: string) => apiGet("/admin/stats", token),
  getAdminOrganisations: (token: string) =>
    apiGet("/admin/organisations", token),
  createAdminOrganisation: (data: any, token: string) =>
    apiPost("/admin/organisations", data, token),
  updateAdminOrganisation: (id: number, data: any, token: string) =>
    apiPatch(`/admin/organisations/${id}/full-update`, data, token),
  deleteAdminOrganisation: (id: number, token: string) =>
    apiDelete(`/admin/organisations/${id}`, token),
  getAdminProducts: (token: string) => apiGet("/admin/products", token),
  getAdminOrders: (token: string) => apiGet("/admin/orders", token),
  getAdminSellers: (token: string) => apiGet("/admin/sellers", token),
  getAdminSettings: (token: string) => apiGet("/admin/settings", token),
  updateAdminSettings: (token: string, data: any) => apiPut("/admin/settings", data, token),
  
  // Seller additional endpoints
  getSellerOrderDetail: (orgId: string | number, orderId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/orders/${orderId}`, token),
  updateSellerOrderStatus: (orgId: string | number, orderId: string | number, status: string, token: string) =>
    apiPatch(`/seller/${orgId}/orders/${orderId}/status`, { status }, token),
  getSellerCustomerOrders: (orgId: string | number, customerId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/customers/${customerId}/orders`, token),
  getSellerProductGroups: (orgId: string | number, token: string, page?: number, limit?: number, search?: string) =>
    apiGet(`/seller/${orgId}/product-groups?page=${page || 1}&limit=${limit || 20}${search ? `&search=${encodeURIComponent(search)}` : ''}`, token),
  getSellerProductGroupDetail: (orgId: string | number, groupId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/product-groups/${groupId}`, token),
  createProductWithVariants: (orgId: string | number, data: FormData, token: string) =>
    apiUpload(`/seller/${orgId}/products/variants`, data, token),
  updateProductVariants: (orgId: string | number, groupId: string | number, data: FormData, token: string) =>
    apiUpload(`/seller/${orgId}/products/variants/${groupId}`, data, token, 'PUT'),
  updateSellerStore: (orgId: string | number, data: any, token: string) =>
    apiPut(`/seller/${orgId}/store`, data, token),

  // Public Data
  getCountries: () => apiGet("/public/countries"),
  getStates: (countryCode: string) => apiGet(`/public/state/${countryCode}`),

  // Seller Categories
  getSellerCategories: (orgId: string | number, token: string) =>
    apiGet(`/seller/${orgId}/categories`, token),
  createSellerCategory: (orgId: string | number, data: any, token: string) =>
    apiPost(`/seller/${orgId}/categories`, data, token),
  updateSellerCategory: (orgId: string | number, categoryId: string | number, data: any, token: string) =>
    apiPut(`/seller/${orgId}/categories/${categoryId}`, data, token),
  deleteSellerCategory: (orgId: string | number, categoryId: string | number, token: string) =>
    apiDelete(`/seller/${orgId}/categories/${categoryId}`, token),
};
