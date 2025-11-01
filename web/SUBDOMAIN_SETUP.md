# Subdomain Store Setup Guide

## Overview
The application now supports dynamic subdomains where each store operates as a standalone quick-commerce platform (like Blinkit).

## How It Works

### 1. DNS Configuration
Your DNS should point all subdomains to `hatiri.localhost`:
```
*.hatiri.localhost -> 127.0.0.1
hatiri.localhost -> 127.0.0.1
```

### 2. Middleware Processing (`/web/middleware.ts`)
When a request comes to `FM001.hatiri.localhost:3000`:
- Extracts the subdomain (FM001) from the hostname
- Stores it as a store code
- Internally rewrites to `/store/FM001` 
- The URL bar shows the subdomain (not /store/...)

### 3. Store Page (`/web/app/store/[code]/page.tsx`)
The store page:
- Fetches organisation data using the store code
- Displays store-specific branding (no Hatiri logo)
- Shows store name, delivery time, search, and cart
- All styling is quick-commerce focused (green/emerald theme)

## Accessing Stores

### Home Page (Multi-Store View)
```
http://shop1.hatiri.localhost:3000/
http://hatiri.localhost:3000/
```
Shows all available stores with their cards and "Browse →" buttons.

### Store Pages (Single Store View - Like Blinkit)

#### Fresh Mart
```
http://fm001.hatiri.localhost:3000/
```

#### Quick Supplies
```
http://qs001.hatiri.localhost:3000/
```

#### Daily Essentials
```
http://de001.hatiri.localhost:3000/
```

## Features

### Store Header
- Store logo/initial with green gradient
- Store name
- "⚡ 10 mins delivery" badge
- Search bar
- Cart button with item count

### Product Grid
- Search functionality (mobile & desktop)
- Sort by: Name, Price (Low/High), Stock
- Product cards with emoji placeholders
- "Add to Cart" buttons
- Stock indicators

### Cart Sidebar
- Mobile: Collapsible via button
- Desktop: Always visible on right
- Item quantity controls
- Subtotal display
- Quick checkout button

## Styling
- **Color Scheme**: Green/Emerald (quick commerce style)
- **No Hatiri Branding**: Store page shows only store branding
- **Dark Theme**: Dark slate backgrounds for modern look
- **Responsive**: Works on mobile and desktop

## API Integration

### Public Endpoints Used
- `GET /api/organisations` - List all stores
- `GET /api/products?organisationId={id}` - Get store products

### Store Code to ID Mapping
- FM001 → organisationId: 1 (Fresh Mart)
- QS001 → organisationId: 2 (Quick Supplies)  
- DE001 → organisationId: 3 (Daily Essentials)

## Testing Locally

### 1. Add to /etc/hosts (if not using DNS server)
```bash
127.0.0.1 hatiri.localhost
127.0.0.1 shop1.hatiri.localhost
127.0.0.1 fm001.hatiri.localhost
127.0.0.1 qs001.hatiri.localhost
127.0.0.1 de001.hatiri.localhost
```

### 2. Start the API Server
```bash
cd api
npm run dev
```

### 3. Start the Next.js Frontend
```bash
cd web
npm run dev
```

### 4. Test URLs
- Homepage: http://shop1.hatiri.localhost:3000/
- Fresh Mart: http://fm001.hatiri.localhost:3000/
- Quick Supplies: http://qs001.hatiri.localhost:3000/
- Daily Essentials: http://de001.hatiri.localhost:3000/

## Troubleshooting

### Subdomains not working
1. Check DNS/hosts file configuration
2. Verify middleware.ts is in the web root
3. Restart Next.js dev server

### Wrong store showing
1. Check if store code matches organisation code (case-insensitive)
2. Verify organisation exists in database
3. Check browser console for fetch errors

### Products not loading
1. Verify organisation ID matches in database
2. Check API is running on port 3333
3. Look for CORS errors in console

## Files Modified

- `/web/middleware.ts` - New file for subdomain routing
- `/web/app/store/layout.tsx` - New layout for store pages
- `/web/app/store/[code]/page.tsx` - Updated to show store branding and quick commerce style
- `/web/app/page.tsx` - Home page with store listings

## Future Enhancements

- [ ] Store profile/settings pages
- [ ] User authentication per store
- [ ] Store-specific payment methods
- [ ] Delivery address selection
- [ ] Order history
- [ ] Seller dashboard per store
