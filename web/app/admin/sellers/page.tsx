"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminHeader } from "@/components/headers/admin-header";
import { useAdmin } from "@/context/admin-context";
import { apiEndpoints } from "@/lib/api-client";

interface Seller {
  id: number;
  email: string;
  fullName: string;
  mobile: string;
}

export default function SellersPage() {
  const router = useRouter();
  const { adminUser, clearAdmin } = useAdmin();
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storeLoaded, setStoreLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!storeLoaded) return;

    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/admin");

      return;
    }

    const fetchSellers = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const data = await apiEndpoints.getAdminSellers(token || "");

        setSellers(data.sellers || []);
      } catch (err) {
        setError("Failed to load sellers");
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, [router, clearAdmin, storeLoaded]);

  return (
    <main className="min-h-screen bg-default-50">
      <AdminHeader
        userEmail={adminUser?.email}
        userName={adminUser?.fullName}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold">Sellers</h1>
            <p className="text-default-500">
              Manage seller accounts and permissions
            </p>
          </div>
          <Button color="primary">+ Create Seller</Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner label="Loading sellers..." />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardBody className="text-red-600 dark:text-red-400">
              {error}
            </CardBody>
          </Card>
        ) : sellers.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12 text-default-600">
              No sellers found. Create one to get started!
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-col gap-2">
              <p className="text-lg font-semibold">
                All Sellers ({sellers.length})
              </p>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {sellers.map((seller) => (
                  <div
                    key={seller.id}
                    className="p-4 border border-divider rounded-lg hover:bg-default-100 transition-colors flex justify-between items-start"
                  >
                    <div>
                      <p className="font-semibold">{seller.fullName}</p>
                      <p className="text-sm text-default-500">{seller.email}</p>
                      <p className="text-sm text-default-500">
                        📱 {seller.mobile}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button color="primary" size="sm" variant="flat">
                        Edit
                      </Button>
                      <Button color="warning" size="sm" variant="flat">
                        Permissions
                      </Button>
                      <Button color="danger" size="sm" variant="flat">
                        Disable
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </main>
  );
}
