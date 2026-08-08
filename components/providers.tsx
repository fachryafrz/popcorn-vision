"use client";

import { ReactNode } from "react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ConvexBetterAuthProvider, type AuthClient } from "@convex-dev/better-auth/react";
import { authClient } from "@/lib/auth-client";
import { TooltipProvider } from "./ui/tooltip";
import { PersonalizationProvider } from "./theme-provider";
import { ConfirmProvider } from "./ui/confirm-provider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <ConvexBetterAuthProvider client={convex} authClient={authClient as unknown as AuthClient}>
        <PersonalizationProvider>
          <ConfirmProvider>
            <TooltipProvider>
              <NuqsAdapter>{children}</NuqsAdapter>
            </TooltipProvider>
          </ConfirmProvider>
        </PersonalizationProvider>
      </ConvexBetterAuthProvider>
    </ConvexProvider>
  );
}
