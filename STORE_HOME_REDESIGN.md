# Store Home Page Redesign - Swiggy Instamart Inspired

## Overview
The store home page has been completely redesigned to match the Swiggy Instamart category listing interface with a modern sidebar navigation and improved product grid layout.

## Key Changes

### 1. **New Layout Structure**
- **Left Sidebar** (Desktop only, sticky): Category filter menu with icons and labels
- **Main Content Area**: Product grid with filters and sorting options
- **Mobile Tabs**: Horizontal scrolling category tabs for mobile devices

### 2. **Sidebar Features**
- ✨ **Filters Header**: Visual filter icon with "Filters" label
- 🏷️ **Category List**: All categories with emoji icons
- 🎯 **Active State**: Visual highlight showing selected category
- 📌 **Sticky Position**: Stays in view while scrolling product grid
- 📱 **Responsive**: Hidden on mobile, shown on desktop (lg breakpoint)

### 3. **Mobile Category Navigation**
- 📱 Horizontal scrolling tabs at the top
- 🎨 Active category highlighted in primary color
- 👆 Full touch-friendly implementation
- ♻️ ScrollShadow for better UX with overflow

### 4. **Product Grid Improvements**
- **Grid Responsiveness**: 
  - Mobile: 2 columns
  - Tablet (sm): 3 columns
  - Desktop (md): 4 columns
  - Large (lg): 4 columns
  - Extra Large (xl): 5 columns
- **Better Spacing**: Consistent gap between cards
- **Clean Cards**: White background with subtle borders
- **Hover Effects**: Shadow elevation on hover with smooth transitions

### 5. **Product Card Enhancements**
- 🖼️ **Large Image Area**: More prominent product display
- 📍 **Discount Badge**: Top-left corner (green badge)
- ⏰ **Stock Badge**: Top-right corner (red badge) showing items left
- ➕ **Floating Add Button**: Blue circular button in bottom-right on hover
- 💰 **Improved Price Display**: Larger, bolder pricing
- 🎁 **Original Price**: Strikethrough for discounted items (ready for discount logic)
- 🛒 **Add to Cart**: Integrated at bottom of card

### 6. **Filter & Sort Options**
- **Quick Filters**: Chips for Popular, Trending, Best Price
- **Filters Button**: Icon button to open filter panel
- **Sort By Dropdown**: Sorting options (ascending, descending, etc.)
- **Results Counter**: Shows number of products available

### 7. **Category Emoji Mapping**
Extended emoji categories for better visual representation:
- 🏪 All
- 🎁 Top Deals
- 🛏️ Bedsheets & Towels
- 🏠 Home Decor
- 📦 Storage & Organizers
- 🧻 Tissues & Disposables
- 🧹 Cleaning Tools
- 🎉 Party Decor
- 💨 Air Fresheners
- 🌱 Gardening
- 🛁 Bathware & Laundry
- 🔧 Utilities & Tools
- 🙏 Pooja Needs
- ⚙️ Home Appliances
- 🚫 Repellants
- 🏋️ Sports & Gym
- 📝 Office Stationery

## Technical Implementation

### Components
1. **CategorySidebar**: Desktop sidebar with category filtering
2. **MobileCategoryTabs**: Mobile-responsive horizontal tabs
3. **MainContent**: Main product grid and display area
4. **StoreHomePageClient**: Client component handling state and interactions

### State Management
- `selectedCategory`: Tracks currently selected category
- `filteredProducts`: Filters products based on selected category

### Styling Features
- Tailwind CSS for responsive design
- HeroUI components (Button, Card, Chip, ScrollShadow)
- Smooth transitions and hover effects
- Mobile-first approach with lg breakpoint for sidebar

## API Integration
- Fetches organizations and products from `/api/organisations` and `/api/products`
- Fetches categories from `/api/organisation/{id}/categories`
- Server-side rendering with Next.js
- 60-second revalidation cache

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive (iOS Safari, Chrome Mobile)
- Touch-friendly interface

## Future Enhancements
1. Add actual discount percentage logic
2. Implement sort functionality (price, popularity, rating)
3. Add search functionality integrated with sidebar
4. Add filter refinement panel
5. Implement wishlist/favorites
6. Add loading skeletons
7. Implement pagination for large product lists
8. Add product ratings/reviews preview

## Color Palette
- Primary: Blue (for active states and CTAs)
- Success: Green (for discount badges)
- Danger: Red (for stock warnings)
- Background: Light gray/white
- Text: Dark gray/black with varying opacity

## Accessibility
- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
