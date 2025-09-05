import type { Metadata } from "next";
import { appConfig } from "@/lib/config.client";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: `${appConfig.name} - Admin`,
  description: appConfig.description,
};

// Enable faster navigation with static generation where possible
export const dynamic = "force-dynamic"; // Still need auth check
export const revalidate = 0; // Don't cache auth-dependent content

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SidebarProvider>
      <AdminSidebar user={session?.user} />
      {children}
    </SidebarProvider>
  );
}
