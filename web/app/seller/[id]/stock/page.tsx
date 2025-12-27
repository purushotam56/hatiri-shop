"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Spinner } from "@heroui/spinner";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useSellerStore } from "@/context/seller-store-context";
import { apiEndpoints } from "@/lib/api-client";

interface Variant {
  id: number;
  name: string;
  sku: string;
  stock: number;
  price: number;
  unit: string;
  sold: number;
  images?: string[];
}

interface ProductGroup {
  productGroupId: number;
  baseName: string;
  categoryName?: string;
  variants: Variant[];
  totalStock: number;
  totalSold: number;
  baseImages?: string[];
}

export default function StockManagementPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id;
  const { selectedStore } = useSellerStore();

  const [productGroups, setProductGroups] = useState<ProductGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [storeLoaded, setStoreLoaded] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [newStock, setNewStock] = useState("");
  const [updating, setUpdating] = useState(false);

  // Wait for store to load from localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Check auth and fetch product groups
  useEffect(() => {
    if (!storeLoaded) return;

    const token = localStorage.getItem("sellerToken");

    if (!token) {
      router.push("/seller");

      return;
    }

    if (
      !selectedStore ||
      (selectedStore?.id !== Number(orgId) && selectedStore?.id !== orgId)
    ) {
      router.push("/seller/select-store");

      return;
    }

    const fetchProductGroups = async () => {
      try {
        const token = localStorage.getItem("sellerToken");
        // Fetch all product groups with high limit (500)
        const data = await apiEndpoints.getSellerProductGroups(
          String(orgId),
          token || "",
          1,
          500,
        );

        setProductGroups(data.productGroups || []);
      } catch (err) {
        setError("Failed to load product groups");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductGroups();
  }, [orgId, router, selectedStore, storeLoaded]);

  const handleEditStock = (variant: Variant) => {
    setSelectedVariant(variant);
    setNewStock(variant.stock.toString());
    onOpen();
  };

  const handleUpdateStock = async () => {
    if (!selectedVariant || !newStock) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem("sellerToken");

      // Find the group containing this variant
      const groupWithVariant = productGroups.find((g) =>
        g.variants.some((v) => v.id === selectedVariant.id),
      );

      if (!groupWithVariant) throw new Error("Product group not found");

      // Update ALL variants in this group to have the same stock
      // (because they share group-level stock)
      const variantsToUpdate = groupWithVariant.variants.map((v) => ({
        id: v.id,
        stock: Number(newStock),
      }));

      // Update each variant
      await Promise.all(
        variantsToUpdate.map((v: Record<string, unknown>) => {
          const fd = new FormData();

          fd.append("stock", String(v.stock));

          return apiEndpoints.updateProduct(v.id as number, fd, token || "");
        }),
      );

      // Update local state - apply new stock to all variants in group
      setProductGroups(
        productGroups.map((group: ProductGroup) =>
          group.productGroupId === groupWithVariant.productGroupId
            ? {
                ...group,
                variants: group.variants.map((v) => ({
                  ...v,
                  stock: Number(newStock),
                })),
                totalStock: group.variants.length * Number(newStock),
              }
            : group,
        ),
      );

      onOpenChange();
    } catch (err) {
      console.error("Failed to update stock:", err);
      alert("Failed to update stock");
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: "danger", label: "Out of Stock" };
    if (stock <= 10) return { color: "warning", label: "Low Stock" };

    return { color: "success", label: "In Stock" };
  };

  const totalProducts = productGroups.reduce(
    (sum, g) => sum + g.variants.length,
    0,
  );

  return (
    <main className="min-h-screen bg-default-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-96">
            <Spinner label="Loading product groups..." />
          </div>
        ) : error ? (
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardBody className="text-red-600 dark:text-red-400">
              {error}
            </CardBody>
          </Card>
        ) : productGroups.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12 text-default-600">
              No products found. Create your first product with variants!
            </CardBody>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader className="flex gap-3">
                <div className="flex flex-col">
                  <p className="text-lg font-semibold">
                    Stock Management ({productGroups.length} products,{" "}
                    {totalProducts} variants)
                  </p>
                  <p className="text-sm text-default-500">
                    Manage product inventory grouped by variants
                  </p>
                </div>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              <Accordion selectionMode="multiple" variant="splitted">
                {productGroups.map((group) => {
                  const groupStockStatus = getStockStatus(group.totalStock);
                  const hasLowStock = group.variants.some(
                    (v) => v.stock <= 10 && v.stock > 0,
                  );
                  const hasOutOfStock = group.variants.some(
                    (v) => v.stock === 0,
                  );

                  return (
                    <AccordionItem
                      key={group.productGroupId}
                      aria-label={group.baseName}
                      indicator={<span>▼</span>}
                      startContent={
                        group.baseImages && group.baseImages.length > 0 ? (
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              fill
                              alt={group.baseName}
                              className="object-cover"
                              src={group.baseImages[0]}
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-default-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">📦</span>
                          </div>
                        )
                      }
                      subtitle={
                        <div className="flex items-center gap-3 mt-1">
                          <Chip
                            color={groupStockStatus.color as "success" | "warning" | "danger"}
                            size="sm"
                            variant="flat"
                          >
                            Stock: {group.totalStock}
                          </Chip>
                          <Chip color="success" size="sm" variant="flat">
                            Sold: {group.totalSold}
                          </Chip>
                          <span className="text-sm text-default-500">
                            {group.variants.length} variant
                            {group.variants.length !== 1 ? "s" : ""}
                          </span>
                          {hasOutOfStock && (
                            <Chip color="danger" size="sm" variant="flat">
                              Some out of stock
                            </Chip>
                          )}
                          {hasLowStock && !hasOutOfStock && (
                            <Chip color="warning" size="sm" variant="flat">
                              Low stock
                            </Chip>
                          )}
                        </div>
                      }
                      title={
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col">
                            <p className="font-semibold text-lg">
                              {group.baseName}
                            </p>
                            {group.categoryName && (
                              <p className="text-sm text-default-500">
                                {group.categoryName}
                              </p>
                            )}
                          </div>
                        </div>
                      }
                    >
                      <div className="px-2 pb-4">
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {group.variants.map((variant) => {
                            const variantStockStatus = getStockStatus(
                              variant.stock,
                            );

                            return (
                              <Card
                                key={variant.id}
                                className="border border-default-200"
                              >
                                <CardBody className="p-4">
                                  <div className="flex gap-3">
                                    {variant.images &&
                                    variant.images.length > 0 ? (
                                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                        <Image
                                          fill
                                          alt={variant.name}
                                          className="object-cover"
                                          src={variant.images[0]}
                                        />
                                      </div>
                                    ) : (
                                      <div className="w-20 h-20 bg-default-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-xl">📦</span>
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-sm truncate">
                                        {variant.name}
                                      </h4>
                                      <p className="text-xs text-default-500 mb-2">
                                        SKU: {variant.sku}
                                      </p>
                                      <div className="space-y-1">
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-default-600">
                                            Price:
                                          </span>
                                          <span className="text-sm font-semibold">
                                            {formatPrice(variant.price)}/
                                            {variant.unit}
                                          </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-default-600">
                                            Stock:
                                          </span>
                                          <Chip
                                            className="text-xs"
                                            color={
                                              variantStockStatus.color as "success" | "warning" | "danger"
                                            }
                                            size="sm"
                                            variant="flat"
                                          >
                                            {variant.stock}
                                          </Chip>
                                        </div>
                                        <div className="flex justify-between items-center">
                                          <span className="text-xs text-default-600">
                                            Sold:
                                          </span>
                                          <span className="text-sm font-semibold text-green-600">
                                            {variant.sold}
                                          </span>
                                        </div>
                                      </div>
                                      <Button
                                        className="w-full mt-3"
                                        color="primary"
                                        size="sm"
                                        variant="flat"
                                        onPress={() => handleEditStock(variant)}
                                      >
                                        Update Stock
                                      </Button>
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </>
        )}
      </div>

      {/* Stock Update Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Update Group Stock - {selectedVariant?.name}
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
                    <p className="text-sm text-primary-700 dark:text-primary-400 font-medium">
                      ℹ️ This will update stock for ALL variants in this group
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600 mb-1">
                      Current Stock
                    </p>
                    <p className="text-2xl font-bold">
                      {selectedVariant?.stock}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600 mb-1">SKU</p>
                    <p className="text-sm">{selectedVariant?.sku}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-600 mb-1">Price</p>
                    <p className="text-sm">
                      {selectedVariant && formatPrice(selectedVariant.price)}/
                      {selectedVariant?.unit}
                    </p>
                  </div>
                  <Input
                    label="New Stock Quantity"
                    min="0"
                    placeholder="Enter new stock quantity"
                    type="number"
                    value={newStock}
                    onValueChange={setNewStock}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={!newStock || updating}
                  isLoading={updating}
                  onPress={handleUpdateStock}
                >
                  Update Stock
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </main>
  );
}
