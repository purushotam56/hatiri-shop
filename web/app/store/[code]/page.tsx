import { StoreHomePage } from "@/components/store-home-page";

export default function StorePage({ params }: { params: { code: string } }) {
  return <StoreHomePage storeCode={params.code.toUpperCase()} />;
}
