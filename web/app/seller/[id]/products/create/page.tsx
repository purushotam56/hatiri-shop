"use client";

import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Switch } from "@heroui/switch";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

import ImageUpload from "@/components/image-upload";
import MultipleImageUpload from "@/components/multiple-image-upload";
import RichTextEditor from "@/components/rich-text-editor";
import { apiEndpoints, apiUpload } from "@/lib/api-client";

interface VariantForm {
  id: string;
  label: string; // e.g., "500 gm", "1 kg", "2 kg"
  skuSuffix: string; // e.g., "-500GM", "-1KG"
  price: string;
  quantity: string; // e.g., "500" for 500 gm when group unit is kg
  unit: string; // e.g., "gm", "ml" when group is in "kg" or "liter"
  stock: string; // for independent inventory mode
  discountType: string; // 'percentage' or 'fixed_amount'
  discountValue: string; // discount percentage or fixed amount
  isDiscountActive: boolean;
  description: string; // for independent inventory mode
  useSameDescription: boolean; // use main product description
  details: string; // variant-specific detailed information
  useSameDetails: boolean; // use main product details
  bannerImage: File | null; // for independent inventory mode
  useSameBannerImage: boolean; // use main product banner
  images: File[]; // variant-specific images
  useSameImages: boolean; // use main product images
}

/**
 * Seller Product Creation Page
 *
 * SUPPORTS TWO APPROACHES:
 * 1. Complex UI (existing): Full featured form with images, multiple variants, independent stock
 * 2. Simplified API (new): Use apiEndpoints.createSellerProductV2() for quick product creation
 *
 * To use simplified API, pass useSimplifiedAPI=true to handleSubmit()
 * This is useful for sellers who want to create products programmatically or through a simpler interface.
 */
