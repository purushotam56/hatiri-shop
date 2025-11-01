# 📱 Orders & Invoice System - User Flow

## User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                     CUSTOMER EXPERIENCE FLOW                     │
└─────────────────────────────────────────────────────────────────┘

1. LOGIN
   ↓
   Email: john@example.com
   Password: Password@123
   ↓
   
2. NAVIGATE TO ORDERS
   ↓
   Click "My Orders" or go to /orders
   ↓
   
3. VIEW ORDERS TABLE
   ┌─────────────────────────────────────────────┐
   │ Order ID    │ Date │ Total │ Items │ Status │
   ├─────────────────────────────────────────────┤
   │ ORD-123-XYZ │ Nov  │ 150   │   5   │ ✅     │
   │ ORD-124-ABC │ Oct  │ 95    │   3   │ 🚚     │
   │ ORD-125-DEF │ Oct  │ 200   │   8   │ 📦     │
   └─────────────────────────────────────────────┘
   ↓
   
4. CLICK ORDER DETAILS (👁️ button)
   ↓
   
5. MODAL OPENS - SEE FULL ORDER
   ┌──────────────────────────────────┐
   │  Order ORD-123-XYZ               │
   │  Status: ✅ Delivered            │
   │                                  │
   │  Order Date: Nov 1, 2025         │
   │  Total: AED 150.00               │
   │                                  │
   │  Delivery Address:               │
   │  John Doe                        │
   │  123 Main St, Dubai              │
   │                                  │
   │  Items (5):                      │
   │  • Fresh Apples (2 kg)           │
   │    Qty: 2, Price: AED 25.00 each │
   │  • Organic Spinach (1 kg)        │
   │    Qty: 1, Price: AED 15.00 each │
   │  • [More items...]               │
   │                                  │
   │  Subtotal: AED 150.00            │
   │  Tax: AED 0.00                   │
   │  Delivery: AED 0.00              │
   │  ─────────────────────────────   │
   │  TOTAL: AED 150.00               │
   │                                  │
   │  [Close]  [📥 Download Invoice]  │
   └──────────────────────────────────┘
   ↓
   
6. CLICK "📥 Download Invoice"
   ↓
   PDF Generated & Downloaded
   ↓
   
7. OPEN PDF INVOICE
   ┌──────────────────────────────────┐
   │                                  │
   │           INVOICE                │
   │      Order #ORD-123-XYZ          │
   │                                  │
   │ ════════════════════════════════ │
   │                                  │
   │ Order Information:               │
   │ Date: November 1, 2025           │
   │ Status: DELIVERED                │
   │                                  │
   │ Customer Information:            │
   │ Name: John Doe                   │
   │ Phone: 9876543210               │
   │                                  │
   │ Delivery Address:                │
   │ 123 Main Street, Dubai 12345    │
   │                                  │
   │ ════════════════════════════════ │
   │                                  │
   │ Item          Qty   Price  Total │
   │ Fresh Apples  2    25.00  50.00 │
   │ Spinach       1    15.00  15.00 │
   │ [More items...]                 │
   │                                  │
   │ ════════════════════════════════ │
   │ Subtotal: AED 150.00            │
   │ Total: AED 150.00               │
   │                                  │
   │ Thank you for your purchase!    │
   │                                  │
   └──────────────────────────────────┘
```

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  /orders/page.tsx                                       │
│  ├─ Fetches orders from API                            │
│  ├─ Displays in table format                           │
│  └─ Shows status badges                                │
│                                                          │
│  /components/order-detail-modal.tsx                     │
│  ├─ Shows full order details                           │
│  ├─ Lists all items                                    │
│  └─ Downloads invoice via API                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
                           ↕ API
                       (HTTP/REST)
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (AdonisJS)                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  /orders_controller.ts                                  │
│  ├─ index()          - Get all orders                  │
│  ├─ show()           - Get single order                │
│  ├─ store()          - Create order                    │
│  └─ downloadInvoice()- Generate PDF                    │
│                                                          │
│  pdfkit Library                                         │
│  ├─ Generates PDF document                            │
│  ├─ Formats invoice                                   │
│  └─ Sends as attachment                               │
│                                                          │
└─────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  orders table                                           │
│  ├─ id, order_number, customer_id, status, total...   │
│                                                          │
│  order_items table                                      │
│  ├─ id, order_id, product_id, qty, price...          │
│                                                          │
│  users table                                            │
│  ├─ id, email, name, phone...                         │
│                                                          │
│  addresses table                                        │
│  ├─ id, user_id, street, city, pincode...            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## API Flow Diagram

```
CLIENT REQUEST
    ↓
