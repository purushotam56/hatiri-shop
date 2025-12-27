/**
 * Analytics Tracker Utility
 * Tracks page views and user events with geo-location
 */

interface GeoLocation {
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

interface TrackPageViewPayload {
  pageType: "about" | "contact" | "store" | "storefront" | "product-page";
  sessionId: string;
  userAgent: string;
  ipAddress: string;
  referer?: string;
  viewDuration?: number;
  userId?: number | null;
  productId?: number;
  location?: GeoLocation;
}

interface TrackEventPayload {
  eventType: string;
  sessionId: string;
  userAgent: string;
  ipAddress: string;
  pageType?: "about" | "contact" | "store" | "storefront" | "product-page";
  metadata?: Record<string, unknown>;
  userId?: number | null;
  productId?: number;
  location?: GeoLocation;
}

let sessionId: string = "";
const geoLocation: GeoLocation = {};
let clientIpAddress: string = "unknown";

function initializeSessionId(): string {
  const stored = localStorage.getItem("analytics_session_id");

  if (stored) {
    return stored;
  }

  const newSessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  localStorage.setItem("analytics_session_id", newSessionId);

  return newSessionId;
}

async function initializeGeoLocation() {
  try {
    // Get browser geo-location (async, non-blocking)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          geoLocation.latitude = position.coords.latitude;
          geoLocation.longitude = position.coords.longitude;
        },
        () => {
          // Silently fail
        },
        { timeout: 5000, enableHighAccuracy: false },
      );
    }

    // Check localStorage for cached geo-location (valid for 24 hours)
    try {
      const cached = localStorage.getItem("analytics_geo_cache");

      if (cached) {
        const cacheData = JSON.parse(cached);
        const cacheAge = Date.now() - cacheData.timestamp;
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

        if (cacheAge < CACHE_DURATION) {
          clientIpAddress = cacheData.ip;
          geoLocation.city = cacheData.city;
          geoLocation.country = cacheData.country_name;

          return; // Use cached data
        }
      }
    } catch (error) {
      // console.debug("Cache read failed:", error);
    }

    // Get IP and city/country from API (with timeout)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();

        clientIpAddress = data.ip || "unknown";
        geoLocation.city = data.city;
        geoLocation.country = data.country_name;

        // Cache the result
        try {
          localStorage.setItem(
            "analytics_geo_cache",
            JSON.stringify({
              ip: data.ip,
              city: data.city,
              country_name: data.country_name,
              timestamp: Date.now(),
            }),
          );
        } catch (cacheError) {
          // console.debug("Cache write failed:", cacheError);
        }
      }
    } catch (error) {
      // Silently fail - geo-location is optional
      // console.debug("Geo-location fetch failed:", error);
    }
  } catch (error) {
    // Initialization errors are non-blocking
    // console.debug("Geo-location initialization error:", error);
  }
}

/**
 * Initialize analytics tracker
 * Call once on app startup
 */
export function initializeAnalytics() {
  sessionId = initializeSessionId();
  initializeGeoLocation();
}

/**
 * Get current session ID
 */
export function getSessionId(): string {
  return sessionId || initializeSessionId();
}

/**
 * Get current geo-location data
 */
export function getGeoLocation(): GeoLocation {
  return geoLocation;
}

/**
 * Get current IP address
 */
export function getClientIpAddress(): string {
  return clientIpAddress;
}

/**
 * Track a page view
 */
export async function trackPageView(
  apiUrl: string,
  organisationId: number,
  pageType: "about" | "contact" | "store" | "storefront" | "product-page",
  userId?: number,
  productId?: number,
) {
  try {
    const payload: TrackPageViewPayload = {
      pageType,
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
      ipAddress: clientIpAddress,
      referer: document.referrer || undefined,
      userId: userId || null,
      productId,
      location: geoLocation,
    };

    await fetch(
      `${apiUrl}/seller/${organisationId}/analytics/track-page-view`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
  } catch (error) {
    // console.error("Failed to track page view:", error);
  }
}

/**
 * Track page view duration when user leaves
 */
export function trackPageViewDuration(
  apiUrl: string,
  organisationId: number,
  pageType: "about" | "contact" | "store" | "storefront" | "product-page",
  viewDuration: number,
  productId?: number,
) {
  if (viewDuration <= 0) return;

  const payload: TrackPageViewPayload = {
    pageType,
    sessionId: getSessionId(),
    userAgent: navigator.userAgent,
    ipAddress: clientIpAddress,
    viewDuration,
    userId: null,
    productId,
    location: geoLocation,
  };

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      `${apiUrl}/seller/${organisationId}/analytics/track-page-view`,
      JSON.stringify(payload),
    );
  }
}

/**
 * Track a user event
 */
export async function trackUserEvent(
  apiUrl: string,
  organisationId: number,
  eventType: string,
  pageType?: "about" | "contact",
  metadata?: Record<string, unknown>,
  userId?: number,
) {
  try {
    const payload: TrackEventPayload = {
      eventType,
      sessionId: getSessionId(),
      userAgent: navigator.userAgent,
      ipAddress: clientIpAddress,
      pageType,
      metadata,
      userId: userId || null,
      location: geoLocation,
    };

    await fetch(`${apiUrl}/seller/${organisationId}/analytics/track-event`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // console.error("Failed to track event:", error);
  }
}

/**
 * Track contact form submission
 */
export async function trackContactFormSubmit(
  apiUrl: string,
  organisationId: number,
  userId?: number,
) {
  await trackUserEvent(
    apiUrl,
    organisationId,
    "contact_form_submit",
    "contact",
    undefined,
    userId,
  );
}

/**
 * Track contact info click
 */
export async function trackContactInfoClick(
  apiUrl: string,
  organisationId: number,
  contactType: string,
  userId?: number,
) {
  await trackUserEvent(
    apiUrl,
    organisationId,
    "contact_info_click",
    "contact",
    { contactType },
    userId,
  );
}

/**
 * Track social link click
 */
export async function trackSocialLinkClick(
  apiUrl: string,
  organisationId: number,
  platform: string,
  userId?: number,
) {
  await trackUserEvent(
    apiUrl,
    organisationId,
    "social_link_click",
    "about",
    { platform },
    userId,
  );
}
