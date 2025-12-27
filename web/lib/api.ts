// API configuration and base setup
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api";

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};

// Helper to get auth token
export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }

  return null;
};

// Helper to set auth token
export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

// Helper to remove auth token
export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};

// API fetch wrapper with auth
export async function apiCall(
  endpoint: string,
  options: RequestInit = {},
): Promise<Record<string, unknown>> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...apiConfig.headers,
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${apiConfig.baseURL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data?.message || `API Error: ${response.status}`);

      (error as unknown as Record<string, unknown>).status = response.status;
      (error as unknown as Record<string, unknown>).data = data;
      throw error;
    }

    return data;
  } catch (error: unknown) {
    // console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
}

// GET request
export const apiGet = (endpoint: string, options?: RequestInit) =>
  apiCall(endpoint, { ...options, method: "GET" });

// POST request
export const apiPost = (endpoint: string, body?: Record<string, unknown>, options?: RequestInit) =>
  apiCall(endpoint, {
    ...options,
    method: "POST",
    body: JSON.stringify(body),
  });

// PUT request
export const apiPut = (endpoint: string, body?: Record<string, unknown>, options?: RequestInit) =>
  apiCall(endpoint, {
    ...options,
    method: "PUT",
    body: JSON.stringify(body),
  });

// DELETE request
export const apiDelete = (endpoint: string, options?: RequestInit) =>
  apiCall(endpoint, { ...options, method: "DELETE" });

// PATCH request
export const apiPatch = (endpoint: string, body?: Record<string, unknown>, options?: RequestInit) =>
  apiCall(endpoint, {
    ...options,
    method: "PATCH",
    body: JSON.stringify(body),
  });
