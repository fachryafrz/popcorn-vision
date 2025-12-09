"use client";

import { useAuth } from "@/hooks/auth";
import { userStore } from "@/zustand/userStore";
import { useEffect } from "react";

export default function UserProvider({ children }) {
  const { setUser } = userStore();
  const { user } = useAuth();

  // Handle user
  useEffect(() => {
    if (!user) setUser(null);

    setUser(user);
  }, [user]);

  return children;
}
