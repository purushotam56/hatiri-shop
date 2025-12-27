import { headers } from "next/headers";

import OrdersPageContent from "./orders-page-content";

import { StoreLayout } from "@/components/layouts/store-layout";
import { apiEndpoints } from "@/lib/api-client";

function getSubdomainCode(hostname: string): string | null {
  if (/^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    return null;
  }

  const parts = hostname.split(".");

  if (parts.length >= 3 && parts[0] !== "localhost" && parts[0] !== "www") {
    return parts[0].toUpperCase();
  }

  return null;
}

async function getStoreByCode(code: string) {
  try {
    const response = await apiEndpoints.getOrganisationByCode(code);

    return response?.organisation || response?.data || null;
  } catch (error) {
    // console.error("Failed to fetch store:", error);

    return null;
  }
}

export default async function OrdersPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const subdomainCode = getSubdomainCode(host);

  let storeCode = "";
  let storeName = "";
  let logoUrl = "";

  if (subdomainCode) {
    const store = await getStoreByCode(subdomainCode);

    if (store) {
      storeCode = subdomainCode;
      storeName = store.name || "";
      logoUrl = store.image?.url || "";
    }
  }

  return (
    <StoreLayout logoUrl={logoUrl} storeCode={storeCode} storeName={storeName}>
      <OrdersPageContent />
    </StoreLayout>
  );
}
