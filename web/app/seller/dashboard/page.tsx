"use client";

import { SellerLayout } from "@/components/layouts/seller-layout";

export default function SellerDashboard() {
  return (
    <SellerLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stats cards can be added here */}
          <div className="bg-default-50 rounded-lg p-4">
            Dashboard coming soon
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
