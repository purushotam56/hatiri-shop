import { Product } from "@/types";

interface ProductSEOProps {
  product: Product;
}

export function ProductSEO({ product }: ProductSEOProps) {
  const productImage = product.bannerImage?.url || product.image?.url;
  const storeName = product.organisation?.name || "Hatiri Shop";
  const storeCode = product.organisation?.organisationUniqueCode || "";

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.name,
    description:
      product.description || `Buy ${product.name} online at Hatiri Shop`,
    sku: product.sku || `SKU-${product.id}`,
    image: productImage || "https://hatiri.shop/favicon.ico",
    brand: {
      "@type": "Brand",
      name: storeName,
    },
    offers: {
      "@type": "Offer",
      url: `https://hatiri.shop/product/${product.id}`,
      priceCurrency: product.currency || "INR",
      price: String(product.price),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: storeName,
        url: `https://hatiri.shop/store/${storeCode}`,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: "100",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://hatiri.shop",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: storeName,
        item: `https://hatiri.shop/store/${storeCode}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
        item: `https://hatiri.shop/product/${product.id}`,
      },
    ],
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
        type="application/ld+json"
      />
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
        type="application/ld+json"
      />
    </>
  );
}
