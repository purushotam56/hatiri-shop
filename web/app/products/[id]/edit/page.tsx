"use client";

import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { apiEndpoints } from "@/lib/api-client";

export default function ProductEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    currency: "USD",
    stock: 0,
    unit: "pcs",
  });
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    setToken(storedToken);

    if (!id) return;
    (async () => {
      setLoading(true);
      try {
        const productId = Array.isArray(id) ? id[0] : id;
        const body = await apiEndpoints.getProduct(productId);
        const p = body.product || body.data || body;

        setFormData({
          name: p.name || "",
          description: p.description || "",
          sku: p.sku || "",
          price: p.price ? String(p.price) : "",
          currency: p.currency || "USD",
          stock: p.stock || 0,
          unit: p.unit || "pcs",
        });
      } catch (err: unknown) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "stock"
          ? Number(value)
          : name === "price"
            ? parseFloat(value)
            : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const productId = Array.isArray(id) ? id[0] : id;
      const fd = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        fd.append(key, String(value));
      });
      await apiEndpoints.updateProduct(productId, fd, token || "");
      router.push("/products");
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="p-6 max-w-2xl mx-auto">
        <div className="text-center py-8">Loading product…</div>
      </section>
    );
  }

  return (
    <section className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      )}

      <form
        className="flex flex-col gap-4 bg-gray-50 p-6 rounded-lg"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-2">Product Name *</span>
            <input
              required
              className="border rounded px-3 py-2"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-2">SKU</span>
            <input
              className="border rounded px-3 py-2"
              name="sku"
              type="text"
              value={formData.sku}
              onChange={handleChange}
            />
          </label>
        </div>

        <label className="flex flex-col">
          <span className="text-sm font-semibold mb-2">Description</span>
          <textarea
            className="border rounded px-3 py-2 min-h-24"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />
        </label>

        <div className="grid grid-cols-3 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-2">Price *</span>
            <input
              required
              className="border rounded px-3 py-2"
              name="price"
              step="0.01"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-2">Currency</span>
            <select
              className="border rounded px-3 py-2"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
            >
              <option value="USD">USD</option>
              <option value="AUD">AUD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-2">Stock</span>
            <input
              className="border rounded px-3 py-2"
              min="0"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleChange}
            />
          </label>
        </div>

        <label className="flex flex-col">
          <span className="text-sm font-semibold mb-2">Unit</span>
          <select
            className="border rounded px-3 py-2"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="pcs">Pieces (pcs)</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="g">Gram (g)</option>
            <option value="liter">Liter (L)</option>
            <option value="ml">Milliliter (ml)</option>
            <option value="box">Box</option>
            <option value="pack">Pack</option>
          </select>
        </label>

        <div className="flex gap-2 pt-4">
          <button
            className="btn btn-primary flex-1 py-2"
            disabled={loading}
            type="submit"
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
          <button
            className="btn border flex-1 py-2"
            disabled={loading}
            type="button"
            onClick={() => router.push("/products")}
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
