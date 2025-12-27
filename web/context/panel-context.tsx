"use client";

import React, { createContext, useContext } from "react";

import { usePanelType } from "@/lib/hooks/use-panel-type";
import { PanelType, PanelConfig } from "@/types/panel";

interface PanelContextType {
  panelType: PanelType;
  config: PanelConfig;
  isAdminPanel: boolean;
  isSellerPanel: boolean;
  isStore: boolean;
  isOrders: boolean;
  isLanding: boolean;
  isAccountPage: boolean;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

/**
 * Provider component for panel type detection
 */
export function PanelProvider({ children }: { children: React.ReactNode }) {
  const panelInfo = usePanelType();

  return (
    <PanelContext.Provider value={panelInfo}>{children}</PanelContext.Provider>
  );
}

/**
 * Hook to access panel type information from anywhere in the app
 */
export function usePanel(): PanelContextType {
  const context = useContext(PanelContext);

  if (!context) {
    throw new Error("usePanel must be used within a PanelProvider");
  }

  return context;
}
