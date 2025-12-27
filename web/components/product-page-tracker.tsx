"use client";

import { PageTracker } from "./page-tracker";

interface ProductPageTrackerProps {
  productId: number;
  organisationId: number;
  apiUrl: string;
}

/**
 * Product Page Tracker Component
 * Convenience wrapper around PageTracker for product pages
 * @deprecated Use PageTracker directly instead
 */
export function ProductPageTracker({
  productId,
  organisationId,
  apiUrl,
}: ProductPageTrackerProps) {
  return (
    <PageTracker
      apiUrl={apiUrl}
      organisationId={organisationId}
      pageType="product-page"
      productId={productId}
    />
  );
}
