"use client";

import React, { useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import Link from "next/link";

export default function OrdersPage() {
  const [orders] = useState([
    {
      id: "ORD-001",
      date: "Oct 28, 2025 • 2:15 PM",
      items: ["Fresh Red Apples x2", "Organic Spinach x1", "Whole Wheat Bread x1"],
      total: 48.99,
      status: "delivered",
      deliveryTime: "2:43 PM (28 min)",
      address: "123 Main St, Apt 4B",
    },
    {
      id: "ORD-002",
      date: "Oct 26, 2025 • 5:30 PM",
      items: ["Premium Olive Oil x1", "Non-Stick Pan x1"],
      total: 32.50,
      status: "delivered",
      deliveryTime: "6:02 PM (32 min)",
      address: "456 Business Ave",
    },
    {
      id: "ORD-003",
      date: "Oct 24, 2025 • 10:00 AM",
      items: ["Multiple items (15)", "See details"],
      total: 61.25,
      status: "delivered",
      deliveryTime: "10:31 AM (31 min)",
      address: "123 Main St, Apt 4B",
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "in-transit":
        return "bg-blue-100 text-blue-800";
      case "preparing":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return "✅ Delivered";
      case "in-transit":
        return "🚚 In Transit";
      case "preparing":
        return "📦 Preparing";
      default:
        return status;
    }
  };

  return (
    <main className="min-h-screen bg-white dark:bg-default-100 pt-2 pb-24">
      <div className="max-w-4xl mx-auto px-3">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <Link href="/account">
            <Button isIconOnly variant="light" size="sm">
              ←
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Your Orders</h1>
            <p className="text-default-600 text-xs md:text-sm">Track and manage your purchases</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {orders.map((order) => (
            <Link key={order.id} href={`/orders/${order.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-default-50 dark:bg-default-200">
                <CardBody className="py-3 space-y-3">
                  {/* Order Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm md:text-base">{order.id}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm text-default-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base md:text-lg font-bold text-primary">₹{order.total}</p>
                      <p className="text-xs text-default-600">{order.items.length} items</p>
                    </div>
                  </div>

                  <Divider className="my-1" />

                  {/* Delivery Info - Compact */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-default-600">📍 Address</p>
                      <p className="font-semibold text-sm truncate">{order.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-default-600">⏱️ Time</p>
                      <p className="font-semibold text-sm">{order.deliveryTime}</p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div>
                    <p className="text-xs font-semibold text-default-600 mb-1">Items</p>
                    <div className="space-y-0.5">
                      {order.items.slice(0, 2).map((item, idx) => (
                        <p key={idx} className="text-xs text-default-600">
                          • {item}
                        </p>
                      ))}
                      {order.items.length > 2 && (
                        <p className="text-xs text-primary font-semibold">
                          +{order.items.length - 2} more →
                        </p>
                      )}
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="gap-2 p-3 pt-0">
                  <Button fullWidth size="sm" variant="flat" className="text-xs">
                    Reorder
                  </Button>
                  <Button fullWidth size="sm" color="primary" className="text-xs">
                    Details →
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <Card className="text-center py-12 bg-default-50 dark:bg-default-200">
            <CardBody>
              <p className="text-4xl mb-3">📭</p>
              <p className="text-lg font-semibold mb-1">No orders yet</p>
              <p className="text-default-600 text-sm mb-4">Start shopping to see your orders here</p>
              <Button as={Link} href="/" color="primary" size="sm">
                Start Shopping
              </Button>
            </CardBody>
          </Card>
        )}
      </div>
    </main>
  );
}
