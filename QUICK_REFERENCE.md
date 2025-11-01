# Quick Reference - Multi-Panel Architecture

## Panel Overview

| Panel | URL | Header | Footer | Color | Logo |
|-------|-----|--------|--------|-------|------|
| **Landing** | `/` | LandingHeader | LandingFooter | Default | 🛍️ Hatiri |
| **Admin** | `/admin` | AdminHeader | AdminFooter | Red | ⚙️ Admin |
| **Seller** | `/seller/[id]` | SellerHeader | SellerFooter | Blue | 📊 Seller |
| **Store** | `/store/[code]` | StoreHeader | StoreFooter | Default | Logo |

---

## Quick Copy-Paste Templates

### Adding a New Admin Page

```tsx
"use client";

import { AdminLayout } from "@/components/layouts/admin-layout";

export default function NewAdminPage() {
  return (
    <AdminLayout>
      <main className="p-4">
        {/* Your content */}
      </main>
    </AdminLayout>
  );
}
```

### Adding a New Seller Page

```tsx
"use client";

import { SellerLayout } from "@/components/layouts/seller-layout";

export default function NewSellerPage() {
  return (
    <SellerLayout>
      <main className="p-4">
        {/* Your content */}
      </main>
    </SellerLayout>
  );
}
```

### Adding a New Landing Page

```tsx
import { LandingLayout } from "@/components/layouts/landing-layout";

export default function NewLandingPage() {
  return (
    <LandingLayout>
      {/* Your content */}
    </LandingLayout>
  );
}
```

---

## Component Locations

| Component | Path |
|-----------|------|
| LandingHeader | `@/components/headers/landing-header` |
| AdminHeader | `@/components/headers/admin-header` |
| SellerHeader | `@/components/headers/seller-header` |
| StoreHeader | `@/components/store-header` |
| LandingFooter | `@/components/footers/landing-footer` |
| AdminFooter | `@/components/footers/admin-footer` |
| SellerFooter | `@/components/footers/seller-footer` |
| StoreFooter | `@/components/footers/store-footer` |
| LandingLayout | `@/components/layouts/landing-layout` |
| AdminLayout | `@/components/layouts/admin-layout` |
| SellerLayout | `@/components/layouts/seller-layout` |
| StoreLayout | `@/components/layouts/store-layout` |

---

## Navigation Links

### Admin Panel
- Dashboard: `/admin/dashboard`
- Organisations: `/admin/dashboard`
- Categories: `/admin/dashboard`
- Reports: `/admin/dashboard`
- Settings: `/admin/dashboard`

### Seller Panel
- Dashboard: `/seller/[id]/dashboard`
- Products: `/seller/[id]/products`
- Orders: `/seller/[id]/orders`
- Customers: `/seller/[id]/customers`
- Analytics: `/seller/[id]/analytics`
- Settings: `/seller/[id]/settings`

### Landing
- Home: `/`
- About: `/about`
- Products: `/products`
- Pricing: `/pricing`
- Blog: `/blog`

---

## LocalStorage Keys

| Panel | Token Key | User Key |
|-------|-----------|----------|
| Admin | `adminToken` | `adminUser` |
| Seller | `sellerToken` | `sellerUser` |

### User Object Structure
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "storeName": "My Store" // seller only
}
```

---

## Logout Implementation

All headers have built-in logout that:
1. Clears localStorage tokens
2. Clears localStorage user data
3. Redirects to login page

No additional implementation needed!

---

## Responsive Behavior

- **Mobile:** Hamburger menu in header, full-width content
- **Tablet:** Drawer/sidebar optional
- **Desktop:** Full navigation visible

All components are HeroUI Navbar which handles this automatically.

---

## Customization Points

### Change Header Colors
Edit gradient in header component:
```tsx
className="bg-gradient-to-r from-red-600 to-red-700"
```

### Add Menu Items
Edit `menuItems` array in header:
```tsx
const menuItems = [
  { label: "New Item", href: "/new-route" },
];
```

### Modify Footer Links
Edit footer component directly:
```tsx
<Link href="/custom-page">Custom Page</Link>
```

---

## Common Issues & Solutions

**Q: Header not showing?**
- Ensure page is wrapped with correct Layout component
- Check if page is inside correct route folder

**Q: Layout showing twice?**
- Remove header/footer from page component
- Let Layout handle all header/footer rendering

**Q: Auth not persisting?**
- Check localStorage keys match panel type
- Ensure user data is JSON stringified

**Q: Mobile menu not closing?**
- HeroUI handles this automatically
- Verify Navbar component has proper props

---

## Testing Layouts

### Admin
Visit: `http://localhost:3000/admin/dashboard`
Should show: Red gradient header + Admin content + Footer

### Seller
Visit: `http://localhost:3000/seller/1/dashboard`
Should show: Blue gradient header + Seller content + Footer

### Landing
Visit: `http://localhost:3000/`
Should show: Default header + Home + Footer

### Store
Visit: `http://store-code.localhost:3000/`
Should show: Store header + Products + Footer


