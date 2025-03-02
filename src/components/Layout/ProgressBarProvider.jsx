"use client";

import { AppProgressProvider as ProgressBar } from "@bprogress/next";

const Providers = ({ children }) => {
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
};

export default Providers;
