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

async function getContactPageContent(orgCode: string) {
  try {
    const response = await apiEndpoints.getPublicContactPage(orgCode);

    return {
      address: response?.address || "",
      additionalInfo: response?.additionalInfo || "",
    };
  } catch (error) {
    // console.error("Failed to fetch contact page content:", error);

    return { address: "", additionalInfo: "" };
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
        title: `Contact ${store.name}`,
        description: `Get in touch with ${store.name}`,
      };
    }
  }

  return {
    title: "Contact Hatiri",
    description: "Get in touch with Hatiri - Quick Commerce Platform",
  };
}

export default async function ContactPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const subdomainCode = getSubdomainCode(host);

  // If subdomain exists, show store's contact page
  if (subdomainCode) {
    const store = await getStoreByCode(subdomainCode);

    if (!store) {
      notFound();
    }

    const contactContent = await getContactPageContent(subdomainCode);

    return (
      <StoreLayout
        logoUrl={store.image?.url || ""}
        storeCode={subdomainCode}
        storeName={store.name || ""}
      >
        <PageTracker
          apiUrl={API_CONFIG.apiBaseUrl}
          organisationId={store.id}
          pageType="contact"
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
                Contact {store.name}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Address Card */}
            <Card className="bg-gradient-to-br from-content1 to-content2">
              <CardHeader className="px-4 py-3">
                <h2 className="text-lg font-bold text-foreground">
                  📍 Address
                </h2>
              </CardHeader>
              <Divider />
              <CardBody className="px-4 py-3 text-sm">
                {contactContent?.address ? (
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {contactContent.address}
                  </p>
                ) : (
                  <p className="text-foreground/50">Address not provided yet</p>
                )}
              </CardBody>
            </Card>

            {/* Business Information Card */}
            <Card className="bg-gradient-to-br from-content1 to-content2">
              <CardHeader className="px-4 py-3">
                <h2 className="text-lg font-bold text-foreground">
                  ℹ️ Business Info
                </h2>
              </CardHeader>
              <Divider />
              <CardBody className="px-4 py-3 text-sm">
                {contactContent?.additionalInfo ? (
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {contactContent.additionalInfo}
                  </p>
                ) : (
                  <p className="text-foreground/50">
                    Business information coming soon
                  </p>
                )}
              </CardBody>
            </Card>
          </div>

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

  // Default Hatiri Contact Page
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

      {/* Contact Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6">
          Get in Touch
        </h1>
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Have questions about Hatiri? We&apos;d love to hear from you. Contact
          us through any of the channels below.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">📧 Email</h2>
            <p className="text-gray-600 mb-2">General inquiries</p>
            <a
              className="text-orange-600 font-semibold hover:text-orange-700"
              href="mailto:hello@hatiri.shop"
            >
              hello@hatiri.shop
            </a>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              💬 Support
            </h2>
            <p className="text-gray-600 mb-2">For urgent issues</p>
            <a
              className="text-blue-600 font-semibold hover:text-blue-700"
              href="mailto:support@hatiri.shop"
            >
              support@hatiri.shop
            </a>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 my-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Office Address
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 font-semibold">Headquarters</p>
              <p className="text-gray-700">
                📍 Hatiri Office
                <br />
                Quick Commerce Hub
                <br />
                India
              </p>
            </div>
            <div className="border-t border-gray-300 pt-4">
              <p className="text-gray-600 font-semibold">Business Hours</p>
              <p className="text-gray-700">
                Monday - Friday: 9:00 AM - 6:00 PM IST
                <br />
                Saturday: 10:00 AM - 4:00 PM IST
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg p-8 text-white text-center my-12">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6 text-orange-50">
            Join hundreds of sellers already using Hatiri to scale their quick
            commerce business.
          </p>
          <Link
            className="inline-block px-8 py-3 rounded-full bg-white text-orange-600 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            href="/seller"
          >
            Start Your Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© 2024 Hatiri. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
