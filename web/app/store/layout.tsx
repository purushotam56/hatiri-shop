import { StoreLayout } from "@/components/layouts/store-layout";

export default function StorePagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreLayout>
      {children}
    </StoreLayout>
  );
}
