"use client";

import { PageTracker } from "./page-tracker";

interface StorePageTrackerProps {
  storeCode: string;
  organisationId: number;
  apiUrl: string;
}

/**
 * Store Page Tracker Component
 * Convenience wrapper around PageTracker for storefront pages
 * @deprecated Use PageTracker directly instead
 */
export function StorePageTracker({
  storeCode,
  organisationId,
  apiUrl,
}: StorePageTrackerProps) {
  return (
    <PageTracker
      apiUrl={apiUrl}
      organisationId={organisationId}
      pageIdentifier={storeCode}
      pageType="storefront"
    />
  );
}
