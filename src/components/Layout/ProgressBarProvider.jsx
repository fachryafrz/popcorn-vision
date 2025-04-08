"use client";

import { AppProgressProvider as ProgressBar } from "@bprogress/next";

const ProgressProvider = ({ children }) => {
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

export default ProgressProvider;
