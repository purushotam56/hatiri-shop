"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { COLORS, COMPONENTS, UTILS, GRADIENTS } from "@/lib/theme";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  sku?: string;
  unit?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  currency: string;
}

interface Organisation {
  id: number;
  name: string;
  organisationUniqueCode: string;
  currency: string;
}

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const storeCode = params.code as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "name" | "stock">("name");
  const [organisation, setOrganisation] = useState<Organisation | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (storeCode) {
      fetchOrganistaionIdAndProducts(storedToken);
    }
    loadCart();
  }, [storeCode]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchQuery, sortBy]);

  const filterAndSortProducts = () => {
    let filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "stock") return b.stock - a.stock;
      return 0;
    });

    setFilteredProducts(filtered);
  };

  const fetchOrganistaionIdAndProducts = async (authToken: string | null) => {
    try {
      // First, fetch all organisations to find the ID from the code
      const orgRes = await fetch("http://localhost:3333/api/organisations");
      if (!orgRes.ok) throw new Error("Failed to fetch organisations");
      
      const orgData = await orgRes.json();
      const org = orgData.organisations?.find(
        (org: any) => org.organisationUniqueCode === storeCode
      );
      
      if (!org) {
        console.error(`Organisation with code ${storeCode} not found`);
        setLoading(false);
        return;
      }

      setOrganisation(org);

      // Now fetch products for this organisation
      await fetchProducts(authToken, org.id);
    } catch (error) {
      console.error("Failed to fetch organisation ID:", error);
      setLoading(false);
    }
  };

  const fetchProducts = async (authToken: string | null, organisationId: number) => {
    try {
      const headers: HeadersInit = { "Content-Type": "application/json" };
      if (authToken) headers["Authorization"] = `Bearer ${authToken}`;

      const res = await fetch(`http://localhost:3333/api/products?organisationId=${organisationId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.data?.data || data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          currency: product.currency,
        },
      ];
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={`min-h-screen ${GRADIENTS.page.dark}`}>
      {/* Store Header - Quick Commerce Style */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Store Logo/Name */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-600 rounded-lg flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {organisation?.name.charAt(0) || "🏬"}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {organisation?.name || storeCode}
              </h1>
              <p className="text-xs text-emerald-400 font-medium">⚡ 10 mins delivery</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
            />
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative px-4 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg transition-all transform hover:scale-105 flex items-center gap-2"
          >
            🛒
            {cartCount > 0 && (
              <span className="ml-1 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Search & Filter Bar */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-4 flex-col md:flex-row">
                <input
                  type="text"
                  placeholder="🔍 Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 ${COMPONENTS.input.base} ${COMPONENTS.input.focus} ${COMPONENTS.input.primary} md:hidden`}
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`px-4 py-3 ${COMPONENTS.input.base} ${COMPONENTS.input.focus} ${COMPONENTS.input.primary} min-w-48`}
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="stock">In Stock</option>
                </select>
              </div>
              <div className="text-sm text-slate-400">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-400 font-medium">Loading premium products...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={`${COMPONENTS.card.base} p-12 text-center`}>
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-300 text-lg font-medium mb-2">
                  {searchQuery ? "No products found" : "No products available"}
                </p>
                <p className="text-slate-500 mb-6">
                  {searchQuery ? "Try adjusting your search terms" : "Check back soon!"}
                </p>
                <Link href="/" className={`inline-block px-6 py-2 rounded-lg text-white font-medium transition-all ${COLORS.customer.from} ${COLORS.customer.to} hover:scale-105 transform`}>
                  Browse Other Stores
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group ${COMPONENTS.card.base} overflow-hidden transition-all duration-300 flex flex-col`}
                  >
                    {/* Product Image Area */}
                    <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-600/10 h-48 flex items-center justify-center border-b border-slate-700 overflow-hidden">
                      <div className="text-7xl group-hover:scale-125 transition-transform duration-300">📦</div>
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                          <span className="text-white font-bold text-lg">OUT OF STOCK</span>
                        </div>
                      )}
                      {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-2 right-2 bg-orange-500/90 text-white px-2 py-1 rounded-lg text-xs font-bold">
                          Only {product.stock} left!
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        {product.name}
                      </h3>
                      
                      {product.description && (
                        <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">
                          {product.description}
                        </p>
                      )}

                      <div className="space-y-3">
                        {/* Price */}
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            {product.currency} {parseFloat(String(product.price)).toFixed(2)}
                          </span>
                          {product.sku && (
                            <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded-full">
                              {product.sku}
                            </span>
                          )}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                          onClick={() => addToCart(product)}
                          disabled={product.stock === 0}
                          className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                            product.stock === 0
                              ? "bg-slate-700 text-slate-400"
                              : `bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/50`
                          }`}
                        >
                          {product.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div
            className={`lg:col-span-1 transition-all duration-300 ${
              showCart ? "block" : "hidden lg:block"
            }`}
          >
            <div className={`${COMPONENTS.card.base} sticky top-24 p-6 max-h-[calc(100vh-120px)] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">🛒 Your Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="lg:hidden text-slate-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🛍️</div>
                  <p className="text-slate-400 font-medium mb-2">Your cart is empty</p>
                  <p className="text-xs text-slate-500">Add items to get started!</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-700/30 rounded-xl p-4 border border-slate-600 hover:border-blue-500/50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-white line-clamp-1">{item.name}</p>
                            <p className="text-sm text-slate-400 mt-1">
                              {item.currency} {parseFloat(String(item.price)).toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-500 transition-colors font-bold"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-slate-300 hover:bg-slate-700 rounded transition-colors font-bold"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-white flex-1 text-center font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-3 py-1 text-slate-300 hover:bg-slate-700 rounded transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="border-t border-slate-600 pt-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-400 text-sm">
                        <span>Subtotal</span>
                        <span>{cart[0]?.currency} {cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-slate-400 text-sm">
                        <span>Items</span>
                        <span className="font-bold">{cartCount}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-600">
                      <span className="text-slate-200 font-semibold">Total:</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        {cart[0]?.currency} {cartTotal.toFixed(2)}
                      </span>
                    </div>

                    {/* Checkout Button */}
                    {token ? (
                      <button className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 text-white ${COLORS.ecommerce.from} ${COLORS.ecommerce.to} ${COLORS.ecommerce.hover} shadow-lg ${COLORS.ecommerce.shadow}`}>
                        ✓ Proceed to Checkout
                      </button>
                    ) : (
                      <>
                        <Link
                          href="/login"
                          className={`w-full block text-center py-3 rounded-lg font-bold transition-all transform hover:scale-105 text-white ${COLORS.ecommerce.from} ${COLORS.ecommerce.to} ${COLORS.ecommerce.hover} shadow-lg ${COLORS.ecommerce.shadow}`}
                        >
                          🔐 Login & Checkout
                        </Link>
                        <p className="text-xs text-slate-500 text-center">
                          Login required to complete purchase
                        </p>
                      </>
                    )}

                    {/* Continue Shopping */}
                    <button
                      onClick={() => setShowCart(false)}
                      className="w-full border-2 border-slate-600 text-slate-300 py-2 rounded-lg hover:bg-slate-700 font-medium transition-colors lg:hidden"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
