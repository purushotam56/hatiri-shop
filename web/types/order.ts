export interface OrderItem extends Record<string, unknown> {
  id?: number;
  orderId?: number;
  productId?: number;
  variantId?: number | null;
  name: string;
  price: number;
  quantity?: number;
  currency?: string;
  unit?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderTimeline {
  status: string;
  time: string;
  icon: string;
  completed: boolean;
}

export interface OrderDriver {
  name: string;
  rating: number;
  vehicle: string;
  eta: string;
  phone: string;
}

export interface Order extends Record<string, unknown> {
  id: number | string;
  orderNumber?: string;
  customerId?: number;
  addressId?: number;
  totalAmount?: number;
  taxAmount?: number;
  deliveryAmount?: number;
  subtotal?: number;
  status?:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "in-transit";
  deliveryAddress?: string;
  customerPhone?: string;
  customerName?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: OrderItem[];
  address?: string;
  delivery?: number;
  tax?: number;
  total?: number;
  timeline?: OrderTimeline[];
  driver?: OrderDriver;
}
