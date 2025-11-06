"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { apiEndpoints } from "@/lib/api-client"

export default function ProductEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    currency: "USD",
    stock: 0,
    unit: "pcs",
  })
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    setToken(storedToken)

    if (!id) return
    ;(async () => {
      setLoading(true)
      try {
        const productId = Array.isArray(id) ? id[0] : id;
        const body = await apiEndpoints.getProduct(productId);
        const p = body.product || body.data || body
        setFormData({
          name: p.name || "",
          description: p.description || "",
          sku: p.sku || "",
          price: p.price ? String(p.price) : "",
          currency: p.currency || "USD",
          stock: p.stock || 0,
          unit: p.unit || "pcs",
        })
      } catch (err: any) {
        setError(err?.message || "Failed to load product")
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" ? Number(value) : name === "price" ? parseFloat(value) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!id) return
    setLoading(true)
    setError(null)
    try {
      const productId = Array.isArray(id) ? id[0] : id;
      await apiEndpoints.updateProduct(productId, formData, token || "");
      router.push("/products")
    } catch (err: any) {
      setError(err?.message || "Update failed")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="p-6 max-w-2xl mx-auto">
        <div className="text-center py-8">Loading product…</div>
      </section>
    )
  }

  return (
    <section className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Product</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-2">Product Name *</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-2">SKU</span>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
          </label>
        </div>

        <label className="flex flex-col">
          <span className="text-sm font-semibold mb-2">Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border rounded px-3 py-2 min-h-24"
            rows={4}
          />
        </label>

        <div className="grid grid-cols-3 gap-4">
          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-2">Price *</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              className="border rounded px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col">
            <span className="text-sm font-semibold mb-2">Currency</span>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="border rounded px-3 py-2"
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
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              min="0"
              className="border rounded px-3 py-2"
            />
          </label>
        </div>

        <label className="flex flex-col">
          <span className="text-sm font-semibold mb-2">Unit</span>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="border rounded px-3 py-2"
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
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 py-2"
          >
            {loading ? "Saving…" : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/products")}
            disabled={loading}
            className="btn border flex-1 py-2"
          >
            Cancel
          </button>
        </div>
      </form>
    </section>
  )
}
