"use client";

import { useAuth } from "@/hooks/auth";
import LoginAlert from "./LoginAlert";
import HoverCard from "./HoverCard";

export default function Modal() {
  const { user } = useAuth();

  return (
    <>
      {!user && <LoginAlert />}

      <HoverCard />
    </>
  );
}
