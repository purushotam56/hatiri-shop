# Quick Reference Guide

## ✅ What's Done

### Requirement: "if product has variant, i must select variant drop down instead of add to cart"

**IMPLEMENTED:** 
- Users MUST select a variant from dropdown before Add to Cart button works
- Button shows "Select Variant First" when disabled
- Button shows "Add to Cart" when variant is selected

---

## 🚀 How to Test

### Step 1: Start the Application
```bash
# Terminal 1 - Backend API
cd /Users/pc/dev/hatiri/hatiri-shop/api
npm run dev

# Terminal 2 - Frontend
cd /Users/pc/dev/hatiri/hatiri-shop/web
npm run dev
```

### Step 2: Visit Store
```
http://localhost:3000
```

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
