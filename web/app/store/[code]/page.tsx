import { StoreLayout } from "@/components/layouts/store-layout";
import { StoreHomePage } from "@/components/store-home-page";
import { StorePageTracker } from "@/components/store-page-tracker";
import { API_CONFIG } from "@/config/api";
import { apiEndpoints } from "@/lib/api-client";

async function getStoreByCode(code: string) {
  try {
    const response = await apiEndpoints.getOrganisationByCode(code);
    const org = response?.organisation || response?.data || null;

    return org;
  } catch (error) {
    console.error("Failed to fetch store:", error);

    return null;
  }
}

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { code } = await params;
  const { category } = await searchParams;
  const store = await getStoreByCode(code);

  return (
    <>
      {store && (
        <StorePageTracker
          apiUrl={API_CONFIG.apiBaseUrl}
          organisationId={store.id}
          storeCode={code.toUpperCase()}
        />
      )}
      <StoreLayout
        logoUrl={store?.image?.url || ""}
        storeCode={code.toUpperCase()}
        storeName={store?.name || ""}
      >
        <StoreHomePage
          selectedCategoryId={category}
          storeCode={code.toUpperCase()}
        />
      </StoreLayout>
    </>
  );
}
