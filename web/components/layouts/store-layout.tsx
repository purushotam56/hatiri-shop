import { StoreHeader } from "@/components/store-header";
import { StoreFooter } from "@/components/footers/store-footer";

interface StoreLayoutProps {
  children: React.ReactNode;
  storeCode?: string;
  storeName?: string;
  logoUrl?: string;
}

export function StoreLayout({ children, storeCode = "", storeName = "", logoUrl = "" }: StoreLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader storeCode={storeCode || ""} storeName={storeName || ""} logoUrl={logoUrl || ""} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <StoreFooter storeCode={storeName} />
    </div>
  );
}
