"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";

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
  imageUrl?: string | null;
  options?: string | any[];
  organisationId?: number;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  currency: string;
  sku?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addedMessage, setAddedMessage] = useState("");

  // Load cart from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Fetch product and variants
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch single product
        const productRes = await fetch(
          `http://localhost:3333/api/products/${productId}`
        );
        
        if (!productRes.ok) {
          console.error("Product fetch failed:", productRes.status);
          setLoading(false);
          return;
        }
        
        const productData = await productRes.json();
        // Handle both response formats: {data: {...}} and {product: {...}}
        const mainProduct = productData.product || productData.data;
        
        if (!mainProduct) {
          console.error("No product data returned");
          setLoading(false);
          return;
        }
        
        setProduct(mainProduct);
        setSelectedVariant(mainProduct);

        // Fetch all products to find variants (same base SKU)
        if (mainProduct.sku) {
          const skuParts = mainProduct.sku.split("-");
          const baseSku = skuParts.slice(0, -1).join("-");

          const allProductsRes = await fetch(
            "http://localhost:3333/api/products"
          );
          const allProductsData = await allProductsRes.json();
          const variantProducts = (allProductsData.data?.data || allProductsData.products || []).filter(
            (p: Product) =>
              p.sku?.startsWith(baseSku) &&
              p.organisationId === mainProduct.organisationId
          );
          setVariants(variantProducts);
        }
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId]);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (variantToAdd: Product) => {
    const existing = cart.find(
      (item) => item.id === variantToAdd.id
    );
    
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === variantToAdd.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          id: variantToAdd.id,
          name: variantToAdd.name,
          price: variantToAdd.price,
          quantity: quantity,
          currency: variantToAdd.currency,
          sku: variantToAdd.sku,
        },
      ]);
    }

    setAddedMessage(`✓ Added to cart!`);
    setTimeout(() => {
      setAddedMessage("");
      setQuantity(1);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-slate-600 font-semibold">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-slate-600 text-xl font-semibold">Product not found</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-2"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-slate-900 flex-1 text-center">
            Product Details
          </h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center h-96 shadow-md">
            <div className="text-9xl">📦</div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                {product.name}
              </h1>
              <p className="text-slate-600 text-lg">{product.description}</p>
            </div>

            {/* Price */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <p className="text-slate-600 font-medium mb-2">Price</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                ₹{parseFloat(String(product.price)).toFixed(0)}
              </p>
              {product.sku && (
                <p className="text-xs text-slate-500 mt-2 font-mono">SKU: {product.sku}</p>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3">
              <div
                className={`w-4 h-4 rounded-full ${
                  product.stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <p className={`font-semibold ${product.stock > 0 ? "text-green-700" : "text-red-700"}`}>
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of Stock"}
              </p>
            </div>

            {/* Variants Info */}
            {variants.length > 1 && (
              <div className="bg-slate-100 rounded-lg p-4">
                <p className="text-sm text-slate-600 font-medium mb-2">
                  Available Options
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {variants.length} variants
                </p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-slate-700 font-medium">Quantity:</span>
              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-slate-600 hover:bg-white rounded transition-colors font-bold"
                >
                  −
                </button>
                <span className="px-6 py-2 text-slate-900 font-bold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="px-4 py-2 text-slate-600 hover:bg-white rounded transition-colors font-bold disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => handleAddToCart(selectedVariant || product)}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg ${
                product.stock === 0
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 active:scale-95"
              }`}
            >
              {product.stock === 0 ? "Out of Stock" : "Add"}
            </button>

            {addedMessage && (
              <div className="bg-green-100 border-2 border-green-400 text-green-700 p-4 rounded-lg font-semibold text-center">
                {addedMessage}
              </div>
            )}

            {/* Variant Slider Section */}
            {variants.length > 1 && (
              <div className="mt-8 p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Select Variant:</h3>
                <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`flex-shrink-0 px-4 py-3 rounded-xl border-2 transition-all text-center whitespace-nowrap min-w-fit ${
                        selectedVariant?.id === variant.id
                          ? "border-blue-600 bg-blue-600 text-white shadow-lg"
                          : "border-slate-300 bg-white text-slate-900 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      <div className="font-bold text-sm">{variant.name}</div>
                      <div className="text-xs opacity-80 mt-1">₹{parseFloat(String(variant.price)).toFixed(0)}</div>
                      <div className="text-xs opacity-60 mt-1">{variant.stock > 0 ? `${variant.stock} left` : "Out"}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
