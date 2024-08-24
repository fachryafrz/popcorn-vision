"use client";

import { useAuth } from "@/hooks/auth";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function UserLayout({ children }) {
  const searchParams = useSearchParams();

  const { user } = useAuth({
    middleware: "guest",
    redirectIfAuthenticated: searchParams.get("redirect_to") || "/",
  });

  return <>{children}</>;
}