### Step 3: Test Variant Selection
1. Click on store (e.g., "Vegetable Wings" - VW001)
2. Look for product with multiple variants
3. You will see:
   - Single product card (not separate cards for each variant)
   - "Add to Cart" button is GRAY/DISABLED
   - Button text says "Select Variant First"
4. Click dropdown arrow
5. Select variant (e.g., "Tomato 1kg - ₹250")
6. See:
   - Price updates to selected variant's price
   - Stock updates to selected variant's stock
   - "Add to Cart" button becomes BLUE/ENABLED
7. Click "Add to Cart"
8. Open cart sidebar (left side)
9. Verify correct variant added to cart

---

## 📊 What Changed

### Currency
- **Before:** USD 250
- **After:** ₹250

### Product Cards
- **Before:** 3 separate cards (one per variant)
- **After:** 1 card with variant dropdown

### Add to Cart Button
- **Before:** Always enabled
- **After:** Disabled until variant selected (for multi-variant products)

---

## 🎯 Key Features

✅ **Variant Grouping** - Related variants grouped in single card
✅ **Variant Selector** - Dropdown to choose variant
✅ **Price Updates** - Price updates when variant selected
✅ **Rupee Symbol** - All prices in ₹ not USD
✅ **Required Selection** - Must select variant before add to cart
✅ **4 Stores** - 403 products across VW001, KM001, DH001, MH001

---

## 📁 Files to Check

**If you want to see the code:**

1. **Variant Logic:**
   - `/web/components/store-home-page.tsx` (line 122-144: getGroupedProducts function)
   - `/web/app/store/[code]/page.tsx` (line 120-136: getGroupedProducts function)

2. **Add to Cart Button Logic:**
   - `/web/components/store-home-page.tsx` (line 440-450: conditional disable)
   - `/web/app/store/[code]/page.tsx` (line 367-377: conditional disable)

3. **Variant Selector UI:**
   - `/web/components/store-home-page.tsx` (line 388-407: dropdown)
   - `/web/app/store/[code]/page.tsx` (line 393-414: dropdown)

4. **Currency Display:**
   - All `₹` symbols instead of `{currency}`
   - Search for "₹" to find all occurrences

---

## 🐛 Common Issues & Fixes

### Issue: See multiple cards per variant
**Fix:** This might be old code. Clear browser cache and reload
- Clear cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
- Hard reload: Ctrl+F5 (or Cmd+Shift+R on Mac)

### Issue: Add to Cart always disabled
**Fix:** Check variant dropdown was properly selected
- Click dropdown
- Select a variant option
- Button should become blue

### Issue: Price not showing in rupees
**Fix:** Database might need refresh
- Run: `node ace migration:fresh --seed` in `/api` folder

### Issue: Cart showing wrong product
**Fix:** Make sure selected variant is passed, not base product
- Check cart sidebar - should show variant name like "Tomato 2kg"

---

## 📞 Quick Debug

**Check if variants are grouped:**
Open browser console (F12) and check products count
- Before: 403 separate products
- After: ~130 grouped products (with 3 variants each)

**Check if variant is selected:**
Open browser console and run:
```javascript
document.querySelector('select').value
// Should show a number (product ID) when variant selected
```

**Check price in rupees:**
Look at any product price - should start with ₹

---

## ✨ Example Test Scenario

1. **Go to Vegetable Wings store**
   - Click store from home page
   - URL should be: `http://localhost:3000/store/VW001`

2. **Find Tomato product**
   - Should see 3 variants available
   - Single card showing "Tomato"

3. **Try to add to cart**
   - "Add to Cart" button is GRAY
   - Text says "Select Variant First"

4. **Select variant**
   - Click dropdown
   - Select "Tomato 1kg - ₹250"

5. **See changes**
   - Price updates to ₹250
   - Stock updates to variant's stock
   - Button turns BLUE

6. **Add to cart**
   - Click "Add to Cart"
   - Cart sidebar opens
   - Shows "Tomato 1kg" with ₹250

---

## 📈 Stores & Products

| Store | Code | Products | Categories |
|-------|------|----------|------------|
| Vegetable Wings | VW001 | 96 | Vegetables, Fruits |
| Kirana Mart | KM001 | 102 | Groceries, Dairy |
| Digital Helper | DH001 | 103 | Electronics |
| My Home | MH001 | 102 | Kitchen, Home |

---

## 🎓 Understanding Variant SKUs

**SKU Format:** `[STORE]-[PRODUCT]-[VARIANT]`

**Example - Tomato in Vegetable Wings:**
- VW-TMAT-001 (Tomato 1kg)
- VW-TMAT-002 (Tomato 2kg)
- VW-TMAT-003 (Tomato 3kg)

**Grouping:**
- Base SKU: `VW-TMAT` (remove last number)
- All 3 variants grouped together
- Single card shown with dropdown

**Pricing:**
- Each variant has own price
- VW-TMAT-001: ₹250
- VW-TMAT-002: ₹450
- VW-TMAT-003: ₹600

---

**Ready to Test? 🚀 Start with "Step 1: Start the Application" above**
