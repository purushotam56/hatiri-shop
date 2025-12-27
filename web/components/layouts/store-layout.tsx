import { StoreFooter } from "@/components/footers/store-footer";
import { StoreHeader } from "@/components/store-header";

interface StoreLayoutProps {
  children: React.ReactNode;
  storeCode?: string;
  storeName?: string;
  logoUrl?: string;
}

export function StoreLayout({
  children,
  storeCode = "",
  storeName = "",
  logoUrl = "",
}: StoreLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader
        logoUrl={logoUrl || ""}
        storeCode={storeCode || ""}
        storeName={storeName || ""}
      />
      <main className="flex-1 w-full">{children}</main>
      <StoreFooter storeCode={storeCode} storeName={storeName} />
    </div>
  );
}
