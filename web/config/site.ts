export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Hatiri Shop",
  description:
    "Quick commerce delivery for groceries, fruits, and more. Get what you need in 30 minutes.",
  navItems: [
    {
      label: "Shop",
      href: "/",
    },
    {
      label: "Categories",
      href: "/#categories",
    },
    {
      label: "About",
      href: "/about",
    },
    {
      label: "Help",
      href: "/help",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Orders",
      href: "/orders",
    },
    {
      label: "Saved Items",
      href: "/saved",
    },
    {
      label: "Account Settings",
      href: "/account",
    },
    {
      label: "Help & Support",
      href: "/support",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  categories: [
    { name: "Fruits", slug: "fruit", emoji: "🍎" },
    { name: "Vegetables", slug: "vegetable", emoji: "🥬" },
    { name: "Groceries", slug: "grocery", emoji: "🛒" },
    { name: "Bakery", slug: "bakery", emoji: "🍞" },
    { name: "Electronics", slug: "electronics", emoji: "📱" },
    { name: "Kitchenware", slug: "kitchenware", emoji: "🍳" },
    { name: "Furniture", slug: "furniture", emoji: "🪑" },
  ],
  links: {
    github: "https://github.com/purushotam56/hatiri-shop",
    twitter: "https://twitter.com",
    docs: "https://hatiri.shop",
    discord: "https://discord.gg",
    sponsor: "https://hatiri.shop",
  },
};
