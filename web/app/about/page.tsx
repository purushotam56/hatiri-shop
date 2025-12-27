import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StoreLayout } from "@/components/layouts/store-layout";
import { PageTracker } from "@/components/page-tracker";
import { API_CONFIG } from "@/config/api";
import { apiEndpoints } from "@/lib/api-client";

function getSubdomainCode(hostname: string): string | null {
  if (/^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    return null;
  }

  const parts = hostname.split(".");

  if (parts.length >= 3 && parts[0] !== "localhost" && parts[0] !== "www") {
    return parts[0].toUpperCase();
  }

  return null;
}

async function getStoreByCode(code: string) {
  try {
    const response = await apiEndpoints.getOrganisationByCode(code);

    return response?.organisation || response?.data || null;
  } catch (error) {
    // console.error("Failed to fetch store:", error);

    return null;
  }
}

async function getAboutPageContent(orgCode: string) {
  try {
    const response = await apiEndpoints.getPublicAboutPage(orgCode);

    return { content: response?.content || "" };
  } catch (error) {
    // console.error("Failed to fetch about page content:", error);

    return { content: "" };
  }
}

export async function generateMetadata() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const subdomainCode = getSubdomainCode(host);

  if (subdomainCode) {
    const store = await getStoreByCode(subdomainCode);

    if (store) {
      return {
        title: `About ${store.name}`,
        description: `Learn more about ${store.name}`,
      };
    }
  }

  return {
    title: "About Hatiri",
    description: "Learn more about Hatiri - Quick Commerce Platform",
  };
}

export default async function AboutPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const subdomainCode = getSubdomainCode(host);

  // If subdomain exists, show store's about page
  if (subdomainCode) {
    const store = await getStoreByCode(subdomainCode);

    if (!store) {
      notFound();
    }

    const aboutContent = await getAboutPageContent(subdomainCode);

    return (
      <StoreLayout
        logoUrl={store.image?.url || ""}
        storeCode={subdomainCode}
        storeName={store.name || ""}
      >
        <PageTracker
          apiUrl={API_CONFIG.apiBaseUrl}
          organisationId={store.id}
          pageType="about"
        />

        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/">
              <Button isIconOnly className="text-lg" size="sm" variant="light">
                ←
              </Button>
            </Link>
            <div>
              <h1 className="font-bold text-xl text-foreground">
                About {store.name}
              </h1>
            </div>
          </div>

          <Card className="bg-gradient-to-br from-content1 to-content2">
            <CardHeader className="px-4 py-3">
              <h2 className="text-lg font-bold text-foreground">📖 About Us</h2>
            </CardHeader>
            <Divider />
            <CardBody className="px-4 py-3 text-sm">
              {aboutContent?.content ? (
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {aboutContent.content}
                </p>
              ) : (
                <p className="text-foreground/50">About page coming soon</p>
              )}
            </CardBody>
          </Card>

          <div className="mt-6 flex justify-center">
            <Link href="/">
              <Button color="primary" variant="flat">
                ← Back to Store
              </Button>
            </Link>
          </div>
        </div>
      </StoreLayout>
    );
  }

  // Default Hatiri About Page
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link className="text-2xl font-black" href="/">
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Hatiri
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              className="px-7 py-2.5 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-200"
              href="/seller"
            >
              Sell with Us →
            </Link>
          </div>
        </div>
      </nav>

      {/* About Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
          About Hatiri
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Hatiri is the complete platform for quick commerce sellers. We provide
          the technology, infrastructure, and tools you need to launch and scale
          your quick commerce business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To empower sellers with technology that enables them to compete
              and grow in the quick commerce space without the burden of
              building infrastructure themselves.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Vision
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To create an ecosystem where any seller, anywhere, can build a
              thriving quick commerce business with the same tools and
              capabilities as large enterprises.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-8 my-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose Hatiri?
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span>
                Full control over your business - choose your delivery partners
                and payment methods
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span>
                Complete analytics and insights to optimize your operations
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span>14-day free trial - no credit card required</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-orange-600 font-bold">✓</span>
              <span>24/7 support from our dedicated team</span>
            </li>
          </ul>
        </div>

        <div className="text-center py-8">
          <Link
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            href="/seller"
          >
            Start Your Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 Hatiri. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
