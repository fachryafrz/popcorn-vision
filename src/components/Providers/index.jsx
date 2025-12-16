"use client";

import { Suspense, useEffect } from "react";
import ProgressProvider from "../Layout/ProgressBarProvider";
import { useToggleFilter } from "@/zustand/toggleFilter";
import UserLocation from "../User/Location";
import UserProvider from "./UserProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function Providers({ children }) {
  const { setToggleFilter } = useToggleFilter();

  // Handle toggle filter for search page
  useEffect(() => {
    if (window.innerWidth >= 1280) {
      setToggleFilter(true);
    } else {
      setToggleFilter(false);
    }
  }, []);

  return (
    <NuqsAdapter>
      <ProgressProvider>
        <UserProvider>
          <UserLocation>
            <Suspense>{children}</Suspense>
          </UserLocation>
        </UserProvider>
      </ProgressProvider>
    </NuqsAdapter>
  );
}
