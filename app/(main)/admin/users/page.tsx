"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { UserManagementTable } from "@/components/admin/user-management-table";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const session = authClient.useSession();
  const isLoggedIn = !!session.data?.user;

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

  const role = currentUserProfile?.role || "user";
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
          You do not have permission to view the User Management console. Only
          platform Owners and Admins can access this area.
        </p>
        <Link href="/">
          <Button variant="default" className="rounded-xl font-bold">
            Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl space-y-8 px-4 py-8 pt-24">
      {/* Top Banner */}
      <div className="flex flex-col gap-2 border-b border-zinc-800/80 pb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-amber-400" />
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            User Management Console
          </h1>
        </div>
        <p className="text-xs text-zinc-400">
          Manage member roles, review status, suspend or ban problematic
          accounts.
        </p>
      </div>

      {/* Main Table Component */}
      <UserManagementTable currentUserRole={role} />
    </div>
  );
}
