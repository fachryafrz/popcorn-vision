import { Suspense } from "react";
import ProgressProvider from "../Layout/ProgressBarProvider";

export default function Providers({ children }) {
  return (
    <ProgressProvider>
      <Suspense>{children}</Suspense>
    </ProgressProvider>
  );
}
