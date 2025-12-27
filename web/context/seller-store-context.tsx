"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useReducer,
  ReactNode,
} from "react";

import { apiEndpoints } from "@/lib/api-client";

export interface Store {
  id: number | string;
  name: string;
  code: string;
  currency?: string;
  dateFormat?: string;
  image?:
    | {
        url: string;
      }
    | string;
}

export interface SellerUser {
  id: number | string;
  email: string;
  fullName: string;
  mobile?: string;
  organisationName?: string;
  organisationCode?: string;
  businessType?: string;
  city?: string;
  country?: string;
}

export type AuthAction =
  | { type: "LOGIN_START" }
  | {
      type: "LOGIN_SUCCESS";
      payload: { user: SellerUser; token: string; stores: Store[] };
    }
  | { type: "LOGIN_ERROR"; payload: string }
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS" }
  | { type: "REGISTER_ERROR"; payload: string }
  | { type: "LOGOUT" }
  | {
      type: "CHECK_AUTH";
      payload: { user: SellerUser; token: string; stores: Store[] };
    }
  | { type: "AUTH_CHECK_FAILED" }
  | { type: "AUTH_CHECK_START" }
  | { type: "AUTH_CHECK_COMPLETE" }
  | { type: "CLEAR_ERROR" };

export interface AuthState {
  user: SellerUser | null;
  token: string | null;
  loading: boolean;
  error: string;
  isAuthenticated: boolean;
  stores: Store[];
  isInitializing: boolean;
}

export interface SellerStoreContextType {
  // Store selection
  selectedStore: Store | null;
  setSelectedStore: (store: Store) => void;
  stores: Store[];
  setStores: (stores: Store[]) => void;
  clearStore: () => void;

  // Auth state
  authState: AuthState;

  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    fullName: string;
    mobile: string;
    organisationName: string;
    organisationCode: string;
    businessType: string;
    city: string;
    country: string;
  }) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const initialAuthState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: "",
  isAuthenticated: false,
  stores: [],
  isInitializing: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, loading: true, error: "" };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        user: action.payload.user,
        token: action.payload.token,
        stores: action.payload.stores,
        isAuthenticated: true,
        error: "",
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
      };

    case "REGISTER_START":
      return { ...state, loading: true, error: "" };

    case "REGISTER_SUCCESS":
      return { ...state, loading: false, error: "" };

    case "REGISTER_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "CHECK_AUTH":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        stores: action.payload.stores,
        isAuthenticated: true,
      };

    case "AUTH_CHECK_FAILED":
      return initialAuthState;

    case "LOGOUT":
      return { ...initialAuthState, isInitializing: false };

    case "CLEAR_ERROR":
      return { ...state, error: "" };

    case "AUTH_CHECK_START":
      return { ...state, loading: true, isInitializing: true };

    case "AUTH_CHECK_COMPLETE":
      return { ...state, loading: false, isInitializing: false };

    default:
      return state;
  }
}

const SellerStoreContext = createContext<SellerStoreContextType | undefined>(
  undefined,
);

