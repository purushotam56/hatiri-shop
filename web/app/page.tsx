import { headers } from "next/headers";
import Link from "next/link";

import { StoreLayout } from "@/components/layouts/store-layout";
import { StoreHomePage } from "@/components/store-home-page";
import { apiEndpoints } from "@/lib/api-client";

function getSubdomainCode(hostname: string): string | null {
  // Check if it's an IP address (no subdomain support for IPs)
  if (/^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    return null;
  }

  const parts = hostname.split(".");

  // Check if it's a subdomain (not localhost, not www, not main domain)
  if (parts.length >= 3 && parts[0] !== "localhost" && parts[0] !== "www") {
    return parts[0].toUpperCase();
  }

  return null;
}

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host") || "";

  // Check if URL contains a subdomain with org code
  const subdomainCode = getSubdomainCode(host);

  if (subdomainCode) {
    const organisation =
      await apiEndpoints.getOrganisationByCode(subdomainCode);

    // Render store page for subdomain
    return (
      <StoreLayout
        logoUrl={organisation?.organisation?.image?.url}
        storeCode={organisation?.organisation?.organisationUniqueCode}
        storeName={organisation?.organisation?.name}
      >
        <StoreHomePage storeCode={subdomainCode} />
      </StoreLayout>
    );
  }

  // Fresh Modern SaaS Landing Page
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-4xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                Hatiri
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-200 transform hover:scale-105"
              href="/seller"
            >
              Sell with Us →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10" />
        </div>

        <div className="mb-6 inline-block px-4 py-2 bg-green-100 border border-green-300 rounded-full hover:border-green-400 transition-all">
          <span className="text-green-700 font-bold text-sm">
            🎉 14 Days Free Trial • No Credit Card Required
          </span>
        </div>

        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
          Launch Your
          <br />
          <span className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 bg-clip-text text-transparent">
            Quick Commerce
          </span>
          <br />
          Business
        </h1>

        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
          Hatiri is the complete platform for sellers. We handle the technology
          while you control everything—choose your delivery partners, payment
          methods, and grow your business your way.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold shadow-lg shadow-orange-300/50 hover:shadow-2xl hover:shadow-orange-300/60 transition-all duration-200 transform hover:scale-105 hover:from-orange-700 hover:to-orange-600"
            href="/seller"
          >
            Start 14-Day Free Trial →
          </Link>
          <button className="px-8 py-3.5 rounded-full border-2 border-gray-300 text-gray-900 font-semibold hover:border-orange-400 hover:bg-orange-50 transition-all duration-200">
            See How It Works
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 mb-16">
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Free for 14 days</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>No credit card needed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span>Full feature access</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mx-auto max-w-5xl">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-12 border border-gray-200">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 h-28 flex flex-col items-center justify-center border border-gray-100 hover:border-orange-300 transition-all">
                <span className="text-4xl mb-2">📦</span>
                <span className="text-xs font-semibold text-gray-700">
                  Manage Products
                </span>
              </div>
              <div className="bg-white rounded-xl p-6 h-28 flex flex-col items-center justify-center border border-gray-100 hover:border-orange-300 transition-all">
                <span className="text-4xl mb-2">🚚</span>
                <span className="text-xs font-semibold text-gray-700">
                  Track Orders
                </span>
              </div>
              <div className="bg-white rounded-xl p-6 h-28 flex flex-col items-center justify-center border border-gray-100 hover:border-orange-300 transition-all">
                <span className="text-4xl mb-2">💳</span>
                <span className="text-xs font-semibold text-gray-700">
                  Process Payments
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="text-center mb-20">
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            Everything You Need
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto font-light">
            All the tools to run your quick commerce business, without the
            complexity
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">
              🛒
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Product Management
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Manage inventory, pricing, and product details from a simple
              dashboard. Real-time stock updates.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">
              🚚
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Your Delivery Partners
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Integrate with partners you choose. Full control over delivery
              rates and customer experience.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">
              💳
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Your Payment Gateway
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Choose your payment processor. Support UPI, cards, wallets, and
              more payment methods.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">
              👥
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Customer Management
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Track orders, manage customers, and build relationships. See who
              your best customers are.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">
              📊
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Real-Time Analytics
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Dashboard with sales metrics, popular products, and customer
              insights. Make data-driven decisions.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
            <div className="text-6xl mb-5 group-hover:scale-110 transition-transform duration-300">
              📱
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Customer App
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Beautiful storefront where customers can browse, order, track
              deliveries, and download invoices.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-gray-900 mb-3">
            Get Started in 3 Steps
          </h2>
          <p className="text-gray-600 text-lg">
            Launch your business faster than you think
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Step 1 */}
          <div className="flex flex-col">
            <div className="bg-white rounded-xl p-8 text-center border-2 border-orange-100 flex flex-col h-full">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-2xl mb-6">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sign Up</h3>
              <p className="text-gray-600 flex-grow">
                Create your seller account and verify your business details in
                minutes.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col">
            <div className="bg-white rounded-xl p-8 text-center border-2 border-orange-100 flex flex-col h-full">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-2xl mb-6">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Setup Store
              </h3>
              <p className="text-gray-600 flex-grow">
                Add products, choose delivery partners, set payment methods, and
                customize your store.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col">
            <div className="bg-white rounded-xl p-8 text-center border-2 border-orange-100 flex flex-col h-full">
              <div className="flex justify-center">
                <div className="w-14 h-14 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-2xl mb-6">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Start Selling
              </h3>
              <p className="text-gray-600 flex-grow">
                Go live and receive your first orders. Manage everything from
                your dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Hatiri */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-orange-50 to-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-black text-gray-900 mb-8">
              Why Hatiri?
            </h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <span className="text-orange-600 text-3xl flex-shrink-0">
                  ✓
                </span>
                <div>
                  <h3 className="text-gray-900 font-bold mb-1 text-lg">
                    Complete Control
                  </h3>
                  <p className="text-gray-600">
                    Choose your delivery partners and payment gateways. No
                    vendor lock-in.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-orange-600 text-3xl flex-shrink-0">
                  ✓
                </span>
                <div>
                  <h3 className="text-gray-900 font-bold mb-1 text-lg">
                    Simple to Use
                  </h3>
                  <p className="text-gray-600">
                    Intuitive dashboard built for sellers. Start without
                    technical knowledge.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-orange-600 text-3xl flex-shrink-0">
                  ✓
                </span>
                <div>
                  <h3 className="text-gray-900 font-bold mb-1 text-lg">
                    Fair Pricing
                  </h3>
                  <p className="text-gray-600">
                    Transparent costs that scale with your business. No hidden
                    charges.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-orange-600 text-3xl flex-shrink-0">
                  ✓
                </span>
                <div>
                  <h3 className="text-gray-900 font-bold mb-1 text-lg">
                    Always Available
                  </h3>
                  <p className="text-gray-600">
                    Dedicated support team ready to help you grow.
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl p-8 border-2 border-orange-100 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-orange-50 rounded-lg p-6 text-center">
                  <div className="text-3xl mb-2">⚡</div>
                  <p className="text-sm font-semibold text-gray-900">
                    Fast Setup
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-6 text-center">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-sm font-semibold text-gray-900">
                    Smart Tools
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-6 text-center">
                  <div className="text-3xl mb-2">📈</div>
                  <p className="text-sm font-semibold text-gray-900">
                    Grow Fast
                  </p>
                </div>
                <div className="bg-orange-50 rounded-lg p-6 text-center">
                  <div className="text-3xl mb-2">🛡️</div>
                  <p className="text-sm font-semibold text-gray-900">Secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-3xl p-16 text-white shadow-2xl">
          <h2 className="text-4xl font-black mb-3">
            Start Your Free Trial Today
          </h2>
          <p className="text-orange-100 text-lg mb-2 max-w-2xl mx-auto">
            14 days of full access. No credit card. No commitments.
          </p>
          <p className="text-orange-100 text-sm mb-8 max-w-2xl mx-auto">
            Join 100+ sellers already growing their business with Hatiri.
          </p>
          <Link
            className="inline-block px-8 py-3.5 rounded-full bg-white text-orange-600 font-semibold hover:bg-gray-100 transition-all shadow-lg"
            href="/seller"
          >
            Start Your Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-gray-900 font-black text-xl mb-3">Hatiri</h3>
              <p className="text-gray-600 text-sm">
                The complete platform for quick commerce sellers
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold mb-4 text-sm uppercase">
                Product
              </h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>
                  <button className="hover:text-orange-600 transition text-left">
                    Features
                  </button>
                </li>
                <li>
                  <button className="hover:text-orange-600 transition text-left">
                    Pricing
                  </button>
                </li>
                <li>
                  <button className="hover:text-orange-600 transition text-left">
                    Security
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold mb-4 text-sm uppercase">
                Company
              </h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>
                  <button className="hover:text-orange-600 transition text-left">
                    About
                  </button>
                </li>
                <li>
                  <button className="hover:text-orange-600 transition text-left">
                    Blog
                  </button>
                </li>
                <li>
                  <button className="hover:text-orange-600 transition text-left">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-bold mb-4 text-sm uppercase">
                Legal
              </h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>
                  <button className="hover:text-orange-600 transition text-left">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="hover:text-orange-600 transition text-left">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; 2025 Hatiri. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
