"use client";

import { useAuth } from "@/hooks/auth";
import React from "react";

export default function UserLayout({ children }) {
  const { user } = useAuth({
    middleware: "auth",
  });

  if (user) {
    return <div>{children}</div>;
  }
}
