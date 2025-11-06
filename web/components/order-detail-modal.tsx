"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import { apiEndpoints } from "@/lib/api-client";
import type { Order } from "@/types/order";

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

// Helper function to safely convert to number
const toNumber = (value: any): number => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

export function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!order) return null;

  const handleDownloadInvoice = async () => {
    setIsDownloading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Downloading invoice for order:", order.id, "Token:", token?.substring(0, 10) + "...");
      
      const response = await apiEndpoints.getOrderInvoice(order.id, token || "");

      console.log("Invoice response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Invoice error:", errorText);
        throw new Error(`Failed to download invoice: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      console.log("Invoice blob size:", blob.size);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Invoice-${order.orderNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      alert(`Failed to download invoice: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusColor = (status: string) => {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-white">
          Order {order.orderNumber}
        </ModalHeader>
        <ModalBody className="space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status:</span>
            <Chip
              className="capitalize"
              color={getStatusColor(order.status)}
              variant="flat"
            >
              {order.status.replace(/_/g, " ")}
            </Chip>
          </div>

          <Divider className="my-2" />

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Order Date</p>
              <p className="text-white font-semibold">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Total Amount</p>
              <p className="text-white font-semibold text-lg">
                ₹{toNumber(order.totalAmount).toFixed(0)}
              </p>
            </div>
          </div>

          <Divider className="my-2" />

          {/* Delivery Address */}
          <div>
            <p className="text-slate-400 text-sm mb-2">Delivery Address</p>
            <Card className="bg-slate-800">
              <CardBody className="space-y-1 text-sm">
                <p className="text-white font-semibold">{order.customerName}</p>
                <p className="text-slate-300">{order.deliveryAddress}</p>
                <p className="text-slate-300">{order.customerPhone}</p>
              </CardBody>
            </Card>
          </div>

          <Divider className="my-2" />

          {/* Order Items */}
          <div>
            <p className="text-slate-400 text-sm mb-2">Items ({order.items?.length || 0})</p>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <Card key={item.id} className="bg-slate-800/50">
                  <CardBody className="py-3 px-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-semibold">{item.name}</p>
                        <p className="text-slate-400 text-xs">
                          Qty: {item.quantity} {item.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-semibold">
                          {item.currency} {(toNumber(item.price) * toNumber(item.quantity)).toFixed(2)}
                        </p>
                        <p className="text-slate-400 text-xs">
                          {item.currency} {toNumber(item.price).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          <Divider className="my-2" />

          {/* Price Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span>₹{toNumber(order.subtotal).toFixed(0)}</span>
            </div>
            {toNumber(order.taxAmount) > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>Tax</span>
                <span>₹{toNumber(order.taxAmount).toFixed(0)}</span>
              </div>
            )}
            {toNumber(order.deliveryAmount) > 0 && (
              <div className="flex justify-between text-slate-300">
                <span>Delivery</span>
                <span>₹{toNumber(order.deliveryAmount).toFixed(0)}</span>
              </div>
            )}
            <Divider className="my-2" />
            <div className="flex justify-between text-white font-bold text-base">
              <span>Total</span>
              <span>₹{toNumber(order.totalAmount).toFixed(0)}</span>
            </div>
          </div>

          {order.notes && (
            <>
              <Divider className="my-2" />
              <div>
                <p className="text-slate-400 text-sm mb-1">Notes</p>
                <p className="text-slate-300">{order.notes}</p>
              </div>
            </>
          )}
        </ModalBody>
        <ModalFooter className="gap-2">
          <Button variant="bordered" onPress={onClose} className="text-slate-200">
            Close
          </Button>
          <Button
            color="primary"
            onPress={handleDownloadInvoice}
            isLoading={isDownloading}
          >
            📥 Download Invoice
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
