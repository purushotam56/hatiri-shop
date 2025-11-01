"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { COLORS } from "@/lib/theme";
import { Order } from "@/types/order";
import { OrderDetailModal } from "@/components/order-detail-modal";
import { StoreLayout } from "@/components/layouts/store-layout";

// Helper function to safely convert to number
const toNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

function OrdersPageContent() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    // Wait for auth to load
    if (isLoading) {
      return;
    }

    // If not logged in, redirect
    if (!isLoggedIn) {
      // router.push("/login");
      return;
    }

    fetchOrders();
  }, [isLoggedIn, isLoading, router]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3333/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setPageIsLoading(false);
    }
  };

  const getStatusColor = (status: string): "warning" | "secondary" | "primary" | "success" | "danger" | "default" => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "secondary";
      case "preparing":
        return "secondary";
      case "ready":
        return "secondary";
      case "out_for_delivery":
        return "primary";
      case "delivered":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "default";
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  // Wait for auth to load
  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Orders</h1>
          <p className="text-slate-400">View and manage your orders</p>
        </div>

        {/* Orders Table */}
        {pageIsLoading ? (
          <Card className="bg-slate-800/50 border border-slate-700">
            <CardBody className="py-8">
              <p className="text-center text-slate-400">Loading orders...</p>
            </CardBody>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="bg-slate-800/50 border border-slate-700">
            <CardBody className="py-12">
              <div className="text-center">
                <p className="text-slate-400 text-lg mb-4">No orders yet</p>
                <Button
                  className={`${COLORS.ecommerce.from} ${COLORS.ecommerce.to} text-white`}
                  onPress={() => router.push("/products")}
                >
                  Start Shopping
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card className="bg-slate-800/50 border border-slate-700 overflow-hidden">
            <Table
              aria-label="Orders table"
              classNames={{
                base: "bg-transparent",
                table: "text-slate-200",
                thead: "[&>tr]:first:border-b-1 [&>tr]:first:border-slate-600",
                tbody: "[&>tr]:border-b-1 [&>tr]:border-slate-700",
              }}
            >
              <TableHeader>
                <TableColumn className="bg-slate-700/50 text-slate-100">
                  Order ID
                </TableColumn>
                <TableColumn className="bg-slate-700/50 text-slate-100">
                  Date
                </TableColumn>
                <TableColumn className="bg-slate-700/50 text-slate-100">
                  Total
                </TableColumn>
                <TableColumn className="bg-slate-700/50 text-slate-100">
                  Items
                </TableColumn>
                <TableColumn className="bg-slate-700/50 text-slate-100">
                  Status
                </TableColumn>
                <TableColumn className="bg-slate-700/50 text-slate-100 text-center">
                  Actions
                </TableColumn>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="text-slate-200 font-semibold">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-slate-200 font-semibold">
                      AED {toNumber(order.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {order.items?.length || 0} item(s)
                    </TableCell>
                    <TableCell>
                      <Chip
                        className="capitalize"
                        color={getStatusColor(order.status)}
                        size="sm"
                        variant="flat"
                      >
                        {order.status.replace(/_/g, " ")}
                      </Chip>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        isIconOnly
                        className="bg-slate-700 hover:bg-slate-600 text-slate-200"
                        size="sm"
                        onPress={() => handleViewDetails(order)}
                      >
                        👁️
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
}

export default function OrdersPage() {
  return (
    <StoreLayout>
      <OrdersPageContent />
    </StoreLayout>
  );
}
