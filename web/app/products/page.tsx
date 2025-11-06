"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { apiEndpoints } from "@/lib/api-client"

type Product = {
  id: number
  name: string
  price?: number
  currency?: string
  stock?: number
  description?: string
  sku?: string
  isActive?: boolean
}

export default function ProductsListPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  async function fetchProducts() {
    setLoading(true)
    setError(null)
    try {
      // Get token from localStorage
      const storedToken = localStorage.getItem("token")
      if (!storedToken) {
        setError("Not authenticated. Please login first.")
        router.push("/login")
        return
      }
      setToken(storedToken)

      const body = await apiEndpoints.getProducts();
      // Extract products from paginated response
      const productList = body.data?.data || body.data || body.products || []
      setProducts(productList)
    } catch (err: any) {
      setError(err?.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  async function handleDelete(id: number) {
    if (!confirm("Are you sure?")) return
    try {
      await apiEndpoints.deleteProduct(id, token || "");
      setProducts(products.filter((p) => p.id !== id))
    } catch (e) {
      alert("Error deleting product")
    }
  }

  return (
    <section className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/products/create" className="btn btn-primary">
          Create product
        </Link>
      </div>

      {loading && <div className="text-center py-8">Loading products…</div>}
      {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>}

      <div className="grid gap-4">
        {products.length === 0 && !loading ? (
          <div className="text-sm text-gray-500 text-center py-8">No products found.</div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="p-4 border rounded-lg flex items-center justify-between hover:shadow-md transition"
            >
              <div className="flex-1">
                <div className="font-semibold text-lg">{p.name}</div>
                {p.description && (
                  <div className="text-sm text-gray-600 mb-2">{p.description}</div>
                )}
                <div className="text-sm text-gray-500">
                  {p.sku && `SKU: ${p.sku} • `}
                  {p.price ? `${p.currency || "USD"} ${p.price}` : "—"} • Stock: {p.stock ?? 0}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Link href={`/products/${p.id}/edit`} className="btn btn-sm btn-secondary">
                  Edit
                </Link>
                <button
                  className="btn btn-sm btn-error"
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
