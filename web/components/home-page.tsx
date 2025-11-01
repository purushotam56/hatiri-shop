"use client";

import Link from "next/link";
import { COLORS, GRADIENTS, COMPONENTS } from "@/lib/theme";

interface Organisation {
  id: number;
  name: string;
  organisationUniqueCode: string;
  currency: string;
}

const storeDetails: Record<string, { emoji: string; color: string; description: string; categories: string[] }> = {
  VW001: {
    emoji: "🥬",
    color: "from-green-400 to-green-600",
    description: "Fresh vegetables & fruits",
    categories: ["Vegetables", "Fruits", "Organic"],
  },
  KM001: {
    emoji: "🏪",
    color: "from-orange-400 to-orange-600",
    description: "Groceries, dairy & bakery",
    categories: ["Groceries", "Dairy", "Bakery", "Cosmetics"],
  },
  DH001: {
    emoji: "📱",
    color: "from-blue-400 to-blue-600",
    description: "Electronics & mobile accessories",
    categories: ["Phones", "Computers", "Audio", "Cameras"],
  },
  MH001: {
    emoji: "�",
    color: "from-purple-400 to-purple-600",
    description: "Home essentials & cleaning",
    categories: ["Kitchen", "Home", "Cleaning", "Bedding"],
  },
};

const WEB_DOMAIN = process.env.NEXT_PUBLIC_WEB_DOMAIN || "localhost:3000";

export function HomePage({
  organisations,
}: {
  organisations: Organisation[];
}) {
  return (
    <div className={`min-h-screen ${GRADIENTS.page.dark}`}>
      {/* Header */}
      <header className={COMPONENTS.header.base}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            🛍️ Hatiri
          </h1>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/seller"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white hover:shadow-lg transition-all"
            >
              Sell With Us
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-12">
          <h2 className="text-5xl font-bold text-white">
            Your Favorite Stores, One Platform
          </h2>
          <p className="text-xl text-slate-400">
            Quick delivery from multiple stores near you
          </p>
        </div>

        {/* Available Stores Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Available Stores</h3>
          
          {organisations.length === 0 ? (
            <p className="text-slate-400 text-center py-12">No stores available</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {organisations
                .filter((org) => org.organisationUniqueCode)
                .map((org) => {
                  const code = org.organisationUniqueCode;
                  const details = storeDetails[code] || {
                    emoji: "🏬",
                    color: "from-slate-500 to-slate-700",
                    description: org.name,
                  };

                  const storeUrl = `http://${code.toLowerCase()}.${WEB_DOMAIN}`;

                  return (
                    <a
                      key={org.id}
                      href={storeUrl}
                      className={`group ${COMPONENTS.card.base} overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}
                    >
                      {/* Store Header */}
                      <div
                        className={`bg-gradient-to-br ${details.color} h-32 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform duration-300`}
                      >
                        {details.emoji}
                      </div>

                      {/* Store Info */}
                      <div className="p-6 space-y-4">
                        {/* Store Name */}
                        <div>
                          <h4 className="text-xl font-bold text-white">{org.name}</h4>
                          <p className="text-sm text-slate-400">{details.description}</p>
                        </div>

                        {/* Categories */}
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Categories</p>
                          <div className="flex flex-wrap gap-2">
                            {details.categories.map((cat, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-slate-700 text-slate-200 text-xs rounded-full font-medium hover:bg-slate-600 transition-colors"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                          <span className="text-xs text-emerald-400 font-medium">
                            ⚡ 10 mins delivery
                          </span>
                          <span className="text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                            Browse →
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 py-12">
          {[
            { icon: "⚡", title: "Fast Delivery", desc: "10 minutes delivery" },
            { icon: "💰", title: "Best Prices", desc: "Competitive pricing" },
            { icon: "🛡️", title: "Safe Payment", desc: "Secure transactions" },
          ].map((feature, i) => (
            <div key={i} className={`${COMPONENTS.card.base} p-6 text-center space-y-3`}>
              <div className="text-4xl">{feature.icon}</div>
              <h4 className="text-lg font-bold text-white">{feature.title}</h4>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-16 py-12 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-white mb-4">Hatiri</h4>
              <p className="text-sm text-slate-400">Quick commerce platform</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-500 text-sm">
            © 2025 Hatiri. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
