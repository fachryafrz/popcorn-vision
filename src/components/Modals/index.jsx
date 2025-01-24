"use client";

import LoginAlert from "./LoginAlert";
import HoverCard from "./HoverCard";
import { userStore } from "@/zustand/userStore";

export default function Modal() {
  const { user } = userStore();

  return (
    <>
      {!user && <LoginAlert />}

      <HoverCard />
    </>
  );
}
