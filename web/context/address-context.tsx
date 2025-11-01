"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useAuth } from "./auth-context";

export interface Address {
  id?: number;
  label: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: Address[];
  selectedAddress: Address | null;
  addAddress: (address: Address) => Promise<void>;
  updateAddress: (id: number, address: Address) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
  setSelectedAddress: (address: Address | null) => void;
  isLoading: boolean;
  fetchAddresses: () => Promise<void>;
  syncAddresses: () => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [localAddresses, setLocalAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const API_URL = "http://localhost:3333/api";

  // Load local addresses on mount
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const storedAddresses = localStorage.getItem("addresses");
      if (storedAddresses) {
        try {
          const parsed = JSON.parse(storedAddresses);
          setLocalAddresses(parsed);
          const defaultAddr = parsed.find((a: Address) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddress(defaultAddr);
          }
        } catch (e) {
          localStorage.removeItem("addresses");
        }
      }
    }
  }, []);

  // Fetch addresses from backend only when user logs in
  useEffect(() => {
    if (isLoggedIn && mounted) {
      fetchAddresses();
    }
  }, [isLoggedIn, mounted]);

  // Save local addresses to localStorage
  useEffect(() => {
    if (mounted && typeof window !== "undefined" && !isLoggedIn) {
      localStorage.setItem("addresses", JSON.stringify(localAddresses));
    }
  }, [localAddresses, mounted, isLoggedIn]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  };

  const fetchAddresses = async () => {
    if (!isLoggedIn) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/addresses`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) throw new Error("Failed to fetch addresses");

      const data = await response.json();
      // Backend returns { addresses: [...] }
      const addressArray = Array.isArray(data) ? data : (data.addresses || []);
      setAddresses(addressArray);

      const defaultAddr = addressArray.find((a: Address) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncAddresses = async () => {
    if (!isLoggedIn || localAddresses.length === 0) return;

    setIsLoading(true);
    try {
      for (const addr of localAddresses) {
        await fetch(`${API_URL}/addresses`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(addr),
        });
      }
      // Clear local addresses and fetch from backend
      setLocalAddresses([]);
      localStorage.removeItem("addresses");
      await fetchAddresses();
    } catch (error) {
      console.error("Error syncing addresses:", error);
      throw error; // Re-throw so caller knows sync failed
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (address: Address) => {
    if (isLoggedIn) {
      // Backend mode
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/addresses`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(address),
        });

        if (!response.ok) throw new Error("Failed to add address");

        const newAddr = await response.json();
        const updatedAddresses = addresses.map((a) => ({
          ...a,
          isDefault: false,
        }));
        updatedAddresses.push(newAddr);
        setAddresses(updatedAddresses);
        setSelectedAddress(newAddr);
      } catch (error) {
        console.error("Error adding address:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local mode
      const newAddress = {
        ...address,
        id: Date.now(),
      };
      const updatedAddresses = localAddresses.map((a) => ({
        ...a,
        isDefault: false,
      }));
      updatedAddresses.push(newAddress);
      setLocalAddresses(updatedAddresses);
      setSelectedAddress(newAddress);
    }
  };

  const updateAddress = async (id: number, address: Address) => {
    if (isLoggedIn) {
      // Backend mode
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/addresses/${id}`, {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify(address),
        });

        if (!response.ok) throw new Error("Failed to update address");

        const updatedAddr = await response.json();
        const updatedAddresses = addresses.map((a) =>
          a.id === id ? updatedAddr : { ...a, isDefault: false }
        );
        setAddresses(updatedAddresses);
        if (selectedAddress?.id === id) {
          setSelectedAddress(updatedAddr);
        }
      } catch (error) {
        console.error("Error updating address:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local mode
      const updatedAddresses = localAddresses.map((a) =>
        a.id === id ? { ...address, id } : { ...a, isDefault: false }
      );
      setLocalAddresses(updatedAddresses);
      if (selectedAddress?.id === id) {
        setSelectedAddress({ ...address, id });
      }
    }
  };

  const deleteAddress = async (id: number) => {
    if (isLoggedIn) {
      // Backend mode
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/addresses/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        if (!response.ok) throw new Error("Failed to delete address");

        const updated = addresses.filter((a) => a.id !== id);
        setAddresses(updated);
        if (selectedAddress?.id === id) {
          setSelectedAddress(updated.length > 0 ? updated[0] : null);
        }
      } catch (error) {
        console.error("Error deleting address:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local mode
      const updated = localAddresses.filter((a) => a.id !== id);
      setLocalAddresses(updated);
      if (selectedAddress?.id === id) {
        setSelectedAddress(updated.length > 0 ? updated[0] : null);
      }
    }
  };

  const displayAddresses = isLoggedIn ? addresses : localAddresses;

  // Ensure displayAddresses is always an array
  const safeAddresses = Array.isArray(displayAddresses) ? displayAddresses : [];

  return (
    <AddressContext.Provider
      value={{
        addresses: safeAddresses,
        selectedAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        setSelectedAddress,
        isLoading,
        fetchAddresses,
        syncAddresses,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within AddressProvider");
  }
  return context;
}