export default function SellerCreateProductPage() {
  const router = useRouter();
  const params = useParams();
  const orgId = params.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    stock: "",
    unit: "piece",
    categoryId: "",
    details: "",
    discountType: "percentage",
    discountValue: "",
    isDiscountActive: false,
    stockMergeType: "merged" as "merged" | "independent",
  });
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);

  // Variant management state
  const [hasVariants, setHasVariants] = useState(false);
  const [variants, setVariants] = useState<VariantForm[]>([
    {
      id: "1",
      label: "",
      skuSuffix: "",
      price: "",
      quantity: "",
      unit: "kg",
      stock: "",
      discountType: "percentage",
      discountValue: "",
      isDiscountActive: false,
      description: "",
      useSameDescription: true,
      details: "",
      useSameDetails: true,
      bannerImage: null,
      useSameBannerImage: true,
      images: [],
      useSameImages: true,
    },
    {
      id: "2",
      label: "",
      skuSuffix: "",
      price: "",
      quantity: "",
      unit: "kg",
      stock: "",
      discountType: "percentage",
      discountValue: "",
      isDiscountActive: false,
      description: "",
      useSameDescription: true,
      details: "",
      useSameDetails: true,
      bannerImage: null,
      useSameBannerImage: true,
      images: [],
      useSameImages: true,
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("sellerToken");

    if (!token) {
      router.push("/seller");

      return;
    }

    // Fetch categories for this organization
    const fetchCategories = async () => {
      try {
        const data = await apiEndpoints.getOrganisationCategories(
          orgId as string,
        );

        setCategories(data.data || []);
      } catch (err) {
        // console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, [router, orgId]);

  // Sync variant units with group unit when in merged mode
  useEffect(() => {
    if (form.stockMergeType === "merged") {
      // When switching to merged mode, sync all variant units to group unit
      setVariants(variants.map((v) => ({ ...v, unit: form.unit })));
    }
  }, [form.stockMergeType, form.unit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updated = { ...prev, [name]: value };

      // Auto-generate SKU from product name when name changes
      if (name === "name" && value) {
        updated.sku = generateSKUFromName(value);
      }

      return updated;
    });
    setError("");
  };

  const generateSKUFromName = (name: string): string => {
    // Take first 3 letters of product name, uppercase, add 4 random digits
    const prefix = name
      .substring(0, 3)
      .toUpperCase()
      .replace(/[^A-Z]/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    return `${prefix || "PRD"}-${randomNum}`;
  };

  // Generate variant SKU suffix from variant label
  const generateVariantSKUSuffix = (label: string, index: number): string => {
    if (!label) {
      // If no label, use index-based suffix
      return `-${index + 1}`;
    }

    // Extract meaningful text from label
    // Examples: "500gm" -> "-500GM", "1kg" -> "-1KG", "Red Small" -> "-RS"
    const cleanLabel = label.toUpperCase().trim();

    // Try to extract number + unit pattern first (e.g., "500gm" or "1 kg")
    const numberUnitMatch = cleanLabel.match(/([0-9.]+)\s*([A-Z]+)/);

    if (numberUnitMatch) {
      const number = numberUnitMatch[1];
      const unit = numberUnitMatch[2];

      return `-${number}${unit}`.replace(/\s+/g, "");
    }

    // If no number+unit pattern, use first letters of each word
    const words = cleanLabel.split(/\s+/);

    if (words.length > 0) {
      const suffix = words
        .map((w) => w[0])
        .join("")
        .substring(0, 3);

      return `-${suffix}`;
    }

    // Fallback
    return `-${index + 1}`;
  };

  const handleVariantChange = (
    id: string,
    field: keyof VariantForm,
    value: string | boolean | File | null,
  ) => {
    setVariants(
      variants.map((v) => {
        if (v.id === id) {
          const updated = { ...v, [field]: value };

          // Auto-generate SKU suffix when label changes
          if (field === "label" && typeof value === "string") {
            const variantIndex = variants.findIndex((x) => x.id === id);

            updated.skuSuffix = generateVariantSKUSuffix(value, variantIndex);
          }

          return updated;
        }

        return v;
      }),
    );
  };

  const addVariant = () => {
    const newId = (
      Math.max(...variants.map((v) => parseInt(v.id)), 0) + 1
    ).toString();
    const availableUnits = getAvailableVariantUnits(form.unit);
    const defaultUnit = availableUnits[0] || "piece";
    // Pre-fill SKU suffix with index-based default (will be auto-generated when label is added)
    const skuSuffix = `-${variants.length + 1}`;

    setVariants([
      ...variants,
      {
        id: newId,
        label: "",
        skuSuffix,
        price: "",
        quantity: "",
        unit: defaultUnit,
        stock: "",
        discountType: "percentage",
        discountValue: "",
        isDiscountActive: false,
        description: "",
        useSameDescription: true,
        details: "",
        useSameDetails: true,
        bannerImage: null,
        useSameBannerImage: true,
        images: [],
        useSameImages: true,
      },
    ]);
  };

  const removeVariant = (id: string) => {
    if (variants.length > 2) {
      setVariants(variants.filter((v) => v.id !== id));
    }
  };

  // Unit type mapping
  const unitTypeMap: {
    [key: string]: { label: string; units: { [key: string]: string } };
  } = {
    weight: {
      label: "Weight",
      units: {
        mg: "Milligram (mg)",
        gm: "Gram (gm)",
        kg: "Kilogram (kg)",
      },
    },
    volume: {
      label: "Volume",
      units: {
        ml: "Milliliter (ml)",
        liter: "Liter (L)",
      },
    },
    quantity: {
      label: "Quantity",
      units: {
        piece: "Piece",
        dozen: "Dozen",
      },
    },
  };

  const getUnitType = (unit: string): string => {
    for (const [type, data] of Object.entries(unitTypeMap)) {
      if (unit in data.units) return type;
    }

    return "quantity";
  };

  // Helper function to check if units are compatible
  const isCompatibleUnits = (
    groupUnit: string,
    variantUnits: string[],
  ): boolean => {
    const groupType = getUnitType(groupUnit);

    return variantUnits.every((u) => getUnitType(u) === groupType);
  };

  // Get available variant units based on group unit
  const getAvailableVariantUnits = (groupUnit: string): string[] => {
    const groupType = getUnitType(groupUnit);

    return Object.keys(unitTypeMap[groupType].units);
  };

  const handleSubmit = async (
    e: React.FormEvent,
    useSimplifiedAPI: boolean = false,
  ) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("sellerToken");

      if (!token) {
        router.push("/seller");

        return;
      }

      // NEW: Option to use simplified API for variant products
      if (hasVariants && useSimplifiedAPI) {
        // Validate minimum 2 variants
        if (variants.length < 2) {
          setError("At least 2 variants are required");
          setLoading(false);

          return;
        }

        // Validate variants
        const invalidVariant = variants.find(
          (v) => !v.label || !v.skuSuffix || !v.price || !v.quantity || !v.unit,
        );

        if (invalidVariant) {
          setError(
            "Please fill in all variant fields (label, SKU, price, quantity, and unit)",
          );
          setLoading(false);

          return;
        }

        // Use simplified API
        const variantsArray = variants.map((variant, _idx) => ({
          sku: `${form.sku}${variant.skuSuffix}`,
          name: `${form.name} - ${variant.label}`,
          unit: variant.unit,
          price: parseFloat(variant.price),
          stock:
            form.stockMergeType === "independent" ? parseInt(variant.stock) : 0,
        }));

        const payload = {
          organisationId: parseInt(orgId as string),
          name: form.name,
          description: form.description,
          categoryId: parseInt(form.categoryId),
          currency: "INR",
          isVariant: true,
          stockMergeType: form.stockMergeType,
          variants: variantsArray,
          details: form.details,
        };

        const data = await apiEndpoints.createSellerProductV2(payload, token);

        if (data.error || !data.data) {
          setError(data.message || "Failed to create product");
          setLoading(false);

          return;
        }

        router.push(`/seller/${orgId}/products`);

        return;
      }

      // If creating with variants, use the existing complex API endpoint
      if (hasVariants) {
        // Validate minimum 2 variants
        if (variants.length < 2) {
          setError("At least 2 variants are required");

          return;
        }

        // Validate variants
        const invalidVariant = variants.find(
          (v) => !v.label || !v.skuSuffix || !v.price || !v.quantity || !v.unit,
        );

        if (invalidVariant) {
          setError(
            "Please fill in all variant fields (label, SKU, price, quantity, and unit)",
          );

          return;
        }

        // Validate stock based on merge type
        if (form.stockMergeType === "merged") {
          if (!form.stock) {
            setError("Group stock is required for merged inventory mode");

            return;
          }
        } else {
          // Independent mode - check that all variants have stock
          const variantWithoutStock = variants.find((v) => !v.stock);

          if (variantWithoutStock) {
            setError(
              "Each variant must have stock defined for independent inventory mode",
            );

            return;
          }
        }

        // Validate that all variants have compatible units
        const variantUnits = variants.map((v) => v.unit);

        if (!isCompatibleUnits(form.unit, variantUnits)) {
          setError("All variant units must be compatible with the group unit");

          return;
        }

        // Use FormData to handle file uploads
        const formData = new FormData();

        // Add base product data
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("sku", form.sku);
        formData.append("categoryId", form.categoryId);
        formData.append("organisationId", orgId as string);
        formData.append("details", form.details);
        formData.append("productGroupBaseStock", form.stock);
        formData.append("productGroupUnit", form.unit);
        formData.append("productGroupStockMergeType", form.stockMergeType);
        formData.append("isVariant", "true");

        // Add banner image if present
        if (bannerImage) {
          formData.append("bannerImage", bannerImage);
        }

        // Add shared product images
        productImages.forEach((image) => {
          formData.append("productImages", image);
        });

        // Add variants and their images
        variants.forEach((variant, index) => {
          formData.append(`variants[${index}][label]`, variant.label);
          formData.append(`variants[${index}][skuSuffix]`, variant.skuSuffix);
          formData.append(`variants[${index}][price]`, variant.price);
          formData.append(`variants[${index}][quantity]`, variant.quantity);
          formData.append(`variants[${index}][unit]`, variant.unit);

          // Add stock for independent mode
          if (form.stockMergeType === "independent" && variant.stock) {
            formData.append(`variants[${index}][stock]`, variant.stock);
          }

          // Add variant-specific assets for independent mode
          if (form.stockMergeType === "independent") {
            // Variant 1 (index 0) is the main product - its assets ARE the main assets
            // For Variant 1: always send useSame* = false (because it IS the main)
            // For other variants: send the actual useSame* value from state
            const useSameDescriptionValue =
              index === 0 ? false : variant.useSameDescription;
            const useSameDetailsValue =
              index === 0 ? false : variant.useSameDetails;
            const useSameBannerImageValue =
              index === 0 ? false : variant.useSameBannerImage;
            const useSameImagesValue =
              index === 0 ? false : variant.useSameImages;

            // Description
            if (!useSameDescriptionValue && variant.description) {
              formData.append(
                `variants[${index}][description]`,
                variant.description,
              );
            }
            formData.append(
              `variants[${index}][useSameDescription]`,
              String(useSameDescriptionValue),
            );

            // Details
            if (!useSameDetailsValue && variant.details) {
              formData.append(`variants[${index}][details]`, variant.details);
            }
            formData.append(
              `variants[${index}][useSameDetails]`,
              String(useSameDetailsValue),
            );

            // Banner image
            if (!useSameBannerImageValue && variant.bannerImage) {
              formData.append(
                `variants[${index}][bannerImage]`,
                variant.bannerImage,
              );
            }
            formData.append(
              `variants[${index}][useSameBannerImage]`,
              String(useSameBannerImageValue),
            );

            // Images
            if (!useSameImagesValue) {
              variant.images.forEach((image) => {
                formData.append(`variants[${index}][images]`, image);
              });
            }
            formData.append(
              `variants[${index}][useSameImages]`,
              String(useSameImagesValue),
            );
          } else {
            // Merged mode - only add variant images
            variant.images.forEach((image) => {
              formData.append(`variants[${index}][images]`, image);
            });
          }

          // Add discount fields if active
          if (variant.isDiscountActive && variant.discountValue) {
            formData.append(`variants[${index}][isDiscountActive]`, "true");
            formData.append(
              `variants[${index}][discountType]`,
              variant.discountType,
            );
            formData.append(
              `variants[${index}][discountValue]`,
              variant.discountValue,
            );
          }
        });

        const data = await apiUpload("/products", formData, token);

        if (data.error) {
          setError(data.message || "Failed to create product with variants");

          return;
        }

        // router.push(`/seller/${orgId}/products`)
      } else {
        // Single product creation with image upload
        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("sku", form.sku);
        formData.append("price", form.price);
        formData.append("productGroupBaseStock", form.stock);
        formData.append("productGroupUnit", form.unit);
        formData.append("categoryId", form.categoryId);
        formData.append("organisationId", orgId as string);
        formData.append("details", form.details);
        formData.append("isVariant", "false");

        // Add discount fields if discount is active
        if (form.isDiscountActive && form.discountValue) {
          formData.append("isDiscountActive", "true");
          formData.append("discountType", form.discountType);
          formData.append("discountValue", form.discountValue);
        }

        if (bannerImage) {
          formData.append("bannerImage", bannerImage);
        }

        productImages.forEach((image, _index) => {
          formData.append(`productImages`, image);
        });

        const data = await apiUpload("/products", formData, token);

        if (data.error) {
          setError(data.message || "Failed to create product");

          return;
        }

        router.push(`/seller/${orgId}/products`);
      }
    } catch (err) {
      setError("Connection error");
      // console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sellerToken");
    localStorage.removeItem("sellerUser");
    localStorage.removeItem("sellerOrg");
    router.push("/seller");
  };

  return (
    <main className="min-h-screen bg-default-50 pb-20" role="main">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-default-100 border-b border-default-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/seller/${orgId}/products`}>
              <Button isIconOnly size="sm" variant="light">
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
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                New Product
              </h1>
            </div>
          </div>
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

      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-6 pb-32">
        {error && (
          <div className="mb-6 p-4 bg-danger-50 dark:bg-danger-950/20 border border-danger-200 dark:border-danger-800 rounded-lg text-danger-600">
            {error}
          </div>
        )}

        <form
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          id="product-form"
          onSubmit={(e) => handleSubmit(e, false)}
        >
          {/* Basic Information Section - Always visible */}
          <div className="lg:col-span-full">
            {/* Product Type Selection */}
            <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 border-2 border-primary-200 dark:border-primary-800">
              <CardBody className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary-700 dark:text-primary-400 text-base">
                      ✨ Does this product have variants?
                    </p>
                    <p className="text-sm text-primary-600 dark:text-primary-500 mt-1">
                      Different sizes (1kg, 2kg), colors, or options
                    </p>
                  </div>
                  <Switch
                    color="primary"
                    disabled={loading}
                    isSelected={hasVariants}
                    size="lg"
                    onValueChange={setHasVariants}
                  />
                </div>
              </CardBody>
            </Card>
          </div>

          {!hasVariants ? (
            <>
              {/* SINGLE PRODUCT SECTION */}
              {/* Left Column - Form Fields (2 columns) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information Section */}
                <Card className="border border-default-200">
                  <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/10 dark:to-secondary-950/10 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📝</span>
                      <h2 className="text-lg font-semibold text-foreground">
                        Basic Information
                      </h2>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <Input
                      required
                      disabled={loading}
                      label="Product Name"
                      name="name"
                      placeholder="e.g., Fresh Tomatoes"
                      size="lg"
                      value={form.name}
                      onChange={handleChange}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Short Description
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground min-h-16 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        disabled={loading}
                        name="description"
                        placeholder="Brief 1-2 line description shown on product cards"
                        value={form.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label
                        className="text-sm font-medium text-foreground block mb-2"
                        htmlFor="category-select-single"
                      >
                        Category
                      </label>
                      <select
                        id="category-select-single"
                        required
                        className="w-full px-4 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        disabled={loading}
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardBody>
                </Card>

                {/* Single Product - Pricing & Inventory */}
                <Card className="border border-default-200">
                  <CardHeader className="bg-gradient-to-r from-success-50 to-emerald-50 dark:from-success-950/10 dark:to-emerald-950/10 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💰</span>
                      <h2 className="text-lg font-semibold text-foreground">
                        Pricing & Inventory
                      </h2>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    {/* SKU */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        SKU (Auto-generated from product name)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          required
                          className="flex-1"
                          description={
                            form.name
                              ? "Auto-generated from product name. Edit if needed."
                              : "Product name is required to generate SKU"
                          }
                          disabled={loading}
                          name="sku"
                          placeholder="Enter product name to auto-generate SKU"
                          value={form.sku}
                          onChange={handleChange}
                        />
                        <Button
                          isIconOnly
                          color="default"
                          disabled={loading || !form.name}
                          size="lg"
                          title="Regenerate SKU"
                          variant="flat"
                          onClick={() =>
                            setForm((prev) => ({
                              ...prev,
                              sku: generateSKUFromName(form.name || "PRD"),
                            }))
                          }
                        >
                          🔄
                        </Button>
                      </div>
                      {form.sku && (
                        <p className="text-xs text-default-500">
                          Unique identifier:{" "}
                          <span className="font-mono font-semibold">
                            {form.sku}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Price & Stock Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        required
                        disabled={loading}
                        label="Price (₹)"
                        name="price"
                        placeholder="0.00"
                        size="lg"
                        step="0.01"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                      />
                      <Input
                        required
                        disabled={loading}
                        label="Stock Quantity"
                        name="stock"
                        placeholder="0"
                        size="lg"
                        type="number"
                        value={form.stock}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Unit Selection */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="text-sm font-medium text-foreground block mb-2"
                          htmlFor="unit-type-single"
                        >
                          Unit Type
                        </label>
                        <select
                          id="unit-type-single"
                          className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                          disabled={loading}
                          value={getUnitType(form.unit)}
                          onChange={(e) => {
                            const unitType = e.target
                              .value as keyof typeof unitTypeMap;
                            const firstUnit = Object.keys(
                              unitTypeMap[unitType].units,
                            )[0];

                            setForm((prev) => ({ ...prev, unit: firstUnit }));
                          }}
                        >
                          {Object.entries(unitTypeMap).map(([key, data]) => (
                            <option key={key} value={key}>
                              {data.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label
                          className="text-sm font-medium text-foreground block mb-2"
                          htmlFor="unit-select-single"
                        >
                          Unit
                        </label>
                        <select
                          id="unit-select-single"
                          className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                          disabled={loading}
                          name="unit"
                          value={form.unit}
                          onChange={handleChange}
                        >
                          {Object.entries(
                            unitTypeMap[getUnitType(form.unit)].units,
                          ).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Discount Section */}
                <Card className="border border-default-200">
                  <CardHeader className="bg-gradient-to-r from-warning-50 to-amber-50 dark:from-warning-950/10 dark:to-amber-950/10 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏷️</span>
                      <h2 className="text-lg font-semibold text-foreground">
                        Discount (Optional)
                      </h2>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        color="warning"
                        disabled={loading}
                        isSelected={form.isDiscountActive}
                        onValueChange={(checked) =>
                          setForm((prev) => ({
                            ...prev,
                            isDiscountActive: checked,
                          }))
                        }
                      />
                      <label className="text-sm font-medium text-foreground">
                        Apply Discount
                      </label>
                    </div>

                    {form.isDiscountActive && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label
                              className="text-sm font-medium text-foreground block mb-2"
                              htmlFor="discount-type-single"
                            >
                              Discount Type
                            </label>
                            <select
                              id="discount-type-single"
                              className="w-full px-3 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                              disabled={loading}
                              name="discountType"
                              value={form.discountType}
                              onChange={handleChange}
                            >
                              <option value="percentage">Percentage (%)</option>
                              <option value="fixed_amount">
                                Fixed Amount (₹)
                              </option>
                            </select>
                          </div>
                          <Input
                            disabled={loading}
                            label={
                              form.discountType === "percentage"
                                ? "Discount (%)"
                                : "Discount (₹)"
                            }
                            max={
                              form.discountType === "percentage"
                                ? "100"
                                : undefined
                            }
                            name="discountValue"
                            placeholder={
                              form.discountType === "percentage"
                                ? "0-100"
                                : "0.00"
                            }
                            step={
                              form.discountType === "percentage" ? "1" : "0.01"
                            }
                            type="number"
                            value={form.discountValue}
                            onChange={handleChange}
                          />
                        </div>
                        {form.price && form.discountValue && (
                          <div className="p-4 bg-gradient-to-r from-warning-50 to-success-50 dark:from-warning-950/20 dark:to-success-950/20 rounded-lg border border-warning-200 dark:border-warning-800">
                            <p className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span className="text-default-600">
                                  Original Price:
                                </span>
                                <span className="font-semibold">
                                  ₹{parseFloat(form.price).toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-default-600">
                                  Discount:
                                </span>
                                <span className="font-semibold text-warning-600">
                                  {form.discountType === "percentage"
                                    ? `${form.discountValue}%`
                                    : `₹${form.discountValue}`}
                                </span>
                              </div>
                              <div className="flex justify-between pt-2 border-t border-warning-200 dark:border-warning-800">
                                <span className="text-default-600 font-semibold">
                                  Final Price:
                                </span>
                                <span className="font-bold text-success-600 dark:text-success-400 text-lg">
                                  ₹
                                  {form.discountType === "percentage"
                                    ? (
                                        parseFloat(form.price) -
                                        (parseFloat(form.price) *
                                          parseFloat(form.discountValue)) /
                                          100
                                      ).toFixed(2)
                                    : (
                                        parseFloat(form.price) -
                                        parseFloat(form.discountValue)
                                      ).toFixed(2)}
                                </span>
                              </div>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardBody>
                </Card>

                {/* Details Section */}
                <Card className="border border-default-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📖</span>
                      <h2 className="text-lg font-semibold text-foreground">
                        Detailed Information
                      </h2>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Product Details
                      </label>
                      <RichTextEditor
                        content={form.details}
                        disabled={loading}
                        placeholder="Enter detailed product information, specifications, ingredients, etc."
                        onChange={(content) =>
                          setForm((prev) => ({ ...prev, details: content }))
                        }
                      />
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Right Column - Product Images (Sticky) */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 space-y-6">
                  {/* Media Section */}
                  <Card className="border border-default-200">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/10 dark:to-blue-950/10 border-b">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🖼️</span>
                        <h2 className="text-lg font-semibold text-foreground">
                          Product Images
                        </h2>
                      </div>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      <ImageUpload
                        aspectRatio="landscape"
                        disabled={loading}
                        label="Banner Image (Main product image)"
                        value={null}
                        onChange={setBannerImage}
                      />

                      <MultipleImageUpload
                        disabled={loading}
                        label="Additional Product Images"
                        maxImages={10}
                        value={productImages}
                        onChange={setProductImages}
                      />
                    </CardBody>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Variant Products Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information for Variants */}
                <Card className="border border-default-200">
                  <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/10 dark:to-secondary-950/10 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📝</span>
                      <h2 className="text-lg font-semibold text-foreground">
                        Basic Information
                      </h2>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <Input
                      required
                      disabled={loading}
                      label="Product Name"
                      name="name"
                      placeholder="e.g., Fresh Tomatoes"
                      size="lg"
                      value={form.name}
                      onChange={handleChange}
                    />

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Short Description
                      </label>
                      <textarea
                        className="w-full px-4 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground min-h-16 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        disabled={loading}
                        name="description"
                        placeholder="Brief 1-2 line description shown on product cards"
                        value={form.description}
                        onChange={handleChange}
                      />
                    </div>

                    <div>
                      <label
                        className="text-sm font-medium text-foreground block mb-2"
                        htmlFor="category-select-variants"
                      >
                        Category
                      </label>
                      <select
                        id="category-select-variants"
                        required
                        className="w-full px-4 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                        disabled={loading}
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id.toString()}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardBody>
                </Card>

                {/* Variant Configuration */}
                <Card className="border border-default-200">
                  <CardHeader className="bg-gradient-to-r from-success-50 to-emerald-50 dark:from-success-950/10 dark:to-emerald-950/10 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⚙️</span>
                      <h2 className="text-lg font-semibold text-foreground">
                        Variant Configuration
                      </h2>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Base SKU (Auto-generated from product name)
                      </label>
                      <Input
                        required
                        description={
                          form.name
                            ? "Auto-generated from product name. Each variant suffix is auto-generated from label."
                            : "Product name is required to generate base SKU"
                        }
                        disabled={loading}
                        name="sku"
                        placeholder="Enter product name to auto-generate base SKU"
                        size="lg"
                        value={form.sku}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Unit Type - Only for Shared Inventory */}
                    <div>
                      <label
                        className="text-sm font-medium text-foreground block mb-2"
                        htmlFor="unit-type-variants"
                      >
                        Unit Type
                      </label>
                      <select
                        id="unit-type-variants"
                        className="w-full px-4 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-base"
                        disabled={loading}
                        value={getUnitType(form.unit)}
                        onChange={(e) => {
                          const unitType = e.target
                            .value as keyof typeof unitTypeMap;
                          const firstUnit = Object.keys(
                            unitTypeMap[unitType].units,
                          )[0];

                          setForm((prev) => ({ ...prev, unit: firstUnit }));
                        }}
                      >
                        {Object.entries(unitTypeMap).map(([key, data]) => (
                          <option key={key} value={key}>
                            {data.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-default-500 mt-2">
                        Variants will have different quantities of this unit
                        type
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 rounded-lg p-4 border-2 border-primary-200 dark:border-primary-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-primary-700 dark:text-primary-400">
                            {form.stockMergeType === "merged"
                              ? "📦 Shared Inventory"
                              : "📦 Independent Inventory"}
                          </p>
                          <p className="text-xs text-primary-600 dark:text-primary-500 mt-1">
                            {form.stockMergeType === "merged"
                              ? "All variants share the same inventory pool"
                              : "Each variant has independent stock tracking"}
                          </p>
                        </div>
                        <Switch
                          color="primary"
                          disabled={loading}
                          isSelected={form.stockMergeType === "merged"}
                          size="lg"
                          onValueChange={(value) =>
                            setForm((prev) => ({
                              ...prev,
                              stockMergeType: value ? "merged" : "independent",
                            }))
                          }
                        />
                      </div>

                      {form.stockMergeType === "merged" && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                className="text-sm font-medium text-foreground block mb-2"
                                htmlFor="unit-variants-merged"
                              >
                                Unit
                              </label>
                              <select
                                id="unit-variants-merged"
                                className="w-full px-4 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-base"
                                disabled={loading}
                                name="unit"
                                value={form.unit}
                                onChange={handleChange}
                              >
                                {Object.entries(
                                  unitTypeMap[getUnitType(form.unit)].units,
                                ).map(([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                              <p className="text-xs text-default-500 mt-2">
                                Shared across all variants
                              </p>
                            </div>
                            <div>
                              <label
                                className="text-sm font-medium text-foreground block mb-2"
                                htmlFor="total-stock-variants"
                              >
                                Total Stock
                              </label>
                              <Input
                                id="total-stock-variants"
                                required
                                disabled={loading}
                                name="stock"
                                placeholder="0"
                                size="lg"
                                type="number"
                                value={form.stock}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>

                {/* Product Details */}
                <Card className="border border-default-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/10 dark:to-pink-950/10 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">📖</span>
                      <h2 className="text-lg font-semibold text-foreground">
                        Detailed Information
                      </h2>
                    </div>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Product Details
                      </label>
                      <RichTextEditor
                        content={form.details}
                        disabled={loading}
                        placeholder="Enter detailed product information, specifications, ingredients, etc."
                        onChange={(content) =>
                          setForm((prev) => ({ ...prev, details: content }))
                        }
                      />
                    </div>
                  </CardBody>
                </Card>

                {/* Variants List */}
                <Card className="border border-default-200">
                  <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/10 dark:to-blue-950/10 border-b flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎨</span>
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">
                          Product Variants
                        </h2>
                        <p className="text-sm text-default-500">
                          Add different sizes or options
                        </p>
                      </div>
                    </div>
                    <Button
                      className="font-semibold"
                      color="primary"
                      disabled={loading}
                      size="md"
                      variant="flat"
                      onPress={addVariant}
                    >
                      + Add Variant
                    </Button>
                  </CardHeader>
                  <CardBody className="space-y-4">
                    {variants.map((variant, index) => (
                      <Card
                        key={variant.id}
                        className="border-2 border-default-200 dark:border-default-300"
                      >
                        <CardBody className="space-y-4">
                          {/* Variant Header with Title and Delete Button */}
                          <div className="flex items-center justify-between pb-3 border-b-2 border-default-100">
                            <div>
                              <p className="text-lg font-semibold text-foreground">
                                Variant {index + 1}
                              </p>
                              <p className="text-sm text-default-500 mt-1">
                                {variant.label || "New variant"}
                              </p>
                            </div>
                            {variants.length > 2 && (
                              <Button
                                isIconOnly
                                className="hover:bg-danger-50"
                                color="danger"
                                disabled={loading}
                                size="sm"
                                title="Remove variant (minimum 2 required)"
                                variant="light"
                                onPress={() => removeVariant(variant.id)}
                              >
                                ✕
                              </Button>
                            )}
                          </div>

                          {/* Variant Label and SKU */}
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              id={`variant-label-${variant.id}`}
                              required
                              description="Enter label to auto-generate SKU suffix"
                              disabled={loading}
                              label="Variant Label"
                              placeholder="e.g., 1kg, 2kg, 500gm, Red Small"
                              size="lg"
                              value={variant.label}
                              onChange={(e) =>
                                handleVariantChange(
                                  variant.id,
                                  "label",
                                  e.target.value,
                                )
                              }
                            />

                            <div>
                              <label
                                className="text-sm font-medium text-foreground block mb-2"
                                htmlFor={`variant-sku-suffix-${variant.id}`}
                              >
                                SKU Suffix (Auto-generated)
                              </label>
                              <div className="flex gap-2 items-end">
                                <div className="flex-1">
                                  <Input
                                    id={`variant-sku-suffix-${variant.id}`}
                                    required
                                    description="Edit if needed"
                                    disabled={loading}
                                    placeholder="Auto-generated from label"
                                    size="lg"
                                    value={variant.skuSuffix}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        variant.id,
                                        "skuSuffix",
                                        e.target.value,
                                      )
                                    }
                                  />
                                </div>
                              </div>
                              <p className="text-xs text-default-600 mt-2 font-mono bg-default-100 dark:bg-default-200 p-2 rounded">
                                Full SKU:{" "}
                                <span className="font-semibold">
                                  {form.sku}
                                  {variant.skuSuffix}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Pricing */}
                          <div>
                            <label className="text-sm font-medium text-foreground block mb-2">
                              Price (₹)
                            </label>
                            <Input
                              required
                              disabled={loading}
                              placeholder="0.00"
                              size="lg"
                              step="0.01"
                              type="number"
                              value={variant.price}
                              onChange={(e) =>
                                handleVariantChange(
                                  variant.id,
                                  "price",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          {/* Variant Unit and Quantity - Same Row */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                className="text-sm font-medium text-foreground block mb-2"
                                htmlFor={`variant-unit-${variant.id}`}
                              >
                                Variant Unit
                              </label>
                              <select
                                id={`variant-unit-${variant.id}`}
                                className="w-full px-4 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-base"
                                disabled={loading}
                                value={variant.unit}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.id,
                                    "unit",
                                    e.target.value,
                                  )
                                }
                              >
                                {Object.entries(
                                  unitTypeMap[getUnitType(form.unit)].units,
                                ).map(([value, label]) => (
                                  <option key={value} value={value}>
                                    {label}
                                  </option>
                                ))}
                              </select>
                              {form.stockMergeType === "merged" && (
                                <p className="text-xs text-default-500 mt-2">
                                  Related to stock unit:{" "}
                                  <span className="font-semibold">
                                    {form.unit === "piece"
                                      ? "Pieces"
                                      : form.unit === "dozen"
                                        ? "Dozens"
                                        : form.unit === "gm"
                                          ? "Grams"
                                          : form.unit === "mg"
                                            ? "Milligrams"
                                            : form.unit === "kg"
                                              ? "Kilograms"
                                              : form.unit === "ml"
                                                ? "Milliliters"
                                                : "Liters"}
                                  </span>
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="text-sm font-medium text-foreground block mb-2">
                                {`Quantity (${variant.unit === "gm" ? "Gram" : variant.unit === "mg" ? "Milligram" : variant.unit === "ml" ? "Milliliter" : variant.unit.charAt(0).toUpperCase() + variant.unit.slice(1)})`}
                              </label>
                              <Input
                                required
                                disabled={loading}
                                placeholder="e.g., 500"
                                size="lg"
                                step="0.01"
                                type="number"
                                value={variant.quantity}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.id,
                                    "quantity",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          {/* Stock Input - Only for Independent Mode */}
                          {form.stockMergeType === "independent" && (
                            <div>
                              <label
                                className="text-sm font-medium text-foreground block mb-2"
                                htmlFor={`variant-stock-${variant.id}`}
                              >
                                Stock
                              </label>
                              <Input
                                id={`variant-stock-${variant.id}`}
                                required
                                description="Stock for this variant only"
                                disabled={loading}
                                placeholder="0"
                                size="lg"
                                type="number"
                                value={variant.stock}
                                onChange={(e) =>
                                  handleVariantChange(
                                    variant.id,
                                    "stock",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          )}

                          {/* Discount Section */}
                          <div className="bg-gradient-to-r from-warning-50 to-amber-50 dark:from-warning-950/20 dark:to-amber-950/20 rounded-lg p-4 border-2 border-warning-200 dark:border-warning-800 space-y-3">
                            <div className="flex items-center gap-2">
                              <Switch
                                color="warning"
                                disabled={loading}
                                isSelected={variant.isDiscountActive}
                                size="lg"
                                onValueChange={(value) =>
                                  handleVariantChange(
                                    variant.id,
                                    "isDiscountActive",
                                    value ? "true" : "false",
                                  )
                                }
                              />
                              <label className="text-sm font-semibold text-warning-700 dark:text-warning-400">
                                Apply Discount
                              </label>
                            </div>
                            {variant.isDiscountActive && (
                              <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label
                                      className="text-sm font-medium text-foreground block mb-1"
                                      htmlFor={`variant-discount-type-v2-${variant.id}`}
                                    >
                                      Discount Type
                                    </label>
                                    <select
                                      id={`variant-discount-type-v2-${variant.id}`}
                                      className="w-full px-3 py-2 text-sm border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground focus:outline-none focus:border-warning-500"
                                      disabled={loading}
                                      value={variant.discountType}
                                      onChange={(e) =>
                                        handleVariantChange(
                                          variant.id,
                                          "discountType",
                                          e.target.value,
                                        )
                                      }
                                    >
                                      <option value="percentage">
                                        Percentage (%)
                                      </option>
                                      <option value="fixed_amount">
                                        Fixed Amount (₹)
                                      </option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-foreground block mb-1">
                                      {variant.discountType === "percentage"
                                        ? "Discount (%)"
                                        : "Discount (₹)"}
                                    </label>
                                    <Input
                                      disabled={loading}
                                      max={
                                        variant.discountType === "percentage"
                                          ? "100"
                                          : undefined
                                      }
                                      placeholder={
                                        variant.discountType === "percentage"
                                          ? "0-100"
                                          : "0.00"
                                      }
                                      size="sm"
                                      step={
                                        variant.discountType === "percentage"
                                          ? "1"
                                          : "0.01"
                                      }
                                      type="number"
                                      value={variant.discountValue}
                                      onChange={(e) =>
                                        handleVariantChange(
                                          variant.id,
                                          "discountValue",
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </div>
                                </div>
                                {variant.price && variant.discountValue && (
                                  <div className="p-3 bg-white dark:bg-default-100 rounded-lg border border-warning-300 dark:border-warning-700 text-center">
                                    <p className="text-xs text-default-600 mb-1">
                                      Final Price
                                    </p>
                                    <p className="text-lg font-bold text-success-600 dark:text-success-400">
                                      ₹
                                      {variant.discountType === "percentage"
                                        ? (
                                            parseFloat(variant.price) -
                                            (parseFloat(variant.price) *
                                              parseFloat(
                                                variant.discountValue,
                                              )) /
                                              100
                                          ).toFixed(2)
                                        : (
                                            parseFloat(variant.price) -
                                            parseFloat(variant.discountValue)
                                          ).toFixed(2)}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Full Name Preview */}
                          <div className="p-3 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 rounded-lg border border-primary-200 dark:border-primary-800">
                            <p className="text-xs text-default-600 mb-1">
                              Full Product Name
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {form.name} {variant.label}
                            </p>
                          </div>

                          {/* Independent Mode: Variant-specific assets */}
                          {form.stockMergeType === "independent" && (
                            <div className="space-y-4 pt-4 border-t-2 border-default-200">
                              <p className="text-sm font-semibold text-foreground">
                                Variant-Specific Assets
                              </p>

                              {/* Variant Description */}
                              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800">
                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-200 dark:border-blue-800">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">📝</span>
                                    <label
                                      htmlFor={`variant-description-${variant.id}`}
                                      className="text-sm font-semibold text-blue-700 dark:text-blue-400"
                                    >
                                      Description
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      color="primary"
                                      disabled={loading || index === 0}
                                      isSelected={
                                        index === 0
                                          ? false
                                          : variant.useSameDescription
                                      }
                                      size="sm"
                                      onValueChange={(value) =>
                                        handleVariantChange(
                                          variant.id,
                                          "useSameDescription",
                                          value,
                                        )
                                      }
                                    />
                                    <span className="text-xs font-medium text-blue-600 dark:text-blue-500">
                                      {index === 0
                                        ? "main"
                                        : variant.useSameDescription
                                          ? "Using main"
                                          : "Custom"}
                                    </span>
                                  </div>
                                </div>
                                {(index === 0 ||
                                  !variant.useSameDescription) && (
                                  <textarea
                                    className="w-full px-4 py-2 border border-default-200 rounded-lg bg-white dark:bg-default-100 text-foreground min-h-20 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    disabled={loading}
                                    placeholder="Variant-specific description for this size/option"
                                    value={variant.description}
                                    onChange={(e) =>
                                      handleVariantChange(
                                        variant.id,
                                        "description",
                                        e.target.value,
                                      )
                                    }
                                  />
                                )}
                              </div>

                              {/* Variant Detailed Information */}
                              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg p-4 border-2 border-indigo-200 dark:border-indigo-800">
                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-indigo-200 dark:border-indigo-800">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">📖</span>
                                    <label
                                      htmlFor={`variant-details-${variant.id}`}
                                      className="text-sm font-semibold text-indigo-700 dark:text-indigo-400"
                                    >
                                      Detailed Information
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      color="secondary"
                                      disabled={loading || index === 0}
                                      isSelected={
                                        index === 0
                                          ? false
                                          : variant.useSameDetails
                                      }
                                      size="sm"
                                      onValueChange={(value) =>
                                        handleVariantChange(
                                          variant.id,
                                          "useSameDetails",
                                          value,
                                        )
                                      }
                                    />
                                    <span className="text-xs font-medium text-indigo-600 dark:text-indigo-500">
                                      {index === 0
                                        ? "main"
                                        : variant.useSameDetails
                                          ? "Using main"
                                          : "Custom"}
                                    </span>
                                  </div>
                                </div>
                                {(index === 0 || !variant.useSameDetails) && (
                                  <RichTextEditor
                                    content={variant.details}
                                    disabled={loading}
                                    placeholder="Enter detailed product information, specifications, ingredients, etc. for this variant"
                                    onChange={(content) =>
                                      handleVariantChange(
                                        variant.id,
                                        "details",
                                        content,
                                      )
                                    }
                                  />
                                )}
                              </div>

                              {/* Variant Banner Image */}
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-800">
                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-green-200 dark:border-green-800">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">🖼️</span>
                                    <label
                                      htmlFor={`variant-banner-${variant.id}`}
                                      className="text-sm font-semibold text-green-700 dark:text-green-400"
                                    >
                                      Banner Image
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      color="success"
                                      disabled={loading || index === 0}
                                      isSelected={
                                        index === 0
                                          ? false
                                          : variant.useSameBannerImage
                                      }
                                      size="sm"
                                      onValueChange={(value) =>
                                        handleVariantChange(
                                          variant.id,
                                          "useSameBannerImage",
                                          value,
                                        )
                                      }
                                    />
                                    <span className="text-xs font-medium text-green-600 dark:text-green-500">
                                      {index === 0
                                        ? "main"
                                        : variant.useSameBannerImage
                                          ? "Using main"
                                          : "Custom"}
                                    </span>
                                  </div>
                                </div>
                                {(index === 0 ||
                                  !variant.useSameBannerImage) && (
                                  <div className="flex flex-col gap-3">
                                    {variant.bannerImage && (
                                      <div className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-default-300">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                          alt={`Variant ${index + 1} banner`}
                                          className="w-full h-full object-cover"
                                          src={URL.createObjectURL(
                                            variant.bannerImage,
                                          )}
                                        />
                                        <button
                                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 shadow-lg"
                                          type="button"
                                          onClick={() =>
                                            handleVariantChange(
                                              variant.id,
                                              "bannerImage",
                                              null,
                                            )
                                          }
                                        >
                                          ✕
                                        </button>
                                      </div>
                                    )}
                                    <label className="w-full px-4 py-3 border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg cursor-pointer hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-950/30 flex flex-col items-center justify-center gap-2 transition">
                                      <input
                                        accept="image/*"
                                        className="hidden"
                                        disabled={loading}
                                        type="file"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];

                                          if (file)
                                            handleVariantChange(
                                              variant.id,
                                              "bannerImage",
                                              file,
                                            );
                                        }}
                                      />
                                      <span className="text-2xl">📤</span>
                                      <span className="text-sm font-medium text-foreground">
                                        Click to upload banner image
                                      </span>
                                    </label>
                                  </div>
                                )}
                              </div>

                              {/* Variant Images */}
                              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-800">
                                <div className="flex items-center justify-between mb-3 pb-3 border-b border-purple-200 dark:border-purple-800">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">🎨</span>
                                    <label
                                      htmlFor={`variant-images-${variant.id}`}
                                      className="text-sm font-semibold text-purple-700 dark:text-purple-400"
                                    >
                                      Product Images
                                    </label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Switch
                                      color="secondary"
                                      disabled={loading || index === 0}
                                      isSelected={
                                        index === 0
                                          ? false
                                          : variant.useSameImages
                                      }
                                      size="sm"
                                      onValueChange={(value) =>
                                        handleVariantChange(
                                          variant.id,
                                          "useSameImages",
                                          value,
                                        )
                                      }
                                    />
                                    <span className="text-xs font-medium text-purple-600 dark:text-purple-500">
                                      {index === 0
                                        ? "main"
                                        : variant.useSameImages
                                          ? "Using main"
                                          : "Custom"}
                                    </span>
                                  </div>
                                </div>
                                {(index === 0 || !variant.useSameImages) && (
                                  <div className="space-y-3">
                                    <div className="flex flex-wrap gap-3">
                                      {variant.images.map((img, imgIdx) => (
                                        <div
                                          key={imgIdx}
                                          className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-default-300 hover:border-purple-400 transition"
                                        >
                                          {/* eslint-disable-next-line @next/next/no-img-element */}
                                          <img
                                            alt={`${index + 1}-${imgIdx + 1}`}
                                            className="w-full h-full object-cover"
                                            src={URL.createObjectURL(img)}
                                          />
                                          <button
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-md"
                                            type="button"
                                            onClick={() => {
                                              const newImages =
                                                variant.images.filter(
                                                  (_, i) => i !== imgIdx,
                                                );

                                              setVariants(
                                                variants.map((v) =>
                                                  v.id === variant.id
                                                    ? {
                                                        ...v,
                                                        images: newImages,
                                                      }
                                                    : v,
                                                ),
                                              );
                                            }}
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      ))}
                                      <label className="w-24 h-24 rounded-lg border-2 border-dashed border-purple-300 dark:border-purple-700 flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition">
                                        <input
                                          multiple
                                          accept="image/*"
                                          className="hidden"
                                          disabled={loading}
                                          type="file"
                                          onChange={(e) => {
                                            const newFiles = Array.from(
                                              e.target.files || [],
                                            );
                                            const updatedImages = [
                                              ...variant.images,
                                              ...newFiles,
                                            ];

                                            setVariants(
                                              variants.map((v) =>
                                                v.id === variant.id
                                                  ? {
                                                      ...v,
                                                      images: updatedImages,
                                                    }
                                                  : v,
                                              ),
                                            );
                                          }}
                                        />
                                        <span className="text-3xl">+</span>
                                      </label>
                                    </div>
                                    <p className="text-xs text-default-600">
                                      Add up to 10 images per variant
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </CardBody>
                      </Card>
                    ))}
                  </CardBody>
                </Card>
              </div>

              {/* Right Column - Product Images (Sticky) */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 space-y-6">
                  {/* Media Section */}
                  <Card className="border border-default-200">
                    <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-950/10 dark:to-blue-950/10 border-b">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🖼️</span>
                        <h2 className="text-lg font-semibold text-foreground">
                          Product Images
                        </h2>
                      </div>
                    </CardHeader>
                    <CardBody className="space-y-4">
                      {form.stockMergeType === "merged" && (
                        <>
                          <ImageUpload
                            aspectRatio="landscape"
                            disabled={loading}
                            label="Banner Image (applies to all variants)"
                            value={null}
                            onChange={setBannerImage}
                          />

                          <MultipleImageUpload
                            disabled={loading}
                            label="Product Images (applies to all variants)"
                            maxImages={10}
                            value={productImages}
                            onChange={setProductImages}
                          />
                        </>
                      )}
                      {form.stockMergeType === "independent" && (
                        <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                          <p className="text-sm text-blue-700 dark:text-blue-400 mb-2">
                            📝 Variant-specific images are configured in each
                            variant&apos;s settings below
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-500">
                            Add custom banner images and product images for each
                            variant to showcase different perspectives
                          </p>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                </div>
              </div>

              {/* Submit Section moved outside form */}
            </>
          )}
        </form>
      </div>

      {/* Fixed Button - Outside containers to always be visible */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-default-100 border-t border-default-200 p-4 flex gap-3 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 w-full flex gap-3">
          <Link className="flex-1" href={`/seller/${orgId}/products`}>
            <Button fullWidth disabled={loading} size="lg" variant="bordered">
              ← Cancel
            </Button>
          </Link>
          <Button
            fullWidth
            className="font-semibold"
            color="primary"
            disabled={loading}
            form="product-form"
            isLoading={loading}
            size="lg"
            type="submit"
          >
            {loading ? "Creating..." : "✓ Create Product"}
          </Button>
        </div>
      </div>
    </main>
  );
}
