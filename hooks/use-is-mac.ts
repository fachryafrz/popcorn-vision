import { useSyncExternalStore } from "react";

function checkIsMac(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return true;
  }

  const nav = navigator as Navigator & {
    userAgentData?: { platform?: string };
  };
  const platform =
    nav.userAgentData?.platform ||
    navigator.platform ||
    navigator.userAgent ||
    "";

  return /Mac|iPhone|iPod|iPad/i.test(platform);
}

const subscribe = () => () => {};

export function useIsMac(): boolean {
  return useSyncExternalStore(
    subscribe,
    checkIsMac,
    () => true,
  );
}
