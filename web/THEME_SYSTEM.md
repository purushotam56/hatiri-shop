# Theme System Documentation

A comprehensive theming system with dark/light mode support and multiple color palettes.

## Features

- 🎨 **9 Beautiful Color Palettes** - Ocean, Sunset, Forest, Royal, Cherry, Slate, Mint, Cosmic, Monochrome
- 🌓 **Dark/Light Mode** - Full support with system detection
- ⚡ **Easy Configuration** - Change palette with one line of code
- 🎯 **Type-Safe** - Full TypeScript support
- 🔄 **Dynamic Switching** - Real-time theme changes
- 📦 **HeroUI Integration** - Works seamlessly with all HeroUI components

## Quick Start

### 1. View Available Palettes

Visit `/theme-demo` to see all available color palettes and components.

### 2. Change Color Palette

Edit `config/theme-config.ts`:

```typescript
export const DEFAULT_PALETTE: keyof typeof COLOR_PALETTES = "ocean"; // Change to: sunset, forest, royal, etc.
```

### 3. Set Default Theme Mode

Edit `config/theme-config.ts`:

```typescript
export const DEFAULT_THEME_MODE: "light" | "dark" | "system" = "system";
```

## Available Palettes

| Palette | Description | Best For |
|---------|-------------|----------|
| **ocean** | Professional, trustworthy, tech-forward | Corporate, SaaS, Tech |
| **sunset** | Energetic, vibrant, action-oriented | E-commerce, Events |
| **forest** | Natural, eco-friendly, organic | Eco products, Health |
| **royal** | Premium, luxurious, sophisticated | Luxury brands, Premium services |
| **cherry** | Bold, passionate, attention-grabbing | Fashion, Entertainment |
| **slate** | Modern, minimal, elegant | Minimal design, Portfolios |
| **mint** | Clean, refreshing, modern | Health, Wellness, Clean brands |
| **cosmic** | Futuristic, innovative, tech-savvy | Startups, Tech, Innovation |
| **monochrome** | Classic, timeless, professional | Law, Finance, Corporate |

## Using Theme Colors in Your Components

### With Tailwind Classes

```tsx
// Primary color
<div className="bg-primary text-primary-foreground">
  Primary background
</div>

// Secondary color
<Button color="secondary">Secondary Button</Button>

// All theme colors
<div className="bg-success">Success</div>
<div className="bg-warning">Warning</div>
<div className="bg-danger">Danger</div>
```

### With HeroUI Components

```tsx
import { Button, Card, Chip } from "@heroui/react";

// Buttons automatically use theme colors
<Button color="primary">Primary</Button>
<Button color="secondary">Secondary</Button>

// Cards with theme colors
<Card className="bg-primary text-primary-foreground">
  <CardBody>Themed Card</CardBody>
</Card>

// Chips
<Chip color="success">Success</Chip>
```

### With Custom Hook

```tsx
import { useTheme } from "@/hooks/use-theme";

export function MyComponent() {
  const { theme, isDark, palette, setTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Palette: {palette.name}</p>
      <p>Is dark mode: {isDark ? "Yes" : "No"}</p>
      <button onClick={() => setTheme("dark")}>Switch to Dark</button>
    </div>
  );
}
```

## Theme Switcher Components

### Simple Theme Switch

```tsx
import { ThemeSwitch } from "@/components/theme-switch";

<ThemeSwitch />
```

### Enhanced Theme Switch (with Dropdown)

```tsx
import { EnhancedThemeSwitch } from "@/components/enhanced-theme-switch";

<EnhancedThemeSwitch showLabel />
```

## File Structure

```
web/
├── config/
│   └── theme-config.ts          # Main theme configuration
├── hooks/
│   └── use-theme.ts              # Theme hook
├── components/
│   ├── theme-injector.tsx        # Injects CSS variables
│   ├── theme-switch.tsx          # Simple toggle
│   ├── enhanced-theme-switch.tsx # Dropdown with options
│   └── palette-showcase.tsx      # Visual palette display
├── app/
│   ├── providers.tsx             # Theme providers setup
│   └── theme-demo/
│       └── page.tsx              # Demo page
└── tailwind.config.js            # Tailwind theme integration
```

## Creating Custom Palettes

Add your custom palette to `config/theme-config.ts`:

```typescript
export const COLOR_PALETTES: Record<string, ColorPalette> = {
  // ... existing palettes
  
  // Your custom palette
  myCustom: {
    name: "My Custom Theme",
    description: "My brand colors",
    colors: {
      primary: "hsl(200, 100%, 50%)",      // Your brand primary
      secondary: "hsl(150, 80%, 45%)",     // Your brand secondary
      accent: "hsl(280, 70%, 60%)",        // Accent color
      success: "hsl(142, 71%, 45%)",       // Keep standard
      warning: "hsl(38, 92%, 50%)",        // Keep standard
      danger: "hsl(0, 84%, 60%)",          // Keep standard
    },
  },
};

// Then set it as default
export const DEFAULT_PALETTE = "myCustom";
```

## Dark Mode Customization

The theme system automatically adjusts colors for dark mode. To customize dark mode behavior, edit `tailwind.config.js`:

```javascript
plugins: [
  heroui({
    themes: {
      dark: {
        colors: {
          background: "#000000",  // Customize dark background
          foreground: "#ECEDEE",  // Customize dark text
          // ... other customizations
        },
      },
    },
  }),
],
```

## Advanced Usage

### Accessing Palette in Server Components

```tsx
import { getActivePalette } from "@/config/theme-config";

export default function Page() {
  const palette = getActivePalette();
  
  return (
    <div>
      <h1>Using {palette.name}</h1>
      <p>{palette.description}</p>
    </div>
  );
}
```

### Programmatic Theme Changes

```tsx
"use client";

import { useTheme } from "@/hooks/use-theme";

export function ThemeControls() {
  const { setTheme, allPalettes } = useTheme();
  
  return (
    <div>
      <button onClick={() => setTheme("light")}>Light</button>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("system")}>System</button>
    </div>
  );
}
```

## Best Practices

1. **Use semantic color names** - Use `primary`, `secondary` instead of specific colors
2. **Test in both modes** - Always check light and dark mode
3. **Consistent usage** - Stick to one palette throughout the app
4. **Accessibility** - Ensure sufficient contrast in both modes
5. **System preference** - Default to system theme for better UX

## Troubleshooting

### Colors not showing up?

Make sure:
1. You've restarted the dev server after changing `theme-config.ts`
2. The `ThemeInjector` is included in your providers
3. Tailwind config includes the theme plugin

### Dark mode not working?

Check:
1. `darkMode: "class"` is set in `tailwind.config.js`
2. `attribute="class"` is set in `NextThemesProvider`
3. Browser doesn't have forced color scheme

### Custom palette not applying?

Verify:
1. Palette is added to `COLOR_PALETTES` object
2. `DEFAULT_PALETTE` is set to your palette key
3. HSL format is correct: `hsl(hue, saturation%, lightness%)`

## Examples

Visit `/theme-demo` for live examples and interactive palette showcase.
