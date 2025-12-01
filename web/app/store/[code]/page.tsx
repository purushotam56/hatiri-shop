import { StoreHomePage } from "@/components/store-home-page";
import { StoreLayout } from "@/components/layouts/store-layout";
import { apiEndpoints } from "@/lib/api-client";

async function getStoreByCode(code: string) {
  try {
    const response = await apiEndpoints.getOrganisationByCode(code);
    const org = response?.organisation || response?.data || null;
    
    // Debug logging
    if (org) {
      console.log('API Response Organisation:', JSON.stringify(org, null, 2));
    }
    
    return org;
  } catch (error) {
    console.error("Failed to fetch store:", error);
    return null;
  }
}

export default async function StorePage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ code: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { code } = await params;
  const { category } = await searchParams;
  const store = await getStoreByCode(code);
  
  // Debug: Log store data to verify image is present
  if (store) {
    console.log('Store data received:', {
      name: store.name,
      hasImage: !!store.image,
      imageUrl: store.image?.url,
      imageData: store.image,
    });
  }
  
  return (
    <StoreLayout 
      storeCode={code.toUpperCase()} 
      storeName={store?.name || ""} 
      logoUrl={store?.image?.url || ""}
    >
      <StoreHomePage storeCode={code.toUpperCase()} selectedCategoryId={category} />
    </StoreLayout>
  );
}
