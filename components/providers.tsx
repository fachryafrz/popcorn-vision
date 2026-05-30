"use client";

import { ReactNode } from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { TooltipProvider } from "./ui/tooltip";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ConvexBetterAuthProvider client={convex} authClient={authClient}>
        <TooltipProvider>{children}</TooltipProvider>
      </ConvexBetterAuthProvider>
    </ConvexProvider>
  );
}
