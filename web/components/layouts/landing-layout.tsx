import { LandingHeader } from "@/components/headers/landing-header";
import { LandingFooter } from "@/components/footers/landing-footer";

export function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1 w-full">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
