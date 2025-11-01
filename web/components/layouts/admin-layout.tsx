"use client";

import { AdminHeader } from "@/components/headers/admin-header";
import { AdminFooter } from "@/components/footers/admin-footer";
import { useEffect, useState } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [userName, setUserName] = useState("Admin");
  const [userEmail, setUserEmail] = useState("admin@hatiri.com");

  useEffect(() => {
    const user = localStorage.getItem("adminUser");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setUserName(parsedUser.name || "Admin");
        setUserEmail(parsedUser.email || "admin@hatiri.com");
      } catch (error) {
        console.error("Failed to parse admin user:", error);
      }
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader userName={userName} userEmail={userEmail} />
      <main className="flex-1 w-full">
        {children}
      </main>
      <AdminFooter />
    </div>
  );
}
