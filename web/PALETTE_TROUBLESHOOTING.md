# Palette System - Troubleshooting & Fixes

## ✅ Issues Fixed

### 1. CSS Variable Format
**Problem**: HeroUI wasn't reading CSS variables correctly
**Fix**: Updated Tailwind config to use proper CSS variable syntax with opacity channel

### 2. Initial Load
**Problem**: CSS variables not available on first page load
**Fix**: Added default values in `globals.css` 

### 3. Color Shades
**Problem**: Missing color shades for HeroUI components
**Fix**: Added full 50-900 color scales for all theme colors

## 🧪 Testing Your Palette

Visit `/theme-demo` and check the **CSS Variables Debug** card at the top. It should show:

```
--theme-primary: 199, 89%, 48%
--theme-secondary: 142, 71%, 45%
--theme-accent: 271, 81%, 56%
```

### If Values Are Missing:

1. **Clear browser cache** (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. **Restart dev server**: `npm run dev`
3. **Check config**: Verify `DEFAULT_PALETTE` in `config/theme-config.ts`

## 🎨 How to Change Palette

### Method 1: Configuration File (Production)

Edit `web/config/theme-config.ts`:
```typescript
export const DEFAULT_PALETTE = "sunset"; // Change this line
```

Then restart dev server.

### Method 2: Runtime Switcher (Demo)

On `/theme-demo` page, use the **Runtime Palette Switcher** to test palettes instantly.

## 🔍 Verifying It Works

1. **Visit** `/theme-demo`
2. **Check** the CSS Variables Debug card shows values
3. **Use** Runtime Palette Switcher - colors should change immediately
4. **Test** components below update their colors

### Expected Behavior:

- ✅ Buttons change color when palette switches
- ✅ Cards update their background colors
- ✅ Chips reflect new palette
- ✅ Debug card shows correct HSL values

## 🚨 Common Issues

### Issue: Colors don't change
**Solution**: 
```bash
# 1. Stop dev server (Ctrl+C)
# 2. Clear .next folder
rm -rf .next
# 3. Restart
npm run dev
```

### Issue: Only some components update
**Solution**: Components must use `color="primary"` prop or `bg-primary` class. Update hardcoded colors.

### Issue: Dark mode colors look wrong
**Solution**: Dark theme uses inverted color scales. Check `tailwind.config.js` dark theme section.

## 📝 Key Files

```
web/
├── config/theme-config.ts         # 👈 Change DEFAULT_PALETTE here
├── styles/globals.css             # CSS variables default values
├── tailwind.config.js             # HeroUI theme integration
├── components/theme-injector.tsx  # Injects variables on load
└── app/theme-demo/page.tsx        # Test here
```

## ✨ How It Works

1. **On Load**: `globals.css` provides default CSS variables
2. **Theme Injector**: Reads `theme-config.ts` and updates variables
3. **Tailwind**: Uses variables via `hsl(var(--theme-primary) / 1)`
4. **HeroUI**: Components automatically use themed colors
5. **Runtime Switch**: Updates CSS variables directly for instant preview

## 🎯 Best Practices

1. **Use config file for production** - Don't rely on runtime switching
2. **Test all components** - Verify buttons, cards, chips all update
3. **Check both modes** - Test light and dark mode
4. **Clear cache** - After changing config, clear browser cache
5. **Restart server** - Config changes require server restart

## 📊 Debug Checklist

When palette isn't working:

- [ ] Values show in debug card?
- [ ] Dev server restarted?
- [ ] Browser cache cleared?
- [ ] Using `color="primary"` on components?
- [ ] `DEFAULT_PALETTE` set correctly?
- [ ] No console errors?

If all checked and still not working, check browser console for errors.
