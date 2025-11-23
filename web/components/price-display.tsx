"use client";

import React from "react";
import { useAuth } from "@/context/auth-context";

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  priceVisibility?: 'hidden' | 'login_only' | 'visible';
  hasDiscount?: boolean;
}

export function PriceDisplay({
  price,
  originalPrice,
  priceVisibility = 'visible',
  hasDiscount = false,
}: PriceDisplayProps) {
  const { isLoggedIn } = useAuth();

  // If hidden for everyone, don't show price
  if (priceVisibility === 'hidden') {
    return (
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base sm:text-lg md:text-xl font-bold text-default-300 blur-sm">
          ₹0000
        </span>
      </div>
    );
  }

  // If login_only, show only if logged in
  if (priceVisibility === 'login_only') {
    if (!isLoggedIn) {
      return (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base sm:text-lg md:text-xl font-bold text-default-300 blur-sm">
            ₹0000
          </span>
          <span className="text-xs text-default-500 font-medium">
            Login to view
          </span>
        </div>
      );
    }
  }

  // Show price for 'visible' or logged-in 'login_only'
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-base sm:text-lg md:text-xl font-bold text-foreground">
        ₹{parseFloat(String(price)).toFixed(0)}
      </span>
      {hasDiscount && originalPrice && (
        <span className="text-xs text-foreground/50 line-through">
          ₹{parseFloat(String(originalPrice)).toFixed(0)}
        </span>
      )}
    </div>
  );
}
