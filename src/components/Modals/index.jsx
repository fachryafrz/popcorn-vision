"use client";

import LoginAlert from "./LoginAlert";
import HoverCard from "./HoverCard";
import { userStore } from "@/zustand/userStore";
import Streaming from "./Streaming";
import { usePathname } from "next/navigation";

export default function Modal() {
  const { user } = userStore();
  const pathname = usePathname();

  const isFilmPage =
    pathname.startsWith("/movies") ||
    pathname.startsWith("/tv") ||
    pathname !== "/tv";
  return (
    <>
      {!user && <LoginAlert />}

      <HoverCard />

      {isFilmPage && <Streaming />}
    </>
  );
}
