"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function Providers({ children }) {
  return (
    <>
      {children}
      <ProgressBar
        height="2px"
        color="#0278FD"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
