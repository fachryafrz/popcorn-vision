import { CookiesProvider } from "next-client-cookies/server";
import ProgressProvider from "../Layout/ProgressBarProvider";

export default function Providers({ children }) {
  return (
    <CookiesProvider>
      <ProgressProvider>{children}</ProgressProvider>
    </CookiesProvider>
  );
}
