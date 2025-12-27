export default async function StorePagesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ code?: string }>;
}) {
  return <>{children}</>;
}
