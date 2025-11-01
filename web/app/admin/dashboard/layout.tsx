import { AdminLayout } from "@/components/layouts/admin-layout";
import { AdminHeader } from "@/components/headers/admin-header";
import { AdminFooter } from "@/components/footers/admin-footer";
import { ReactNode } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
