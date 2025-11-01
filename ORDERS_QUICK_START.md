# Orders & Invoice Feature - Quick Start Guide

## Setup Complete ✅

The orders management and invoice download system is ready to use!

## Quick Test Steps

### 1. Start the Application
```bash
# Terminal 1: API
cd /Users/pc/dev/hatiri/hatiri-shop/api
npm run dev

# Terminal 2: Web
cd /Users/pc/dev/hatiri/hatiri-shop/web
npm run dev
```

### 2. Login to Customer Account
- Go to http://localhost:3000/login
- Use any test account:
  - Email: `john@example.com`
  - Password: `Password@123`
  - (Or jane@example.com, bob@example.com, etc.)

### 3. Create a Test Order
1. Go to store page (http://localhost:3000/)
2. Click on a store (e.g., "Vegetable Wings")
3. Add items to cart
4. Click checkout
5. Select the default address (pre-seeded for each customer)
6. Complete the order

### 4. View Orders
1. After creating an order, navigate to `/orders`
2. You should see the order in the table
3. Click the eye icon (👁️) to view order details

### 5. Download Invoice
1. In the order details modal
2. Click "📥 Download Invoice" button
3. PDF file will download automatically
4. Open the PDF to see the formatted invoice

## Features Overview

### Orders Table
- Shows all customer orders
- Displays: Order ID, Date, Total, Item Count, Status
- Color-coded status badges
- Action button to view details

### Order Details Modal
- Complete order information
- Customer and delivery details
- Itemized product list
- Price breakdown
- Download invoice button

### Invoice PDF
- Professional formatting
- Order header with number and date
- Customer information
- Delivery address
- Itemized items with prices
- Price breakdown and total
- Thank you message

## API Endpoints

### Get All Orders
```
GET http://localhost:3333/api/orders
Headers: Authorization: Bearer {token}
```

### Get Single Order
```
GET http://localhost:3333/api/orders/:id
Headers: Authorization: Bearer {token}
```

### Download Invoice PDF
```
GET http://localhost:3333/api/orders/:id/invoice
Headers: Authorization: Bearer {token}
Response: PDF file (application/pdf)
```

## Pre-seeded Test Data

Each customer has:
- 1 pre-seeded address ready for checkout
- 5 test customers created (john, jane, bob, alice, charlie)
- 403 products across 4 stores

## Troubleshooting

### Issue: "Failed to fetch orders"
- Check if API is running on port 3333
- Verify authentication token is valid
- Check browser console for errors

### Issue: Invoice PDF not downloading
- Ensure order ID is correct
- Check if you're the order owner (authorization)
- Try in different browser if issue persists

### Issue: Modal not opening
- Clear browser cache
- Refresh the page
- Check browser console for errors

## File Structure

```
web/
├── app/orders/page.tsx           # Orders listing page
├── components/order-detail-modal.tsx  # Order details component
└── types/order.ts                # TypeScript interfaces

api/
└── app/controllers/orders_controller.ts  # Order and invoice logic
```

## Success Indicators

✅ Orders table loads with your orders
✅ Can view order details by clicking eye icon
✅ Invoice PDF downloads and opens correctly
✅ PDF contains all order information
✅ Status badges display with correct colors

## Next Steps

1. Test with multiple orders
2. Try different order statuses (if updated from admin panel)
3. Share invoice with others
4. Consider adding more features (see ORDERS_INVOICE_COMPLETE.md)

---

For detailed documentation, see: `ORDERS_INVOICE_COMPLETE.md`
