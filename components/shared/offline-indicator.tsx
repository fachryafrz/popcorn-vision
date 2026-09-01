"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { WifiOff, CheckCircle2, RefreshCw } from "lucide-react";
import { haptics } from "@/lib/haptics";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export function OfflineIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [showReconnected, setShowReconnected] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const handleOnline = () => {
      setShowReconnected(true);
      haptics.success();
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setShowReconnected(false);
      }, 3000);
    };

    const handleOffline = () => {
      setShowReconnected(false);
      haptics.warning();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (timer) clearTimeout(timer);
    };
  }, []);

  const handleRetry = async () => {
    haptics.light();
    setIsRetrying(true);
    try {
      await fetch("/favicon.ico", { method: "HEAD", cache: "no-store" });
      window.location.reload();
    } catch {
      haptics.warning();
      setIsRetrying(false);
    }
  };

  if (isOnline && !showReconnected) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9999] pointer-events-none flex justify-center sm:justify-end"
    >
      {!isOnline ? (
        <div className="pointer-events-auto w-full sm:w-auto min-w-[300px] flex items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-2xl rounded-xl px-4 py-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
            </span>
            <WifiOff className="h-4 w-4 text-zinc-400 shrink-0" />
            <span className="text-sm font-medium text-zinc-200 truncate">
              You&apos;re offline
            </span>
          </div>
          <button
            type="button"
            onClick={handleRetry}
            disabled={isRetrying}
            className="shrink-0 text-xs font-semibold text-primary-foreground bg-primary hover:bg-primary/90 disabled:opacity-50 px-3 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`} />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <div className="pointer-events-auto w-full sm:w-auto flex items-center gap-2.5 bg-zinc-900 border border-emerald-500/30 text-emerald-300 shadow-2xl rounded-xl px-4 py-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">Back online</span>
        </div>
      )}
    </div>
  );
}
