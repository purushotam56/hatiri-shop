# Theme System - Quick Start Guide

## 🎨 What You Get

A complete theming system with:
- ✅ **9 Beautiful Color Palettes** - Ready to use
- ✅ **Dark/Light Mode** - Automatic system detection
- ✅ **One-Line Configuration** - Change entire site theme instantly
- ✅ **Full TypeScript Support** - Type-safe theme access
- ✅ **HeroUI Integration** - Works with all components

## 🚀 Quick Start (3 Steps)

### 1. View the Demo
Visit: **http://localhost:3000/theme-demo**

### 2. Change the Color Palette
Edit `web/config/theme-config.ts`:
```typescript
export const DEFAULT_PALETTE = "ocean"; // Try: sunset, forest, royal, cherry, slate, mint, cosmic, monochrome
```

### 3. Use in Your Components
```tsx
// Buttons
<Button color="primary">Click Me</Button>

// Cards
<div className="bg-primary text-primary-foreground">
  Themed Content
</div>

// Custom Hook
const { theme, isDark, palette } = useTheme();
```

## 📦 Available Palettes

| Palette | Best For |
|---------|----------|
| `ocean` | Tech, SaaS, Corporate |
| `sunset` | E-commerce, Events |
| `forest` | Eco, Health, Organic |
| `royal` | Luxury, Premium |
| `cherry` | Fashion, Bold brands |
| `slate` | Minimal, Modern |
| `mint` | Clean, Fresh |
| `cosmic` | Futuristic, Tech |
| `monochrome` | Classic, Professional |

## 🎯 Common Use Cases

### Change Theme Programmatically
```tsx
import { useTheme } from "@/hooks/use-theme";

const { setTheme } = useTheme();
setTheme("dark"); // or "light" or "system"
```

### Access Current Theme
```tsx
const { theme, isDark, palette } = useTheme();

console.log(theme);          // "light" or "dark"
console.log(isDark);         // true/false
console.log(palette.name);   // "Ocean Blue"
```

### Add Theme Switcher
```tsx
import { EnhancedThemeSwitch } from "@/components/enhanced-theme-switch";

<EnhancedThemeSwitch showLabel />
```

## 📝 Files Created

```
web/
├── config/theme-config.ts              # 👈 Edit this to change palette
├── hooks/use-theme.ts
├── components/
│   ├── theme-injector.tsx
│   ├── enhanced-theme-switch.tsx
│   ├── palette-showcase.tsx
│   ├── runtime-palette-selector.tsx
│   └── theme-quick-reference.tsx
├── app/
│   ├── providers.tsx                   # Updated
│   └── theme-demo/page.tsx             # Demo page
├── tailwind.config.js                  # Updated
├── THEME_SYSTEM.md                     # Full documentation
└── THEME_QUICK_START.md               # This file
```

## 💡 Tips

1. **Always restart dev server** after changing `theme-config.ts`
2. **Test both modes** - Check light and dark mode
3. **Use semantic colors** - Use `primary`, `secondary` instead of hardcoded colors
4. **System default is best** - Let users' system preference take precedence

## 🐛 Troubleshooting

**Colors not showing?**
- Restart dev server
- Check `DEFAULT_PALETTE` in `config/theme-config.ts`

**Dark mode not working?**
- Clear browser cache
- Check system preferences

## 📚 Full Documentation

See `THEME_SYSTEM.md` for complete documentation.

## 🎮 Interactive Demo

Visit `/theme-demo` to:
- Try all 9 color palettes live
- Test dark/light mode
- See component examples
- Get code snippets
