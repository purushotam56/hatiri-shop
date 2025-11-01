"use client";

import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Divider } from "@heroui/divider";
import Link from "next/link";
import { StoreLayout } from "@/components/layouts/store-layout";

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const [orderId, setOrderId] = useState<string>("");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    params.then((p) => setOrderId(p.id));
  }, [params]);

  useEffect(() => {
    if (!orderId) return;
    // Mock order data
    const mockOrder = {
      id: orderId,
      status: "in-transit",
      items: [
        { name: "Fresh Red Apples x2", price: 9.98 },
        { name: "Organic Spinach x1", price: 3.49 },
        { name: "Whole Wheat Bread x1", price: 2.99 },
      ],
      subtotal: 16.46,
      delivery: 4.99,
      tax: 1.56,
      total: 23.01,
      address: "123 Main St, Apt 4B",
      timeline: [
        { status: "Order Placed", time: "2:15 PM", icon: "✅", completed: true },
        { status: "Confirmed", time: "2:18 PM", icon: "✅", completed: true },
        { status: "Preparing", time: "2:20 PM", icon: "✅", completed: true },
        { status: "Out for Delivery", time: "2:35 PM", icon: "🚚", completed: true },
        { status: "Arriving Now", time: "~2:43 PM", icon: "📍", completed: false },
      ],
      driver: {
        name: "Rajesh Kumar",
        rating: 4.8,
        vehicle: "🛵 Two-wheeler",
        eta: "8 min away",
        phone: "+91 98765 43210",
      },
    };
    setOrder(mockOrder);
  }, [orderId]);

  return (
    <StoreLayout>
      <OrderTrackingPageContent order={order} orderId={orderId} />
    </StoreLayout>
  );
}

function OrderTrackingPageContent({ order, orderId }: { order: any; orderId: string }) {

  if (!order) {
    return (
      <main className="min-h-screen bg-white dark:bg-default-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Loading order details...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-default-100 pt-2 pb-24">
      <div className="max-w-2xl mx-auto px-3">
        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <Link href="/orders">
            <Button isIconOnly variant="light" size="sm">
              ←
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{order.id}</h1>
            <p className="text-default-600 text-xs md:text-sm">Track your live delivery</p>
          </div>
        </div>

        {/* Live Status - Sticky on Mobile */}
        <Card className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20 sticky top-16 z-30">
          <CardHeader className="flex flex-col items-start px-4 py-3 md:px-6 md:py-4">
            <div className="flex items-center gap-2 w-full md:gap-3">
              <p className="text-3xl md:text-4xl">📍</p>
              <div className="flex-1">
                <p className="text-base md:text-lg font-bold">Out for Delivery</p>
                <p className="text-xs md:text-sm text-default-600">Arriving in ~8 minutes</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Driver Info */}
        <Card className="mb-4 bg-default-50 dark:bg-default-200">
          <CardHeader className="flex gap-2 p-3 md:p-4">
            <p className="font-semibold text-sm md:text-base">Your Delivery Partner</p>
          </CardHeader>
          <CardBody className="space-y-3 p-3 md:space-y-4 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-xl md:text-2xl flex-shrink-0">
                  👨
                </div>
                <div>
                  <p className="font-bold text-sm md:text-base">{order.driver.name}</p>
                  <p className="text-xs md:text-sm text-default-600">⭐ {order.driver.rating}</p>
                  <p className="text-xs text-default-600">{order.driver.vehicle}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm md:text-base font-bold text-primary">{order.driver.eta}</p>
              </div>
            </div>
            <Divider className="my-1" />
            <div className="flex gap-2">
              <Button fullWidth size="sm" color="primary" variant="flat" className="text-xs">
                📞 Call
              </Button>
              <Button fullWidth size="sm" variant="flat" className="text-xs">
                💬 Chat
              </Button>
              <Button fullWidth size="sm" variant="flat" isIconOnly className="flex-shrink-0">
                📍
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Timeline - Compact */}
        <Card className="mb-4 bg-default-50 dark:bg-default-200">
          <CardHeader className="p-3 md:p-4">
            <p className="font-semibold text-sm md:text-base">Delivery Timeline</p>
          </CardHeader>
          <CardBody className="space-y-2 p-3 md:p-4 pt-0 md:pt-0">
            {order.timeline.map((step: any, idx: number) => (
              <div key={idx} className="relative pb-3">
                {idx !== order.timeline.length - 1 && (
                  <div
                    className={`absolute left-3 top-8 w-0.5 h-8 md:left-5 md:top-10 md:h-10 ${
                      step.completed
                        ? "bg-gradient-to-b from-primary to-primary/50"
                        : "bg-default-300"
                    }`}
                  />
                )}
                <div className="flex gap-3">
                  <div
                    className={`w-6 h-6 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-lg font-bold flex-shrink-0 ${
                      step.completed
                        ? "bg-primary text-white"
                        : "bg-default-200 text-default-600"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1 pt-0.5 md:pt-1">
                    <p className={`font-semibold text-xs md:text-sm ${step.completed ? "text-default-900" : "text-default-600"}`}>
                      {step.status}
                    </p>
                    <p className="text-xs md:text-sm text-default-600">{step.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Order Summary */}
        <Card className="bg-default-50 dark:bg-default-200">
          <CardHeader className="p-3 md:p-4">
            <p className="font-semibold text-sm md:text-base">Order Summary</p>
          </CardHeader>
          <CardBody className="space-y-2 p-3 md:p-4 pt-0 md:pt-0">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between text-xs md:text-sm">
                <p>{item.name}</p>
                <p className="font-semibold">₹{item.price}</p>
              </div>
            ))}
            <Divider className="my-1" />
            <div className="space-y-1 text-xs md:text-sm">
              <div className="flex justify-between text-default-600">
                <p>Subtotal</p>
                <p>₹{order.subtotal}</p>
              </div>
              <div className="flex justify-between text-default-600">
                <p>Delivery</p>
                <p>₹{order.delivery}</p>
              </div>
              <div className="flex justify-between text-default-600">
                <p>Tax</p>
                <p>₹{order.tax}</p>
              </div>
            </div>
            <Divider className="my-1" />
            <div className="flex justify-between text-base md:text-lg font-bold">
              <p>Total</p>
              <p className="text-primary">₹{order.total}</p>
            </div>
          </CardBody>
          <CardFooter className="p-3 md:p-4">
            <Button fullWidth size="sm" variant="flat" className="text-xs md:text-sm">
              Need Help?
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
