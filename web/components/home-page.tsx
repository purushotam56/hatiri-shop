"use client";

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { motion, Variants } from "framer-motion";
import Link from "next/link";

import { GRADIENTS, COMPONENTS } from "@/lib/theme";

interface Organisation {
  id: number;
  name: string;
  organisationUniqueCode: string;
  currency: string;
}

interface HomePageProps {
  organisations: Organisation[];
  hostname?: string;
}

const storeDetails: Record<
  string,
  { emoji: string; gradient: string; description: string; categories: string[] }
> = {
  vw001: {
    emoji: "🥬",
    gradient: "from-emerald-500 to-green-600",
    description: "Fresh vegetables & fruits",
    categories: ["Vegetables", "Fruits", "Organic"],
  },
  KM001: {
    emoji: "🏪",
    gradient: "from-amber-500 to-orange-600",
    description: "Groceries, dairy & bakery",
    categories: ["Groceries", "Dairy", "Bakery", "Cosmetics"],
  },
  DH001: {
    emoji: "📱",
    gradient: "from-cyan-500 to-blue-600",
    description: "Electronics & mobile accessories",
    categories: ["Phones", "Computers", "Audio", "Cameras"],
  },
  MH001: {
    emoji: "🏠",
    gradient: "from-violet-500 to-purple-600",
    description: "Home essentials & cleaning",
    categories: ["Kitchen", "Home", "Cleaning", "Bedding"],
  },
};

