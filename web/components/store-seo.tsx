import { FC } from 'react';

interface StoreSEOProps {
  storeName: string;
  storeCode: string;
  description: string;
  productCount: number;
  organisation?: any;
}

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_WEB_URL || 'https://hatiri.shop';
};

export const StoreSEO: FC<StoreSEOProps> = ({
  storeName,
  storeCode,
  description,
  productCount,
  organisation,
}) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/store/${storeCode.toLowerCase()}`;

  // Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: storeName,
    description: description,
    url: url,
    alternateName: storeCode,
    priceRange: '$',
    areaServed: 'IN',
    deliveryMethod: 'DeliveryMethod',
    ...(organisation?.whatsappNumber && {
      telephone: organisation.whatsappNumber,
    }),
    sameAs: [
      'https://www.facebook.com/hatiri',
      'https://www.instagram.com/hatiri',
      'https://www.twitter.com/hatiri',
    ],
  };

  // Store Schema with Products
  const storeSchema = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: storeName,
    url: url,
    description: description,
    numberOfItems: productCount,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: organisation?.currency || 'INR',
      availability: 'https://schema.org/InStock',
      url: url,
    },
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Stores',
        item: `${baseUrl}/#stores`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: storeName,
        item: url,
      },
    ],
  };

  // WebPage Schema
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${storeName} | Online Store`,
    description: description,
    url: url,
    mainEntity: {
      '@type': 'LocalBusiness',
      name: storeName,
      description: description,
    },
  };

  return (
    <>
      {/* Organization Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      {/* Store Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(storeSchema),
        }}
      />

      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      {/* WebPage Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema),
        }}
      />
    </>
  );
};
