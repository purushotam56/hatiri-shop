import { HomePage } from "@/components/home-page";
import { StoreHomePage } from "@/components/store-home-page";
import { headers } from "next/headers";

interface Organisation {
  id: number;
  name: string;
  organisationUniqueCode: string;
  currency: string;
}

async function fetchOrganisations(): Promise<Organisation[]> {
  try {
    const res = await fetch("http://localhost:3333/api/organisations", {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
    });
    if (res.ok) {
      const data = await res.json();
      const mappedOrgs = (data.organisations || []).map((org: any) => ({
        id: org.id,
        name: org.organisationName,
        organisationUniqueCode: org.organisationUniqueCode,
        currency: org.currency || "USD",
      }));
      return mappedOrgs;
    }
  } catch (error) {
    console.error("Failed to fetch organisations:", error);
  }
  return [];
}

function getSubdomainCode(hostname: string): string | null {
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
    return <StoreHomePage storeCode={subdomainCode} />;
  }

  // Otherwise render home page with all organisations
  const organisations = await fetchOrganisations();
  return <HomePage organisations={organisations} />;
}
