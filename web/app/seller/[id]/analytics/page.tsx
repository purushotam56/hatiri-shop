"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Tabs, Tab } from "@heroui/tabs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useSellerStore } from "@/context/seller-store-context";
import { apiEndpoints } from "@/lib/api-client";

interface PageViewStats {
  totalViews: number;
  uniqueVisitors: number;
  avgDuration: number;
}

interface TopCity {
  city: string;
  views: number;
  uniqueVisitors: number;
}

interface TopReferer {
  referer: string;
  views: number;
}

interface EventStat {
  eventType: string;
  count: number;
  uniqueUsers: number;
  lastOccurred: string;
}

export default function AnalyticsDashboard() {
  const params = useParams();
  const router = useRouter();
  const orgId = params.id as string;
  const { selectedStore } = useSellerStore();

  const [aboutStats, setAboutStats] = useState<PageViewStats | null>(null);
  const [contactStats, setContactStats] = useState<PageViewStats | null>(null);
  const [storefrontStats, setStorefrontStats] = useState<PageViewStats | null>(
    null,
  );
  const [productStats, setProductStats] = useState<PageViewStats | null>(null);
  const [aboutCities, setAboutCities] = useState<TopCity[]>([]);
  const [contactCities, setContactCities] = useState<TopCity[]>([]);
  const [storefrontCities, setStorefrontCities] = useState<TopCity[]>([]);
  const [productCities, setProductCities] = useState<TopCity[]>([]);
  const [aboutReferers, setAboutReferers] = useState<TopReferer[]>([]);
  const [contactReferers, setContactReferers] = useState<TopReferer[]>([]);
  const [storefrontReferers, setStorefrontReferers] = useState<TopReferer[]>(
    [],
  );
  const [productReferers, setProductReferers] = useState<TopReferer[]>([]);
  const [eventStats, setEventStats] = useState<EventStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storeLoaded, setStoreLoaded] = useState(false);

  // First effect: wait for store to load
  useEffect(() => {
    const timer = setTimeout(() => {
      setStoreLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Second effect: fetch analytics when ready
  useEffect(() => {
    if (!storeLoaded) return;

    const token = localStorage.getItem("sellerToken");

    if (!token || !selectedStore) {
      router.push("/seller");

      return;
    }

    fetchAnalytics(token);
  }, [storeLoaded, selectedStore, router]);

  async function fetchAnalytics(token: string) {
    try {
      setLoading(true);
      setError(null);

      // Fetch page view stats
      const aboutResponse = await apiEndpoints.getSellerPageViewStats(
        orgId,
        "about",
        token,
      );
      const contactResponse = await apiEndpoints.getSellerPageViewStats(
        orgId,
        "contact",
        token,
      );
      const storefrontResponse = await apiEndpoints.getSellerPageViewStats(
        orgId,
        "storefront",
        token,
      );
      const productResponse = await apiEndpoints.getSellerPageViewStats(
        orgId,
        "product-page",
        token,
      );
      const eventsResponse = await apiEndpoints.getSellerEventStats(
        orgId,
        undefined,
        token,
      );

      setAboutStats(aboutResponse.stats);
      setAboutCities(aboutResponse.topCities || []);
      setAboutReferers(aboutResponse.topReferers || []);

      setContactStats(contactResponse.stats);
      setContactCities(contactResponse.topCities || []);
      setContactReferers(contactResponse.topReferers || []);

      setStorefrontStats(storefrontResponse.stats);
      setStorefrontCities(storefrontResponse.topCities || []);
      setStorefrontReferers(storefrontResponse.topReferers || []);

      setProductStats(productResponse.stats);
      setProductCities(productResponse.topCities || []);
      setProductReferers(productResponse.topReferers || []);

      setEventStats(eventsResponse.stats || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 border border-red-200">
          <CardBody>
            <p className="text-red-600">{error}</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
      <p className="text-gray-600">Last 30 days of page views and events</p>

      <Tabs aria-label="Analytics tabs" color="primary">
        {/* About Page Stats */}
        <Tab key="about" title="📄 About Page">
          <div className="space-y-4 mt-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Total Views
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {aboutStats?.totalViews || 0}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Unique Visitors
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {aboutStats?.uniqueVisitors || 0}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Avg Duration
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {aboutStats?.avgDuration
                      ? `${Math.round(aboutStats.avgDuration / 1000)}s`
                      : "0s"}
                  </p>
                </CardBody>
              </Card>
            </div>

            {/* Top Cities */}
            {aboutCities.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">🌍 Top Cities</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    {aboutCities.map((city, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{city.city}</p>
                          <p className="text-sm text-gray-600">
                            {city.uniqueVisitors} unique visitors
                          </p>
                        </div>
                        <p className="text-lg font-bold">{city.views}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Top Referers */}
            {aboutReferers.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">🔗 Top Referers</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    {aboutReferers.map((ref, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-2 border-b last:border-0"
                      >
                        <p className="font-medium truncate text-sm">
                          {ref.referer}
                        </p>
                        <p className="text-lg font-bold">{ref.views}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>

        {/* Contact Page Stats */}
        <Tab key="contact" title="📞 Contact Page">
          <div className="space-y-4 mt-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Total Views
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {contactStats?.totalViews || 0}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Unique Visitors
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {contactStats?.uniqueVisitors || 0}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Avg Duration
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {contactStats?.avgDuration
                      ? `${Math.round(contactStats.avgDuration / 1000)}s`
                      : "0s"}
                  </p>
                </CardBody>
              </Card>
            </div>

            {/* Top Cities */}
            {contactCities.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">🌍 Top Cities</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    {contactCities.map((city, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{city.city}</p>
                          <p className="text-sm text-gray-600">
                            {city.uniqueVisitors} unique visitors
                          </p>
                        </div>
                        <p className="text-lg font-bold">{city.views}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Top Referers */}
            {contactReferers.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">🔗 Top Referers</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    {contactReferers.map((ref, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-2 border-b last:border-0"
                      >
                        <p className="font-medium truncate text-sm">
                          {ref.referer}
                        </p>
                        <p className="text-lg font-bold">{ref.views}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>

        {/* Storefront Page Stats */}
        <Tab key="storefront" title="🏪 Storefront">
          <div className="space-y-4 mt-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Total Views
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {storefrontStats?.totalViews || 0}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Unique Visitors
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {storefrontStats?.uniqueVisitors || 0}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Avg Duration
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {storefrontStats?.avgDuration
                      ? `${Math.round(storefrontStats.avgDuration / 1000)}s`
                      : "0s"}
                  </p>
                </CardBody>
              </Card>
            </div>

            {/* Top Cities */}
            {storefrontCities.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">🌍 Top Cities</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    {storefrontCities.map((city, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{city.city}</p>
                          <p className="text-sm text-gray-600">
                            {city.uniqueVisitors} unique visitors
                          </p>
                        </div>
                        <p className="text-lg font-bold">{city.views}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Top Referers */}
            {storefrontReferers.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">🔗 Top Referers</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    {storefrontReferers.map((ref, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-2 border-b last:border-0"
                      >
                        <p className="font-medium truncate text-sm">
                          {ref.referer}
                        </p>
                        <p className="text-lg font-bold">{ref.views}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>

        {/* Product Page Stats */}
        <Tab key="product" title="📦 Product Pages">
          <div className="space-y-4 mt-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Total Views
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {productStats?.totalViews || 0}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Unique Visitors
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {productStats?.uniqueVisitors || 0}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardHeader className="flex flex-col items-start px-4 py-2">
                  <p className="text-sm font-semibold text-gray-600">
                    Avg Duration
                  </p>
                </CardHeader>
                <CardBody>
                  <p className="text-3xl font-bold">
                    {productStats?.avgDuration
                      ? `${Math.round(productStats.avgDuration / 1000)}s`
                      : "0s"}
                  </p>
                </CardBody>
              </Card>
            </div>

            {/* Top Cities */}
            {productCities.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">🌍 Top Cities</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    {productCities.map((city, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium">{city.city}</p>
                          <p className="text-sm text-gray-600">
                            {city.uniqueVisitors} unique visitors
                          </p>
                        </div>
                        <p className="text-lg font-bold">{city.views}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Top Referers */}
            {productReferers.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">🔗 Top Referers</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    {productReferers.map((ref, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center pb-2 border-b last:border-0"
                      >
                        <p className="font-medium truncate text-sm">
                          {ref.referer}
                        </p>
                        <p className="text-lg font-bold">{ref.views}</p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>
        <Tab key="events" title="📊 Events">
          <div className="space-y-4 mt-4">
            {eventStats.length > 0 ? (
              <Card>
                <CardBody>
                  <div className="space-y-3">
                    {eventStats.map((event, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-start pb-3 border-b last:border-0"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">
                            {event.eventType}
                          </p>
                          <p className="text-sm text-gray-600">
                            {event.uniqueUsers} unique users • Last:{" "}
                            {new Date(event.lastOccurred).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-2xl font-bold text-blue-600">
                          {event.count}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            ) : (
              <Card>
                <CardBody>
                  <p className="text-center text-gray-600">
                    No events tracked yet
                  </p>
                </CardBody>
              </Card>
            )}
          </div>
        </Tab>
      </Tabs>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            const token = localStorage.getItem("sellerToken");

            if (token) fetchAnalytics(token);
          }}
        >
          🔄 Refresh
        </button>
      </div>
    </div>
  );
}
