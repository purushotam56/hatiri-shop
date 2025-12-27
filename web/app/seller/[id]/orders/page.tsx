"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useSellerStore } from "@/context/seller-store-context";
import { apiEndpoints } from "@/lib/api-client";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  createdAt: string;
}

const statusOptions = [
  { value: "", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusColors: Record<string, string> = {
  pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  preparing:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  ready:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  out_for_delivery:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  delivered:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function SellerOrdersPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id;
  const { selectedStore, clearStore } = useSellerStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [storeLoaded, setStoreLoaded] = useState(false);

  // First effect: wait for store to load from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Second effect: check auth and store selection
  useEffect(() => {
    if (!storeLoaded) return;

    const token = localStorage.getItem("sellerToken");

    if (!token) {
      router.push("/seller");

      return;
    }

    // Verify store match
    if (
      !selectedStore ||
      (selectedStore?.id !== Number(orgId) && selectedStore?.id !== orgId)
    ) {
      router.push("/seller/select-store");

      return;
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("sellerToken");
        // For now, just fetch without pagination params - can be enhanced later
        const data = await apiEndpoints.getSellerOrders(
          String(orgId),
          token || "",
        );

        setOrders(data.orders || []);
        setHasMore(data.hasMore || false);
      } catch (err) {
        setError("Failed to load orders");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orgId, router, page, statusFilter, selectedStore, storeLoaded]);

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerUser");
    clearStore();
    router.push("/seller");
  };

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Filter */}
        <div className="flex gap-4 items-end">
          <div className="max-w-xs">
            <label
              className="text-sm font-medium text-foreground block mb-2"
              htmlFor="statusFilter"
            >
              Filter by Status
            </label>
            <select
              id="statusFilter"
              className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              {statusOptions.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner label="Loading orders..." />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200">
            <CardBody>
              <p className="text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            </CardBody>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              <p className="text-default-600">No orders found</p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Link key={order.id} href={`/seller/${orgId}/orders/${order.id}`}>
                <Card className="hover:shadow-md transition cursor-pointer">
                  <CardBody className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-default-600 truncate">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-default-500">
                          {order.customerPhone}
                        </p>
                        <p className="text-xs text-default-500 mt-2">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            statusColors[order.status] ||
                            "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.status}
                        </span>
                        <p className="text-sm font-bold text-primary">
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && orders.length > 0 && (
          <div className="flex items-center justify-center gap-4">
            <Button
              isDisabled={page === 1}
              variant="bordered"
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="text-sm text-default-600">Page {page}</span>
            <Button
              isDisabled={!hasMore}
              variant="bordered"
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
