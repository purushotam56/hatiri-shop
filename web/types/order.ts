export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId: number | null;
  name: string;
  price: number;
  quantity: number;
  currency: string;
  unit: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  addressId: number;
  totalAmount: number;
  taxAmount: number;
  deliveryAmount: number;
  subtotal: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  deliveryAddress: string;
  customerPhone: string;
  customerName: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}
