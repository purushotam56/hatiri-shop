"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Spinner } from "@heroui/spinner";
import { Tabs, Tab } from "@heroui/tabs";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useSellerStore } from "@/context/seller-store-context";
import { apiEndpoints } from "@/lib/api-client";
import { Product } from "@/types";

export default function SellerProductsPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id;
  const { selectedStore, clearStore } = useSellerStore();

  const [productGroups, setProductGroups] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 10,
    currentPage: 1,
    lastPage: 1,
  });
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"single" | "variants">("single");

  useEffect(() => {
    const token = localStorage.getItem("sellerToken");

    if (!token) {
      router.push("/seller");

      return;
    }

    // Verify store match
    if (
      !selectedStore ||
      (selectedStore?.id !== Number(orgId) && selectedStore?.id !== orgId)
    ) {
      router.push("/seller/select-store");

      return;
    }

    const fetchProductGroups = async () => {
      setLoading(true);
      try {
        // Fetch products from /products API with organisation filter
        const type =
          activeTab === "single"
            ? "single"
            : activeTab === "variants"
              ? "variant"
              : undefined;
        const queryString = `page=${page}&limit=${limit}${search ? `&search=${search}` : ""}`;
        const response = await apiEndpoints.getProductsByOrg(
          String(orgId),
          queryString,
          type,
        );
        // Parse response: { data: { meta: {...}, data: [...] } }
        const responseData = response.data || response;
        const products = responseData.data || [];
        const meta = responseData.meta || {};

        setProductGroups(products);
        setPagination({
          total: meta.total || 0,
          perPage: meta.per_page || limit,
          currentPage: meta.current_page || page,
          lastPage: meta.last_page || 1,
        });
      } catch (err) {
        setError("Failed to load products");
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductGroups();
  }, [router, orgId, selectedStore, page, limit, search, activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerUser");
    clearStore();
    router.push("/seller");
  };

  const totalVariants = productGroups.reduce(
    (sum, g) => sum + (g?.variants?.length || 0),
    0,
  );

  // Products are already filtered by backend based on activeTab
  const displayedProducts = productGroups;

  // Calculate counts for tabs
  const singleProductsCount =
    pagination.total && activeTab === "single" ? pagination.total : undefined;
  const variantProductsCount =
    pagination.total && activeTab === "variants" ? pagination.total : undefined;

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-default-100 border-b border-default-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Products</h1>
              <p className="text-sm text-foreground font-medium">
                {activeTab === "single"
                  ? `${pagination.total} single products`
                  : `${pagination.total} variant groups (${totalVariants} total variants)`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="px-3 py-2 rounded-lg border border-default-300 text-sm"
              placeholder="Search products..."
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
            <Link href={`/seller/${orgId}/products/create`}>
              <Button color="primary" size="sm">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M12 4v16m8-8H4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
                New Product
              </Button>
            </Link>
            <Button
              isIconOnly
              color="default"
              variant="light"
              onPress={handleLogout}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner label="Loading products..." />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-200">
            <CardBody>
              <p className="text-red-600 dark:text-red-400 text-center">
                {error}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Tabs for Single and Variants */}
            <div className="border-b border-default-200 bg-white dark:bg-default-50">
              <Tabs
                aria-label="Product types"
                classNames={{
                  tabList:
                    "gap-6 w-full relative rounded-none p-0 border-b-0 rounded-[2px]",
                  cursor: "w-full bg-primary",
                  tab: "max-w-fit px-0 h-12 rounded-[2px]",
                  tabContent:
                    "p-2 group-data-[selected=true]:text-white text-foreground text-base font-medium",
                }}
                selectedKey={activeTab}
                onSelectionChange={(key) => {
                  setActiveTab(key as "single" | "variants");
                  setPage(1);
                }}
              >
                <Tab
                  key="single"
                  title={
                    <div className="flex items-center gap-3">
                      <span>Single Products</span>
                      <Chip
                        color={activeTab === "single" ? "primary" : "default"}
                        size="sm"
                        variant={activeTab === "single" ? "solid" : "flat"}
                      >
                        {pagination.total}
                      </Chip>
                    </div>
                  }
                />
                <Tab
                  key="variants"
                  title={
                    <div className="flex items-center gap-3">
                      <span>Variant Products</span>
                      <Chip
                        color={activeTab === "variants" ? "primary" : "default"}
                        size="sm"
                        variant={activeTab === "variants" ? "solid" : "flat"}
                      >
                        {pagination.total}
                      </Chip>
                    </div>
                  }
                />
              </Tabs>
            </div>

            {/* Empty State for Selected Tab */}
            {displayedProducts.length === 0 ? (
              <Card>
                <CardBody className="py-12 text-center space-y-4">
                  <div>
                    <svg
                      className="w-16 h-16 mx-auto text-default-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M20 7l-8-4-8 4m0 0l8 4m-8-4v10l8 4m0-10l8 4m-8-4v10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    <p className="text-default-600 text-lg">
                      No {activeTab === "single" ? "single" : "variant"}{" "}
                      products yet
                    </p>
                    <p className="text-default-500 text-sm">
                      Create {activeTab === "single" ? "a single" : "variant"}{" "}
                      product to get started
                    </p>
                  </div>
                  <Link href={`/seller/${orgId}/products/create`}>
                    <Button color="primary" size="lg">
                      Create {activeTab === "single" ? "Single" : "Variant"}{" "}
                      Product
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            ) : (
              <>
                {/* Pagination Info */}
                <div className="text-sm text-default-600 text-right">
                  Showing {(page - 1) * limit + 1}-
                  {Math.min(page * limit, pagination.total)} of{" "}
                  {pagination.total}
                </div>
                <Accordion selectionMode="multiple" variant="splitted">
                  {displayedProducts.map((group) => (
                    <AccordionItem
                      key={group.productGroupId}
                      aria-label={group.name}
                      indicator={<span>▼</span>}
                      startContent={
                        group.bannerImage ? (
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              fill
                              alt={group.name}
                              className="object-cover"
                              src={group.bannerImage.url}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 bg-default-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">📦</span>
                          </div>
                        )
                      }
                      subtitle={
                        activeTab === "variants" && (
                          <div className="flex items-center gap-2 mt-1">
                            {group.productGroup?.stockMergeType ===
                              "merged" && (
                              <>
                                <Chip
                                  color="secondary"
                                  size="sm"
                                  variant="flat"
                                >
                                  {group.stock || 0} {group.stockUnit}
                                </Chip>
                                <Chip
                                  className="text-xs"
                                  color="warning"
                                  size="sm"
                                  variant="flat"
                                >
                                  Merged Stock
                                </Chip>
                              </>
                            )}
                            {group.productGroup?.stockMergeType ===
                              "independent" && (
                              <Chip
                                className="text-xs"
                                color="success"
                                size="sm"
                                variant="flat"
                              >
                                Independent Stock
                              </Chip>
                            )}
                          </div>
                        )
                      }
                      title={
                        <div className="flex items-center justify-between gap-3 w-full pr-4">
                          <div className="flex flex-col flex-1">
                            <p className="font-semibold">{group.name}</p>
                            {group.category && (
                              <p className="text-xs text-default-500">
                                {group.category.name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {activeTab === "variants" && (
                              <Chip color="default" size="sm" variant="flat">
                                {group.variants?.length} variant
                                {group.variants?.length !== 1 ? "s" : ""}
                              </Chip>
                            )}
                            <div className="text-sm font-medium text-default-600">
                              ₹{group.price?.toLocaleString("en-IN")}
                            </div>
                            <div
                              className="flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg cursor-pointer transition-colors"
                                title="Edit"
                                onClick={() =>
                                  router.push(
                                    `/seller/${orgId}/products/${group.variants?.[0]?.id || group.productGroupId}/edit`,
                                  )
                                }
                              >
                                <svg
                                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                  />
                                </svg>
                              </button>
                              <button
                                type="button"
                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg cursor-pointer transition-colors"
                                title="Delete"
                                onClick={() => {
                                  // Add delete logic here
                                }}
                              >
                                <svg
                                  className="w-4 h-4 text-red-600 dark:text-red-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      }
                    >
                      {activeTab === "variants" && (
                        <div className="px-2 pb-4">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-default-200">
                                  <th className="text-left p-2 font-semibold">
                                    Variant
                                  </th>
                                  <th className="text-left p-2 font-semibold">
                                    SKU
                                  </th>
                                  <th className="text-right p-2 font-semibold">
                                    Price
                                  </th>
                                  <th className="text-right p-2 font-semibold">
                                    Discount
                                  </th>
                                  <th className="text-right p-2 font-semibold">
                                    Stock
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.variants?.map((variant) => (
                                  <tr
                                    key={variant.id}
                                    className="border-b border-default-100 hover:bg-default-50"
                                  >
                                    <td className="p-2">{variant.name}</td>
                                    <td className="p-2 text-default-600 text-xs">
                                      {variant.sku}
                                    </td>
                                    <td className="p-2 text-right font-medium">
                                      ₹{variant.price?.toLocaleString("en-IN")}
                                    </td>
                                    <td className="p-2 text-right">
                                      {variant.isDiscountActive &&
                                      variant.discountPercentage ? (
                                        <Chip
                                          color="warning"
                                          size="sm"
                                          variant="flat"
                                        >
                                          {variant.discountType === "percentage"
                                            ? `${variant.discountPercentage}%`
                                            : `₹${variant.discountPercentage}`}{" "}
                                          off
                                        </Chip>
                                      ) : (
                                        <span className="text-default-400 text-xs">
                                          —
                                        </span>
                                      )}
                                    </td>
                                    <td className="p-2 text-right">
                                      <Chip
                                        color={
                                          variant.stock <= 10
                                            ? variant.stock === 0
                                              ? "danger"
                                              : "warning"
                                            : "success"
                                        }
                                        size="sm"
                                        variant="flat"
                                      >
                                        {variant.stock} {variant.stockUnit}
                                      </Chip>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </AccordionItem>
                  ))}
                </Accordion>
                {/* Pagination Controls */}
                {pagination.lastPage > 1 && (
                  <div className="flex items-center justify-center gap-2 py-6">
                    <Button
                      isIconOnly
                      color="default"
                      isDisabled={page === 1}
                      variant="light"
                      onPress={() => setPage(page - 1)}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M15 19l-7-7 7-7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </Button>
                    <div className="flex gap-1">
                      {Array.from(
                        { length: Math.min(5, pagination.lastPage) },
                        (_, i) => {
                          const lastPageNum = pagination.lastPage;
                          let pageNum: number;

                          if (lastPageNum <= 5) {
                            pageNum = i + 1;
                          } else if (page <= 3) {
                            pageNum = i + 1;
                          } else if (page >= lastPageNum - 2) {
                            pageNum = lastPageNum - 4 + i;
                          } else {
                            pageNum = page - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              color={page === pageNum ? "primary" : "default"}
                              size="sm"
                              variant={page === pageNum ? "solid" : "light"}
                              onPress={() => setPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        },
                      )}
                    </div>
                    <Button
                      isIconOnly
                      color="default"
                      isDisabled={page === pagination.lastPage}
                      variant="light"
                      onPress={() => setPage(page + 1)}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 5l7 7-7 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