GET /api/orders/:id/invoice
+ Authorization: Bearer {token}
    ↓
    ├─ Authenticate user
    ├─ Fetch order from DB
    ├─ Verify ownership
    ├─ Load order items
    └─ Generate PDF
        ├─ Create PDFDocument
        ├─ Add header & order info
        ├─ Add customer details
        ├─ Add itemized table
        ├─ Add price breakdown
        └─ Finalize PDF
    ↓
SEND RESPONSE
+ Content-Type: application/pdf
+ Content-Disposition: attachment
+ PDF Content
    ↓
BROWSER
    ├─ Receives PDF
    ├─ Triggers download
    └─ Saves file
```

## Database Schema (Simplified)

```
orders
├─ id (PK)
├─ order_number (unique)
├─ customer_id (FK → users)
├─ address_id (FK → addresses)
├─ total_amount
├─ subtotal
├─ tax_amount
├─ delivery_amount
├─ status (enum)
├─ delivery_address
├─ customer_name
├─ customer_phone
├─ notes
├─ created_at
└─ updated_at

order_items (NEW!)
├─ id (PK)
├─ order_id (FK → orders, CASCADE DELETE)
├─ product_id
├─ variant_id
├─ name
├─ price
├─ quantity
├─ currency
├─ unit
├─ created_at
└─ updated_at
```

## Features Matrix

```
┌────────────────────────┬─────────┬──────────┐
│ Feature                │ Status  │ Priority │
├────────────────────────┼─────────┼──────────┤
│ View all orders        │ ✅      │ HIGH     │
│ Order details modal    │ ✅      │ HIGH     │
│ Order items list       │ ✅      │ HIGH     │
│ Download invoice       │ ✅      │ HIGH     │
│ PDF generation         │ ✅      │ HIGH     │
│ Status tracking        │ ✅      │ MEDIUM   │
│ Mobile responsive      │ ✅      │ MEDIUM   │
│ Dark theme             │ ✅      │ MEDIUM   │
│ Authentication         │ ✅      │ HIGH     │
├────────────────────────┼─────────┼──────────┤
│ Order cancellation     │ ⏳      │ MEDIUM   │
│ Email invoice          │ ⏳      │ MEDIUM   │
│ Reorder               │ ⏳      │ LOW      │
│ Order tracking        │ ⏳      │ LOW      │
│ Multi-language        │ ⏳      │ LOW      │
└────────────────────────┴─────────┴──────────┘

✅ = Implemented
⏳ = Coming Soon
```

## Status Badge Colors

```
🟡 Pending      → Yellow (Warning)
🔵 Confirmed    → Gray (Secondary)
📦 Preparing    → Gray (Secondary)
📦 Ready        → Gray (Secondary)
🚚 Out for Delivery → Blue (Primary)
✅ Delivered    → Green (Success)
❌ Cancelled    → Red (Danger)
```

## File Size & Performance

```
Frontend Files:
- orders/page.tsx              ~3.5 KB
- order-detail-modal.tsx       ~4.2 KB
- types/order.ts               ~1.1 KB
Total Frontend:                 ~8.8 KB

Backend Files:
- orders_controller.ts         ~6.5 KB (with invoice logic)
- routes additions             ~0.2 KB
Total Backend:                  ~6.7 KB

Dependencies:
- pdfkit                        ~4.5 MB
- @types/pdfkit                ~0.1 MB
```

---

**System Status**: ✅ COMPLETE AND OPERATIONAL

All features working as intended. Ready for production use.
