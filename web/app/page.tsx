import { HomePage } from "@/components/home-page";
import { StoreHomePage } from "@/components/store-home-page";
import { LandingLayout } from "@/components/layouts/landing-layout";
import { StoreLayout } from "@/components/layouts/store-layout";
import { headers } from "next/headers";
import { apiEndpoints } from "@/lib/api-client";

interface Organisation {
  id: number;
  name: string;
  organisationUniqueCode: string;
  currency: string;
}

async function fetchOrganisations(): Promise<Organisation[]> {
  try {
    const data = await apiEndpoints.getOrganisations();
    const mappedOrgs = (data.organisations || []).map((org: any) => ({
      id: org.id,
      name: org.organisationName,
      organisationUniqueCode: org.organisationUniqueCode,
      currency: org.currency || "USD",
    }));
    return mappedOrgs;
  } catch (error) {
    console.error("Failed to fetch organisations:", error);
  }
  return [];
}

function getSubdomainCode(hostname: string): string | null {
  // Check if it's an IP address (no subdomain support for IPs)
  if (/^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    return null;
  }

  const parts = hostname.split(".");
  
  // Check if it's a subdomain (not localhost, not www, not main domain)
  if (parts.length >= 3 && parts[0] !== "localhost" && parts[0] !== "www") {
    return parts[0].toUpperCase();
  }
  
  return null;
}

export default async function Home() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  
  // Check if URL contains a subdomain with org code
  const subdomainCode = getSubdomainCode(host);

  if (subdomainCode) {
    // Render store page for subdomain
    return (
      <StoreLayout storeCode={subdomainCode}>
        <StoreHomePage storeCode={subdomainCode} />
      </StoreLayout>
    );
  }

  // Otherwise render home page with all organisations
  const organisations = await fetchOrganisations();
  return (
    <LandingLayout>
      <HomePage organisations={organisations} hostname={host} />
    </LandingLayout>
  );
}
