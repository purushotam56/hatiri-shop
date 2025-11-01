import { SellerLayout } from "@/components/layouts/seller-layout";
import { ReactNode } from "react";

export default function SellerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SellerLayout>
      {children}
    </SellerLayout>
  );
}
