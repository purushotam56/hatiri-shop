"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProductCreatePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    currency: "USD",
    stock: 0,
    unit: "pcs",
    organisationId: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "stock" ? Number(value) : name === "price" ? parseFloat(value) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    
    if (!formData.name) {
      setError("Product name is required")
      return
    }
    
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("Not authenticated. Please login first.")
        router.push("/login")
        return
      }

      const res = await fetch("http://localhost:3333/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || `Failed to create product (${res.status})`)
      }

      const result = await res.json()
      console.log("Product created:", result)
      router.push("/products")
    } catch (err: any) {
      setError(err?.message || "Create failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Product</h1>
      
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
              placeholder="e.g., Fresh Apples"
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
              placeholder="e.g., APP-001"
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
            placeholder="Product details..."
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
              placeholder="0.00"
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
            {loading ? "Creating…" : "Create Product"}
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
