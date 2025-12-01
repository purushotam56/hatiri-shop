import { Metadata } from "next";
import { apiEndpoints } from "@/lib/api-client";
import { ProductSEO } from "@/components/product-seo";
import { StoreLayout } from "@/components/layouts/store-layout";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { ProductDetailClient } from "./product-detail-client";
import Link from "next/link";
import { Product } from "@/types/product";

async function getProduct(productId: string): Promise<Product | null> {
  try {
    const productData = await apiEndpoints.getProduct(productId);
    const product = productData.product || productData.data;
    return product || null;
  } catch (error) {
    console.error("Failed to load product:", error);
    return null;
  }
}

async function getOrganisation(organisationId: number) {
  try {
    const orgData = await apiEndpoints.getOrganisation(organisationId);
    return orgData.organisation || orgData.data || null;
  } catch (error) {
    console.error("Failed to fetch organization:", error);
    return null;
  }
}

async function getVariants(product: Product): Promise<Product[]> {
  // New API returns variants directly in the product response
  if (
    product.variants &&
    Array.isArray(product.variants) &&
    product.variants.length > 0
  ) {
    return product.variants;
  }

  // Fallback: return product itself if no variants
  return [product];
}

// Server-side metadata generation
async function getProductMetadata(productId: string): Promise<{
  product?: any;
  error?: string;
}> {
  try {
    const productData = await apiEndpoints.getProduct(productId);
    const product = productData.product || productData.data;
    return { product };
  } catch (error) {
    console.error("Failed to fetch product metadata:", error);
    return { error: "Failed to load product" };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const productId = id;
  const { product, error } = await getProductMetadata(productId);

  if (error || !product) {
    return {
      title: "Product Not Found",
      description: "The product you are looking for does not exist.",
    };
  }

  const productName = product.name || "Product";
  const productDescription =
    product.description ||
    `Buy ${productName} online at Hatiri Shop - Quick Commerce in 10 Minutes`;
  const productImage = product.bannerImage?.url || product.image?.url;
  const storeName = product.organisation?.name || "Hatiri Shop";

  return {
    title: productName,
    description: productDescription,
    openGraph: {
      title: productName,
      description: productDescription,
      type: "website",
      url: `https://hatiri.shop/product/${productId}`,
      images: productImage
        ? [
            {
              url: productImage,
              width: 1200,
              height: 630,
              alt: productName,
            },
          ]
        : [],
      siteName: "Hatiri Shop",
    },
    twitter: {
      card: "summary_large_image",
      title: productName,
      description: productDescription,
      images: productImage ? [productImage] : [],
    },
    alternates: {
      canonical: `https://hatiri.shop/product/${productId}`,
    },
    keywords: [productName, storeName, "quick commerce", "shopping"],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = id;
  const product = await getProduct(productId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardBody className="gap-4 py-8 text-center items-center">
            <div className="text-6xl">🔍</div>
            <p className="text-foreground text-xl font-semibold">
              Product not found
            </p>
            <Button href="/" color="primary" size="lg">
              Go Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  const [variants, organisation] = await Promise.all([
    getVariants(product),
    product.organisationId ? getOrganisation(product.organisationId) : null,
  ]);

  return (
    <StoreLayout
      storeCode={product.organisation?.organisationUniqueCode || ""}
      storeName={product.organisation?.name || ""}
      logoUrl={product.organisation?.image?.url || ""}
    >
      {/* SEO Structured Data */}
      <ProductSEO product={product} />

      {/* Back Button Bar */}
      <div className="bg-content1 border-b border-divider">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center">
          <Button
            variant="light"
            as={Link}
            href={"/store/"+product.organisation?.organisationUniqueCode}
            size="sm"
            startContent={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            }
          >
            Back
          </Button>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Interactive Components */}
        <ProductDetailClient
          product={product}
          variants={variants}
          organisation={organisation}
        />
      </div>
    </StoreLayout>
  );
}
