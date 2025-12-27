"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

import { OrderDetailModal } from "@/components/order-detail-modal";
import { useAuth } from "@/context/auth-context";
import { apiEndpoints } from "@/lib/api-client";
import { Order } from "@/types/order";

// Helper function to safely convert to number
const toNumber = (value: unknown): number => {
  const num = Number(value);

  return isNaN(num) ? 0 : num;
};

export default function OrdersPageContent() {
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
      const data = await apiEndpoints.getOrders(token || "");

      setOrders(data.orders || []);
    } catch (error) {
      // console.error("Error fetching orders:", error);
    } finally {
      setPageIsLoading(false);
    }
  };

  const getStatusColor = (
    status: string,
  ): "warning" | "secondary" | "primary" | "success" | "danger" | "default" => {
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
      <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-content1 to-content2">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-default-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-content1 to-content2">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-default-500">View and manage your orders</p>
        </div>

        {/* Orders Table */}
        {pageIsLoading ? (
          <Card>
            <CardBody className="py-8">
              <p className="text-center text-default-500">Loading orders...</p>
            </CardBody>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardBody className="py-12">
              <div className="text-center">
                <p className="text-default-500 text-lg mb-4">No orders yet</p>
                <Button
                  color="primary"
                  onPress={() => router.push("/products")}
                >
                  Start Shopping
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <Table
              aria-label="Orders table"
              classNames={{
                base: "bg-transparent",
                table: "text-foreground",
                thead: "[&>tr]:first:border-b-1 [&>tr]:first:border-divider",
                tbody: "[&>tr]:border-b-1 [&>tr]:border-divider",
              }}
            >
              <TableHeader>
                <TableColumn className="bg-default-100 text-foreground">
                  Order ID
                </TableColumn>
                <TableColumn className="bg-default-100 text-foreground">
                  Date
                </TableColumn>
                <TableColumn className="bg-default-100 text-foreground">
                  Total
                </TableColumn>
                <TableColumn className="bg-default-100 text-foreground">
                  Items
                </TableColumn>
                <TableColumn className="bg-default-100 text-foreground">
                  Status
                </TableColumn>
                <TableColumn className="bg-default-100 text-foreground text-center">
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
                      {formatDate(order.createdAt || "")}
                    </TableCell>
                    <TableCell className="text-slate-200 font-semibold">
                      ₹{toNumber(order.totalAmount).toFixed(0)}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {order.items?.length || 0} item(s)
                    </TableCell>
                    <TableCell>
                      <Chip
                        className="capitalize"
                        color={getStatusColor(order.status || "")}
                        size="sm"
                        variant="flat"
                      >
                        {(order.status || "").replace(/_/g, " ")}
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
        order={selectedOrder}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
