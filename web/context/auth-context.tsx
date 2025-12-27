"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import { apiEndpoints } from "@/lib/api-client";

export interface User {
  id: number;
  email: string;
  phoneNumber?: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load user from localStorage and verify with backend if token exists
  useEffect(() => {
    Promise.resolve().then(() => {
      setMounted(true);
    });
    const loadUser = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");

        // If no token, just load from localStorage
        if (!token) {
          const storedUser = localStorage.getItem("user");

          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (_e) {
              localStorage.removeItem("user");
            }
          }

          return;
        }

        // If token exists, verify with backend
        try {
          const data = await apiEndpoints.session(token);

          if (data.isLoggedIn && data.user) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            // Token is invalid, clear everything
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        } catch (error) {
          // console.error("Session check failed:", error);
          // On error, clear token and user
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        }
      }
    };

    loadUser();
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    }
  }, [user, mounted]);

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, setUser, logout, isLoading: !mounted }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
