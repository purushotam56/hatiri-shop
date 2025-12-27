import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  currency?: string;
  stock: number;
  image?: string;
  category?: string;
}

// Products service
export const productsService = {
  // Get all products with optional filters
  getAll: async (filters?: { category?: string; search?: string }) => {
    const params = new URLSearchParams();

    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);

    const query = params.toString() ? `?${params.toString()}` : "";

    return await fetch(`/api/products${query}`).then((r) => r.json());
  },

  // Get single product
  getById: async (id: number) => {
    return await fetch(`/api/products/${id}`).then((r) => r.json());
  },

  // Create product (admin)
  create: async (data: Partial<Product>) => {
    return await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());
  },

  // Update product (admin)
  update: async (id: number, data: Partial<Product>) => {
    return await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());
  },

  // Hide product
  hide: async (id: number) => {
    return await fetch(`/api/products/${id}/hide`, { method: "POST" }).then(
      (r) => r.json(),
    );
  },

  // Show product
  show: async (id: number) => {
    return await fetch(`/api/products/${id}/show`, { method: "POST" }).then(
      (r) => r.json(),
    );
  },
};

// Orders service
export const ordersService = {
  // Get all orders for user
  getAll: async () => {
    return await fetch("/api/orders").then((r) => r.json());
  },

  // Get single order
  getById: async (id: string) => {
    return await fetch(`/api/orders/${id}`).then((r) => r.json());
  },

  // Create order
  create: async (data: Record<string, unknown>) => {
    return await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());
  },

  // Track order (real-time)
  track: async (id: string) => {
    return await fetch(`/api/orders/${id}/track`).then((r) => r.json());
  },

  // Cancel order
  cancel: async (id: string) => {
    return await fetch(`/api/orders/${id}/cancel`, { method: "POST" }).then(
      (r) => r.json(),
    );
  },
};

// Cart service
export const cartService = {
  // Get cart
  get: async () => {
    return await fetch("/api/cart").then((r) => r.json());
  },

  // Add to cart
  addItem: async (productId: number, quantity: number) => {
    return await fetch("/api/cart/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    }).then((r) => r.json());
  },

  // Update cart item
  updateItem: async (itemId: number, quantity: number) => {
    return await fetch(`/api/cart/items/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    }).then((r) => r.json());
  },

  // Remove from cart
  removeItem: async (itemId: number) => {
    return await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" }).then(
      (r) => r.json(),
    );
  },

  // Clear cart
  clear: async () => {
    return await fetch("/api/cart", { method: "DELETE" }).then((r) => r.json());
  },
};

// User service
export const userService = {
  // Get user profile
  getProfile: async () => {
    return await fetch("/api/user/profile").then((r) => r.json());
  },

  // Update profile
  updateProfile: async (data: Record<string, unknown>) => {
    return await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());
  },

  // Get addresses
  getAddresses: async () => {
    return await fetch("/api/user/addresses").then((r) => r.json());
  },

  // Add address
  addAddress: async (data: Record<string, unknown>) => {
    return await fetch("/api/user/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());
  },

  // Update address
  updateAddress: async (id: number, data: Record<string, unknown>) => {
    return await fetch(`/api/user/addresses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());
  },

  // Delete address
  deleteAddress: async (id: number) => {
    return await fetch(`/api/user/addresses/${id}`, { method: "DELETE" }).then(
      (r) => r.json(),
    );
  },

  // Get saved items
  getSavedItems: async () => {
    return await fetch("/api/user/saved-items").then((r) => r.json());
  },

  // Save item
  saveItem: async (productId: number) => {
    return await fetch("/api/user/saved-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    }).then((r) => r.json());
  },

  // Remove saved item
  removeSavedItem: async (productId: number) => {
    return await fetch(`/api/user/saved-items/${productId}`, {
      method: "DELETE",
    }).then((r) => r.json());
  },
};

// Auth service
export const authService = {
  // Login
  login: async (email: string, password: string) => {
    return await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    }).then((r) => r.json());
  },

  // Register
  register: async (data: Record<string, unknown>) => {
    return await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((r) => r.json());
  },

  // Logout
  logout: async () => {
    return await fetch("/api/auth/logout", { method: "POST" }).then((r) =>
      r.json(),
    );
  },

  // Verify OTP
  verifyOtp: async (email: string, otp: string) => {
    return await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    }).then((r) => r.json());
  },
};

// Hook: useProducts - fetch products with filters
export const useProducts = (filters?: {
  category?: string;
  search?: string;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productsService.getAll(filters);

        setProducts(data.data || data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters?.category, filters?.search]);

  return { products, loading, error };
};

// Hook: useOrders - fetch user orders
export const useOrders = () => {
  const [orders, setOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await ordersService.getAll();

        setOrders(data.data || data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, loading, error };
};
