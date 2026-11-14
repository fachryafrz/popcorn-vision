"use client";

import React from "react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { AdminNav } from "./admin-nav";
import { ServerManagementTable } from "./server-management-table";
import { ShieldAlert, Server, Loader2 } from "lucide-react";
import Link from "next/link";

export function AdminServersClient() {
  const session = authClient.useSession();
  const isLoggedIn = Boolean(session.data?.user);

  const currentUserProfile = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip",
  );

  if (!isLoggedIn || currentUserProfile === undefined) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <span className="text-sm font-semibold text-zinc-400">
          Checking permissions...
        </span>
      </div>
    );
  }

  const role = currentUserProfile?.role ?? "user";
  const isAuthorized = role === "owner" || role === "admin";

  if (!isAuthorized) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mb-4 inline-flex rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-400">
          <ShieldAlert className="h-10 w-10" />
        </div>
        <h1 className="mb-2 text-2xl font-black tracking-tight text-white">
          Access Denied
        </h1>
        <p className="mb-6 text-sm text-zinc-400">
          You do not have permission to access Streaming Servers. Only platform
          Owners and Admins can access this area.
        </p>
        <Link
          href="/"
          className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8 pt-24">
      {/* Top Banner */}
      <div className="flex flex-col gap-2 border-b border-zinc-800/80 pb-6">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2 text-amber-400">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Streaming Servers
            </h1>
            <p className="text-xs text-zinc-400">
              Manage video playback sources, server availability, and display order for movies and TV shows.
            </p>
          </div>
        </div>
      </div>

      {/* Admin Subnav */}
      <AdminNav />

      {/* Main Server Management Table */}
      <ServerManagementTable />
    </div>
  );
}
