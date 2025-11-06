import { StoreHomePage } from "@/components/store-home-page";
import { StoreLayout } from "@/components/layouts/store-layout";

export default async function StorePage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ code: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { code } = await params;
  const { category } = await searchParams;
  
  return (
    <StoreLayout storeCode={code.toUpperCase()}>
      <StoreHomePage storeCode={code.toUpperCase()} selectedCategoryId={category} />
    </StoreLayout>
  );
}
