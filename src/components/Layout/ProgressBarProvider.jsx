"use client";

import { AppProgressProvider as ProgressBar } from "@bprogress/next";

const ProgressProvider = ({ children }) => {
  return (
    <ProgressBar
      height="2px"
      color="#0278FD"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressBar>
  );
};

export default ProgressProvider;
