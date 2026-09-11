import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminUsersClient } from "@/components/admin/admin-users-client";
import { Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `User Management — ${siteConfig.name}`,
  description: "User management console and access control.",
};

export default function AdminUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[70vh] flex-col items-center justify-center gap-3">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-sm font-semibold text-zinc-400">
            Loading user management...
          </span>
        </div>
      }
    >
      <AdminUsersClient />
    </Suspense>
  );
}
