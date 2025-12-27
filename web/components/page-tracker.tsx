"use client";

import { useEffect, useRef } from "react";

import {
  trackPageView,
  trackPageViewDuration,
  initializeAnalytics,
} from "@/lib/analytics";

interface PageTrackerProps {
  pageType: "about" | "contact" | "store" | "storefront" | "product-page";
  organisationId: number;
  apiUrl: string;
  productId?: number;
  pageIdentifier?: string; // Optional identifier like storeCode, slugs, etc.
}

/**
 * Generic Page Tracker Component
 * Tracks page views with automatic geo-location detection
 *
 * Usage:
 * <PageTracker pageType="about" organisationId={1} apiUrl={apiUrl} />
 * <PageTracker pageType="product-page" organisationId={1} apiUrl={apiUrl} productId={123} />
 */
export function PageTracker({
  pageType,
  organisationId,
  apiUrl,
  productId,
  pageIdentifier,
}: PageTrackerProps) {
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Initialize time on first render
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    // Initialize analytics
    initializeAnalytics();

    // Wait a bit for geo-location to be fetched before tracking
    const trackingTimer = setTimeout(() => {
      trackPageView(apiUrl, organisationId, pageType, undefined, productId);
    }, 500);

    // Track duration on unmount
    const cleanup = () => {
      clearTimeout(trackingTimer);
      const duration = Date.now() - (startTimeRef.current || Date.now());

      trackPageViewDuration(
        apiUrl,
        organisationId,
        pageType,
        duration,
        productId,
      );
    };

    return cleanup;
  }, [pageType, organisationId, apiUrl, productId, pageIdentifier]);

  return null;
}
