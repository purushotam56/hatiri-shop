import { StoreHomePage } from "@/components/store-home-page";
import { StoreLayout } from "@/components/layouts/store-layout";

export default function StorePage({ params }: { params: { code: string } }) {
  const code = params.code.toUpperCase();
  return (
    <StoreLayout storeCode={code}>
      <StoreHomePage storeCode={code} />
    </StoreLayout>
  );
}
