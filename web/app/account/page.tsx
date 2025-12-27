"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import Link from "next/link";
import React, { useState } from "react";

export default function UserDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [addresses, _setAddresses] = useState([
    {
      id: 1,
      label: "Home",
      address: "123 Main St, Apt 4B, Downtown",
      default: true,
    },
    {
      id: 2,
      label: "Work",
      address: "456 Business Ave, Suite 100",
      default: false,
    },
  ]);

  const [orders, _setOrders] = useState([
    {
      id: "ORD-001",
      date: "Oct 28, 2025",
      items: 12,
      total: 48.99,
      status: "Delivered",
      icon: "✅",
    },
    {
      id: "ORD-002",
      date: "Oct 26, 2025",
      items: 8,
      total: 32.5,
      status: "Delivered",
      icon: "✅",
    },
    {
      id: "ORD-003",
      date: "Oct 24, 2025",
      items: 15,
      total: 61.25,
      status: "Delivered",
      icon: "✅",
    },
  ]);

  const [savedItems, _setSavedItems] = useState([
    { id: 1, name: "Fresh Red Apples", price: 4.99, saves: 23 },
    { id: 2, name: "Organic Spinach", price: 3.49, saves: 15 },
    { id: 3, name: "Whole Wheat Bread", price: 2.99, saves: 8 },
  ]);

  return (
    <main className="min-h-screen bg-white dark:bg-default-100 pt-2 pb-24">
      <div className="max-w-6xl mx-auto px-3">
        {/* Header - Mobile Optimized */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold">My Account</h1>
              <p className="text-default-600 text-sm">
                Welcome back, Priya! 👋
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-default-600">Member since</p>
              <p className="text-sm font-bold">Mar 2025</p>
            </div>
          </div>

          {/* Quick Stats - Grid Responsive */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { label: "Orders", value: "23", icon: "📦" },
              { label: "Spent", value: "₹2.4k", icon: "💰" },
              { label: "Delivery", value: "28 min", icon: "⏱️" },
              { label: "Points", value: "2.4k", icon: "⭐" },
            ].map((stat, idx) => (
              <Card key={idx} className="bg-default-50 dark:bg-default-200">
                <CardBody className="py-3">
                  <div className="text-lg md:text-2xl mb-1">{stat.icon}</div>
                  <p className="text-xs text-default-600">{stat.label}</p>
                  <p className="text-base md:text-lg font-bold">{stat.value}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Tabs - Full Width on Mobile */}
        <Tabs
          aria-label="Dashboard options"
          className="flex flex-col w-full"
          selectedKey={activeTab}
          size="lg"
          variant="underlined"
          onSelectionChange={(key) => setActiveTab(String(key))}
        >
          <Tab key="overview" title="📋 Overview">
            <div className="space-y-4 mt-4">
              {/* Recent Orders */}
              <Card>
                <CardHeader className="flex gap-2 p-4">
                  <div className="flex flex-col">
                    <p className="font-semibold md:text-lg">Recent Orders</p>
                    <p className="text-xs text-default-500">
                      Your last 3 orders
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="space-y-2 p-3">
                  {orders.map((order) => (
                    <Link key={order.id} href={`/orders/${order.id}`}>
                      <div className="flex items-center justify-between p-3 bg-default-100 dark:bg-default-200 rounded-lg hover:bg-default-200 dark:hover:bg-default-300 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{order.icon}</span>
                            <p className="font-semibold text-sm md:text-base">
                              {order.id}
                            </p>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs md:text-sm text-default-600">
                            {order.items} items • {order.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm md:text-base">
                            ₹{order.total}
                          </p>
                          <p className="text-xs text-default-600">→</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardBody>
                <CardFooter className="p-3">
                  <Button
                    fullWidth
                    as={Link}
                    href="/orders"
                    size="sm"
                    variant="flat"
                  >
                    View All Orders →
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </Tab>

          <Tab key="addresses" title="📍 Addresses">
            <div className="space-y-3 mt-4">
              {addresses.map((addr) => (
                <Card
                  key={addr.id}
                  className="bg-default-50 dark:bg-default-200"
                >
                  <CardBody className="py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-sm md:text-base">
                            {addr.label}
                          </p>
                          {addr.default && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-default-600">
                          {addr.address}
                        </p>
                      </div>
                      <Button
                        isIconOnly
                        className="flex-shrink-0"
                        size="sm"
                        variant="flat"
                      >
                        ✎
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}

              <Card className="bg-default-100 dark:bg-default-200 border-2 border-dashed border-primary">
                <CardBody className="py-6">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <p className="text-2xl">➕</p>
                    <Button className="mt-2" color="primary" size="sm">
                      Add New Address
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>

          <Tab key="saved" title="❤️ Saved">
            <div className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {savedItems.map((item) => (
                  <Card
                    key={item.id}
                    className="bg-default-50 dark:bg-default-200 hover:shadow-lg transition-shadow"
                  >
                    <CardBody className="py-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm md:text-base">
                            {item.name}
                          </p>
                          <p className="text-primary font-bold text-base md:text-lg">
                            ₹{item.price}
                          </p>
                        </div>
                        <p className="text-xs text-default-600">
                          {item.saves} saved
                        </p>
                      </div>
                    </CardBody>
                    <CardFooter className="gap-2 p-3 pt-0">
                      <Button
                        fullWidth
                        className="text-xs md:text-sm"
                        color="primary"
                        size="sm"
                      >
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </Tab>

          <Tab key="preferences" title="⚙️ Settings">
            <div className="space-y-4 mt-4">
              <Card>
                <CardHeader className="p-3">
                  <p className="font-semibold text-sm md:text-base">
                    Notifications
                  </p>
                </CardHeader>
                <CardBody className="space-y-2 p-3 pt-0">
                  {[
                    { label: "Order Updates", desc: "Order status" },
                    { label: "Offers & Deals", desc: "Promotions" },
                    { label: "Reminders", desc: "Recommendations" },
                  ].map((pref, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-default-100 dark:bg-default-300 rounded"
                    >
                      <div>
                        <p className="font-semibold text-xs md:text-sm">
                          {pref.label}
                        </p>
                        <p className="text-xs text-default-600">{pref.desc}</p>
                      </div>
                      <input
                        defaultChecked
                        className="w-4 h-4"
                        type="checkbox"
                      />
                    </div>
                  ))}
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="p-3">
                  <p className="font-semibold text-sm md:text-base">Account</p>
                </CardHeader>
                <CardBody className="space-y-2 p-3 pt-0">
                  <Button
                    fullWidth
                    className="text-xs md:text-sm"
                    size="sm"
                    variant="flat"
                  >
                    Change Password
                  </Button>
                  <Button
                    fullWidth
                    className="text-xs md:text-sm"
                    color="danger"
                    size="sm"
                    variant="flat"
                  >
                    Logout
                  </Button>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </div>
    </main>
  );
}
