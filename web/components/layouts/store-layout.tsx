import { StoreHeader } from "@/components/store-header";
import { StoreFooter } from "@/components/footers/store-footer";

interface StoreLayoutProps {
  children: React.ReactNode;
  storeCode?: string;
}

export function StoreLayout({ children, storeCode }: StoreLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <StoreHeader storeCode={storeCode || ""} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <StoreFooter storeCode={storeCode} />
    </div>
  );
}
