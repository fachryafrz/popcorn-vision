import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminServersClient } from "@/components/admin/admin-servers-client";
import { Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `Streaming Servers | ${siteConfig.name}`,
  description: "Configure and manage video embed providers and streaming servers.",
};

export default function AdminServersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[70vh] flex-col items-center justify-center gap-3">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
          <span className="text-sm font-semibold text-zinc-400">
            Loading streaming servers...
          </span>
        </div>
      }
    >
      <AdminServersClient />
    </Suspense>
  );
}