const WEB_DOMAIN = process.env.NEXT_PUBLIC_WEB_DOMAIN || "localhost:3000";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const glowVariants:Variants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(6, 182, 212, 0.3)",
      "0 0 40px rgba(6, 182, 212, 0.6)",
      "0 0 20px rgba(6, 182, 212, 0.3)",
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export function HomePage({ organisations, hostname }: HomePageProps) {
  return (
    <div className={`min-h-screen ${GRADIENTS.page.dark} overflow-hidden`}>
      {/* Animated background gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl"
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 100, 0] }}
          className="absolute top-1/2 right-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Header */}
      <header className={`${COMPONENTS.header.base}`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.h1
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8 }}
          >
            🛍️ Hatiri
          </motion.h1>
          <motion.nav
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
            initial={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <Button
              as={Link}
              className="text-slate-300"
              href="/login"
              variant="flat"
            >
              Login
            </Button>
            <Button
              as={Link}
              className={COMPONENTS.button.seller}
              href="/seller"
            >
              Sell With Us
            </Button>
          </motion.nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16 relative z-10">
        {/* Hero Section */}
        <motion.div
          animate="visible"
          className="text-center space-y-6 py-16"
          initial="hidden"
          variants={containerVariants}
        >
          <motion.div className="space-y-4" variants={itemVariants}>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              className="text-sm font-semibold text-cyan-400 uppercase tracking-widest inline-block"
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨ Quick Commerce Made Easy
            </motion.span>
            <motion.h2
              className="text-6xl md:text-7xl font-bold text-white leading-tight"
              variants={itemVariants}
            >
              Your Favorite{" "}
              <motion.span
                animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                className="bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 bg-clip-text text-transparent"
                transition={{ duration: 4, repeat: Infinity }}
              >
                Local Stores
              </motion.span>
            </motion.h2>
          </motion.div>

          <motion.p
            className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Shop from multiple local stores near you with lightning-fast
            delivery in 10 minutes.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                as={Link}
                className={COMPONENTS.button.primary}
                href="/products"
                size="lg"
              >
                🛒 Shop Now
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                as={Link}
                className="border-cyan-500/50 text-cyan-400"
                href="#stores"
                size="lg"
                variant="bordered"
              >
                🔍 Explore Stores
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 py-8"
          initial="hidden"
          variants={containerVariants}
          viewport={{ once: true, margin: "-100px" }}
          whileInView="visible"
        >
          {[
            {
              icon: "⚡",
              title: "Lightning Fast",
              desc: "10 minutes delivery",
            },
            { icon: "💰", title: "Best Prices", desc: "Compare & save more" },
            {
              icon: "🛡️",
              title: "Safe & Secure",
              desc: "100% secure payments",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card
                className={`${COMPONENTS.card.base} ${COMPONENTS.card.hoverLift}`}
              >
                <CardBody className="text-center space-y-4 p-6">
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    className="text-5xl"
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  >
                    {feature.icon}
                  </motion.div>
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-slate-400">{feature.desc}</p>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Stores Grid Section */}
        <motion.div
          className="space-y-8"
          id="stores"
          initial={{ opacity: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          whileInView={{ opacity: 1 }}
        >
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              className="text-sm font-semibold text-emerald-400 uppercase tracking-widest inline-block"
              transition={{ duration: 3, repeat: Infinity }}
            >
              🏪 Nearby Stores
            </motion.span>
            <h3 className="text-4xl md:text-5xl font-bold text-white">
              Shop from Popular{" "}
              <motion.span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Local Stores
              </motion.span>
            </h3>
          </motion.div>

          {organisations.length === 0 ? (
            <motion.p
              className="text-slate-400 text-center py-12 text-lg"
              variants={itemVariants}
            >
              No stores available yet
            </motion.p>
          ) : (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              variants={containerVariants}
              viewport={{ once: true, margin: "-100px" }}
              whileInView="visible"
            >
              {organisations
                .filter((org) => org.organisationUniqueCode)
                .map((org) => {
                  const code = org.organisationUniqueCode;
                  const details = storeDetails[code] || {
                    emoji: "🏬",
                    gradient: "from-slate-600 to-slate-700",
                    description: org.name,
                    categories: [],
                  };

                  // Check if hostname is an IP address
                  const isIpAddress =
                    hostname && /^\d+\.\d+\.\d+\.\d+/.test(hostname);
                  const storeUrl = isIpAddress
                    ? `/store/${org.organisationUniqueCode}`
                    : `http://${code.toLowerCase()}.${WEB_DOMAIN}`;

                  return (
                    <motion.div
                      key={org.id}
                      variants={itemVariants}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <a className="group block h-full" href={storeUrl}>
                        <Card
                          className={`${COMPONENTS.card.base} overflow-hidden cursor-pointer relative h-full transition-all duration-300`}
                        >
                          {/* Glow effect */}
                          <motion.div
                            animate="animate"
                            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 to-emerald-500/0 pointer-events-none"
                            style={{ zIndex: 1 }}
                            variants={glowVariants}
                          />

                          {/* Store Header with Emoji */}
                          <motion.div
                            className={`bg-gradient-to-br ${details.gradient} h-40 flex items-center justify-center text-7xl relative z-0`}
                            transition={{ type: "spring", stiffness: 300 }}
                            whileHover={{ scale: 1.1 }}
                          >
                            {details.emoji}
                          </motion.div>

                          {/* Store Info */}
                          <CardBody className="p-6 space-y-4 relative z-10 bg-slate-800/80 backdrop-blur-sm">
                            <div>
                              <h4 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                {org.name}
                              </h4>
                              <p className="text-sm text-slate-400 mt-1">
                                {details.description}
                              </p>
                            </div>

                            {/* Categories */}
                            {details.categories.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                                  Categories
                                </p>
                                <motion.div
                                  animate="visible"
                                  className="flex flex-wrap gap-2"
                                  initial="hidden"
                                  variants={containerVariants}
                                >
                                  {details.categories.map((cat, catIdx) => (
                                    <motion.div
                                      key={catIdx}
                                      variants={itemVariants}
                                      whileHover={{ scale: 1.1, y: -2 }}
                                    >
                                      <Chip
                                        className="bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30 cursor-pointer"
                                        size="sm"
                                      >
                                        {cat}
                                      </Chip>
                                    </motion.div>
                                  ))}
                                </motion.div>
                              </div>
                            )}

                            {/* Footer */}
                            <motion.div
                              className="flex items-center justify-between pt-4 border-t border-slate-700"
                              initial={{ opacity: 0 }}
                              transition={{ delay: 0.3 }}
                              whileInView={{ opacity: 1 }}
                            >
                              <span className="text-xs text-emerald-400 font-semibold">
                                ⚡ 10 mins
                              </span>
                              <motion.span
                                animate={{ x: [0, 4, 0] }}
                                className="text-cyan-400 font-semibold group-hover:text-cyan-300"
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                Browse →
                              </motion.span>
                            </motion.div>
                          </CardBody>
                        </Card>
                      </a>
                    </motion.div>
                  );
                })}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer className="border-t border-slate-700/50 mt-16 py-12 bg-gradient-to-t from-slate-900/50 to-transparent relative z-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-4 gap-8 mb-8"
            initial="hidden"
            variants={containerVariants}
            viewport={{ once: true }}
            whileInView="visible"
          >
            <motion.div className="space-y-3" variants={itemVariants}>
              <h4 className="font-bold text-white text-lg">Hatiri</h4>
              <p className="text-sm text-slate-400">
                Quick commerce from local stores near you
              </p>
            </motion.div>
            <motion.div className="space-y-3" variants={itemVariants}>
              <h4 className="font-bold text-white text-lg">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                    href="/about"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </motion.div>
            <motion.div className="space-y-3" variants={itemVariants}>
              <h4 className="font-bold text-white text-lg">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                    href="/contact"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </motion.div>
            <motion.div className="space-y-3" variants={itemVariants}>
              <h4 className="font-bold text-white text-lg">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="text-slate-400 hover:text-cyan-400 transition-colors duration-300"
                    href="/privacy"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </motion.div>
          </motion.div>
          <motion.div
            className="border-t border-slate-700/50 pt-8 text-center text-slate-500 text-sm"
            initial={{ opacity: 0 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1 }}
          >
            © 2025 Hatiri. All rights reserved. | Locally curated, globally
            delivered
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}
