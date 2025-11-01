"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

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

export function StoreHomePage() {
  const router = useRouter();
  const [storeCode, setStoreCode] = useState<string>("");
  const [organisation, setOrganisation] = useState<Organisation | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "name" | "stock">("name");

  useEffect(() => {
    const host = window.location.hostname;
    const parts = host.split(".");
    if (parts.length >= 3 && parts[0] !== "localhost") {
      const code = parts[0].toUpperCase();
      setStoreCode(code);
      fetchStoreData(code);
    }
    
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [products, searchQuery, sortBy]);

  const filterAndSort = () => {
    let filtered = products.filter(
      (p) =>
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

  const fetchStoreData = async (code: string) => {
    try {
      const orgRes = await fetch("http://localhost:3333/api/organisations");
      if (!orgRes.ok) throw new Error("Failed to fetch organisations");

      const orgData = await orgRes.json();
      const org = orgData.organisations?.find(
        (o: any) => o.organisationUniqueCode === code
      );

      if (!org) {
        setLoading(false);
        return;
      }

      setOrganisation(org);

      const prodRes = await fetch(
        `http://localhost:3333/api/products?organisationId=${org.id}`
      );
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.data?.data || prodData.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch store data:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    let updated;

    if (existing) {
      updated = cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [
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

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeFromCart = (productId: number) => {
    const updated = cart.filter((item) => item.id !== productId);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const updated = cart.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Store Header */}
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
            {/* Mobile Search */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-4 flex-col md:flex-row">
                <input
                  type="text"
                  placeholder="🔍 Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 md:hidden px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white focus:outline-none focus:border-emerald-500 min-w-48"
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

            {/* Products Grid */}
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-lg font-medium">No products found</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all hover:shadow-lg"
                  >
                    {/* Product Image */}
                    <div className="bg-gradient-to-br from-slate-700 to-slate-800 h-40 flex items-center justify-center text-5xl relative">
                      📦
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <span className="text-white font-bold">OUT OF STOCK</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      <h3 className="font-bold text-white line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-slate-400 line-clamp-1">
                        {product.description || ""}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-emerald-400">
                          {product.currency} {parseFloat(String(product.price)).toFixed(2)}
                        </span>
                      </div>

                      {product.stock > 0 && product.stock < 5 && (
                        <p className="text-xs text-orange-400 font-medium">
                          Only {product.stock} left!
                        </p>
                      )}

                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full py-2 rounded-lg font-bold transition-all ${
                          product.stock === 0
                            ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        🛒 Add to Cart
                      </button>
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
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">🛒 Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="lg:hidden text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-2">🛍️</div>
                  <p className="text-slate-400 text-sm">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-700/30 rounded-lg p-3 border border-slate-600"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold text-white text-sm line-clamp-1">
                            {item.name}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400 hover:text-red-500 font-bold text-sm"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">
                          {item.currency} {parseFloat(String(item.price)).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-1 bg-slate-800/50 rounded p-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-slate-300 hover:bg-slate-700 rounded text-xs"
                          >
                            −
                          </button>
                          <span className="px-2 py-1 text-white flex-1 text-center text-xs font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-slate-300 hover:bg-slate-700 rounded text-xs"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-600 pt-4 space-y-2">
                    <div className="flex justify-between text-slate-400 text-sm">
                      <span>Total</span>
                      <span className="font-bold text-white">
                        {cart[0]?.currency} {cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <button className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:shadow-lg transition-all">
                      Checkout
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
