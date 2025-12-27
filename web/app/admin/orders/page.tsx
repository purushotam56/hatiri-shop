"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AdminHeader } from "@/components/headers/admin-header";
import { useAdmin } from "@/context/admin-context";
import { apiEndpoints } from "@/lib/api-client";

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  customerName: string;
  createdAt: string;
}

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

export default function OrdersPage() {
  const router = useRouter();
  const { adminUser, clearAdmin } = useAdmin();
  const [orders, setOrders] = useState<Order[]>([]);
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

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const data = await apiEndpoints.getAdminOrders(token || "");

        setOrders(data.orders || []);
      } catch (err) {
        setError("Failed to load orders");
        // console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router, clearAdmin, storeLoaded]);

  return (
    <main className="min-h-screen bg-default-50">
      <AdminHeader
        userEmail={adminUser?.email}
        userName={adminUser?.fullName}
      />

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Global Orders</h1>
          <p className="text-default-500">
            View and manage all orders across all organizations
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner label="Loading orders..." />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardBody className="text-red-600 dark:text-red-400">
              {error}
            </CardBody>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12 text-default-600">
              No orders found
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-col gap-2">
              <p className="text-lg font-semibold">
                All Orders ({orders.length})
              </p>
            </CardHeader>
            <CardBody>
              <Table aria-label="Global orders table">
                <TableHeader>
                  <TableColumn>Order #</TableColumn>
                  <TableColumn>Customer</TableColumn>
                  <TableColumn>Amount</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Date</TableColumn>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow
                      key={order.id}
                      className="hover:bg-default-100 cursor-pointer"
                    >
                      <TableCell className="font-semibold">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>{order.customerName}</TableCell>
                      <TableCell className="font-semibold">
                        ₹{order.totalAmount.toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            statusColors[order.status] || statusColors.pending
                          }`}
                        >
                          {order.status.replace("_", " ").toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-default-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardBody>
          </Card>
        )}
      </div>
    </main>
  );
}
