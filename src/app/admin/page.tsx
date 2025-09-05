import { auth } from "@/lib/auth";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Users } from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  await auth();

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Admin Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="max-w-md">
          <Link
            href="/admin/users"
            prefetch={true}
            className="bg-card hover:bg-accent/50 block rounded-xl border p-6 transition-colors"
          >
            <div className="mb-3 flex items-center gap-3">
              <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
                <Users className="text-primary h-4 w-4" />
              </div>
              <h3 className="font-medium">User Management</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Manage users, permissions, and access control
            </p>
          </Link>
        </div>
      </div>
    </SidebarInset>
  );
}