export function SellerStoreProvider({ children }: { children: ReactNode }) {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  // Check auth on mount
  useEffect(() => {
    validateAuthFromStorage();
  }, []);

  const validateAuthFromStorage = async () => {
    dispatch({ type: "AUTH_CHECK_START" });

    try {
      const token = localStorage.getItem("sellerToken");
      const userStr = localStorage.getItem("sellerUser");
      const storesStr = localStorage.getItem("sellerStores");

      if (!token || !userStr) {
        dispatch({ type: "AUTH_CHECK_FAILED" });
        dispatch({ type: "AUTH_CHECK_COMPLETE" });

        return;
      }

      // Validate token with server
      const response = await apiEndpoints.sellerCheckAuth(token);

      if (response.error || !response.data) {
        // Token is invalid or expired
        localStorage.removeItem("sellerToken");
        localStorage.removeItem("sellerUser");
        localStorage.removeItem("sellerStores");
        localStorage.removeItem("selectedSellerStore");
        dispatch({ type: "AUTH_CHECK_FAILED" });
      } else {
        // Token is valid
        const user = response.data;
        const stores = response.stores || JSON.parse(storesStr || "[]");

        // Auto-select store if only 1 is available
        if (stores.length === 1) {
          localStorage.setItem(
            "selectedSellerStore",
            JSON.stringify(stores[0]),
          );
          setSelectedStore(stores[0]);
        }

        dispatch({
          type: "CHECK_AUTH",
          payload: { user, token, stores },
        });
      }
    } catch (err) {
      // console.error("Failed to validate auth:", err);
      // On network error, use cached auth if available
      try {
        const token = localStorage.getItem("sellerToken");
        const userStr = localStorage.getItem("sellerUser");
        const storesStr = localStorage.getItem("sellerStores");

        if (token && userStr) {
          const user = JSON.parse(userStr);
          const stores = storesStr ? JSON.parse(storesStr) : [];

          // Auto-select store if only 1 is available
          if (stores.length === 1) {
            localStorage.setItem(
              "selectedSellerStore",
              JSON.stringify(stores[0]),
            );
            setSelectedStore(stores[0]);
          }

          dispatch({
            type: "CHECK_AUTH",
            payload: { user, token, stores },
          });
        } else {
          dispatch({ type: "AUTH_CHECK_FAILED" });
        }
      } catch (storageErr) {
        // console.error("Failed to read from storage:", storageErr);
        dispatch({ type: "AUTH_CHECK_FAILED" });
      }
    } finally {
      dispatch({ type: "AUTH_CHECK_COMPLETE" });
    }
  };

  const checkAuth = async () => {
    await validateAuthFromStorage();
  };

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const data = await apiEndpoints.sellerLogin({ email, password });

      // Handle error response from server
      if (data.error) {
        dispatch({ type: "LOGIN_ERROR", payload: data.error });

        return;
      }

      if (!data.user || !data.token) {
        dispatch({
          type: "LOGIN_ERROR",
          payload: data.message || "Login failed",
        });

        return;
      }

      // Store in localStorage
      localStorage.setItem("sellerToken", data.token);
      localStorage.setItem("sellerUser", JSON.stringify(data.user));

      const storesData = data.stores || [];

      if (storesData.length > 0) {
        localStorage.setItem("sellerStores", JSON.stringify(storesData));
      }

      // Auto-select store if only 1 is available
      if (storesData.length === 1) {
        localStorage.setItem(
          "selectedSellerStore",
          JSON.stringify(storesData[0]),
        );
        setSelectedStore(storesData[0]);
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: data.user,
          token: data.token,
          stores: storesData,
        },
      });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      const errorMessage = error.message || "Connection error";

      dispatch({ type: "LOGIN_ERROR", payload: errorMessage });
      throw err;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    fullName: string;
    mobile: string;
    organisationName: string;
    organisationCode: string;
    businessType: string;
    city: string;
    country: string;
  }) => {
    dispatch({ type: "REGISTER_START" });

    try {
      const response = await apiEndpoints.sellerRegister(data);

      if (!response.user) {
        dispatch({
          type: "REGISTER_ERROR",
          payload: response.message || "Registration failed",
        });

        return;
      }

      dispatch({ type: "REGISTER_SUCCESS" });
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      const errorMessage = error.message || "Connection error";

      dispatch({ type: "REGISTER_ERROR", payload: errorMessage });
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerUser");
    localStorage.removeItem("sellerStores");
    localStorage.removeItem("selectedSellerStore");

    setSelectedStore(null);
    setStores([]);
    dispatch({ type: "LOGOUT" });
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const handleSetSelectedStore = (store: Store) => {
    setSelectedStore(store);
    localStorage.setItem("selectedSellerStore", JSON.stringify(store));
  };

  const handleSetStores = (stores: Store[]) => {
    setStores(stores);
    localStorage.setItem("sellerStores", JSON.stringify(stores));
  };

  const handleClearStore = () => {
    setSelectedStore(null);
    setStores([]);
    localStorage.removeItem("selectedSellerStore");
    localStorage.removeItem("sellerStores");
  };

  // Always render children - auth state will be available via context
  // Components should check authState.isInitializing and authState.isAuthenticated
  return (
    <SellerStoreContext.Provider
      value={{
        selectedStore,
        setSelectedStore: handleSetSelectedStore,
        stores,
        setStores: handleSetStores,
        clearStore: handleClearStore,
        authState,
        login,
        register,
        logout,
        checkAuth,
        clearError,
      }}
    >
      {children}
    </SellerStoreContext.Provider>
  );
}

export function useSellerStore() {
  const context = useContext(SellerStoreContext);

  if (context === undefined) {
    throw new Error("useSellerStore must be used within a SellerStoreProvider");
  }

  return context;
}

export function useSellerAuth() {
  const context = useContext(SellerStoreContext);

  if (context === undefined) {
    throw new Error("useSellerAuth must be used within a SellerStoreProvider");
  }

  return {
    authState: context.authState,
    login: context.login,
    register: context.register,
    logout: context.logout,
    checkAuth: context.checkAuth,
    clearError: context.clearError,
  };
}
