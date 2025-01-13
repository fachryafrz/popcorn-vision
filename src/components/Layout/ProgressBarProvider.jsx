"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function Providers({ children }) {
  return (
    <>
      {children}
      <ProgressBar
        color="#0278FD"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
