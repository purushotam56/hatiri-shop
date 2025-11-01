"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
  category?: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  currency: string;
}

const CATEGORIES = [
  { id: 1, name: "All", emoji: "🏪" },
  { id: 2, name: "Milk", emoji: "🥛" },
  { id: 3, name: "Snacks", emoji: "🍿" },
  { id: 4, name: "Vegetables", emoji: "🥬" },
  { id: 5, name: "Fruits", emoji: "🍎" },
  { id: 6, name: "Beverages", emoji: "🥤" },
  { id: 7, name: "Dairy", emoji: "🧀" },
  { id: 8, name: "Bakery", emoji: "🍞" },
];

export default function StorePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const storeCode = params.code as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Fetch organisation and products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const allOrgsRes = await fetch(
          "http://localhost:3333/api/organisations"
        );
        const allOrgsData = await allOrgsRes.json();
        const org = allOrgsData.organisations.find(
          (o: any) => o.organisationUniqueCode === storeCode
        );
        if (!org) throw new Error("Store not found");

        const prodRes = await fetch(
          `http://localhost:3333/api/products?organisationId=${org.id}`
        );
        const prodData = await prodRes.json();
        setProducts(prodData.data.data || []);
      } catch (error) {
        console.error("Failed to load store:", error);
      } finally {
        setLoading(false);
      }
    };

    if (storeCode) {
      fetchData();
    }
  }, [storeCode]);

  // Filter products based on category and search
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) =>
        p.category?.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          currency: product.currency,
        },
      ]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Logo & Store */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
              {storeCode.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">{storeCode}</h1>
              <p className="text-xs text-gray-600">⚡ 10 mins</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setShowCart(!showCart)}
            className="relative px-4 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            🛒
            {cartCount > 0 && (
              <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Category Scroll */}
        <div className="sticky top-16 z-30 bg-white border-b border-gray-200 px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 whitespace-nowrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.name)}
                className={`px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === cat.name
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                <span>{cat.emoji}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="px-4 py-6 flex gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-600">Loading products...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-gray-600 text-lg font-medium">
                  {searchQuery ? "No products found" : "No products in this category"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all border border-gray-200"
                  >
                    {/* Product Image */}
                    <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 h-32 flex items-center justify-center">
                      <div className="text-5xl">📦</div>
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">OUT OF STOCK</span>
                        </div>
                      )}
                      {product.stock < 5 && product.stock > 0 && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">
                          {product.stock} left
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-3">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">
                        {product.name}
                      </h3>

                      {product.unit && (
                        <p className="text-xs text-gray-600 mb-2">{product.unit}</p>
                      )}

                      {/* Price */}
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="text-lg font-bold text-gray-900">
                          {product.currency} {parseFloat(String(product.price)).toFixed(0)}
                        </span>
                        {product.sku && (
                          <span className="text-xs text-gray-500">{product.sku}</span>
                        )}
                      </div>

                      {/* Add Button */}
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className={`w-full py-2 rounded-lg font-bold text-sm transition-all ${
                          product.stock === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {product.stock === 0 ? "Out of Stock" : "Add"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          {showCart && (
            <div className="w-80 bg-white rounded-lg shadow-lg p-4 h-fit max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-3xl mb-2">🛍️</div>
                  <p className="text-gray-600 font-medium">Your cart is empty</p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">
                              {item.name}
                            </p>
                            <p className="text-xs text-gray-600">
                              {item.currency} {parseFloat(String(item.price)).toFixed(0)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-sm"
                          >
                            ✕
                          </button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm font-bold"
                          >
                            −
                          </button>
                          <span className="px-2 py-1 text-gray-900 flex-1 text-center font-bold text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-200 rounded text-sm font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Cart Total */}
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between mb-3">
                      <span className="text-gray-600">Total:</span>
                      <span className="text-xl font-bold text-gray-900">
                        {cart[0]?.currency} {cartTotal.toFixed(0)}
                      </span>
                    </div>

                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-all">
                      Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
