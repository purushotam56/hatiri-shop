import { StoreLayout } from "@/components/layouts/store-layout";

export default async function StorePagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ code?: string }>;
}) {
  
  return (
    <>
      {children}
    </>
  );
}
