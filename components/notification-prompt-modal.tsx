"use client";

import { useState, useEffect } from "react";
import { Bell, ShieldCheck, BellRing, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/use-push-notifications";

interface NotificationPromptModalProps {
  isLoggedIn: boolean;
}

export default function NotificationPromptModal({
  isLoggedIn,
}: NotificationPromptModalProps) {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
  } = usePushNotifications(isLoggedIn);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPermissionReset, setIsPermissionReset] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const subscribedOnDevice =
        localStorage.getItem("push_subscribed_on_device") === "true";
      setIsPermissionReset(
        permission === "default" && isSubscribed && subscribedOnDevice
      );
    }
  }, [permission, isSubscribed]);

  useEffect(() => {
    if (!isLoggedIn || !isSupported) return;

    // Check if prompt was dismissed
    const isDismissed =
      localStorage.getItem("dismissed_push_prompt") === "true";

    if (isDismissed) return;

    // Show modal if permission is default and either:
    // 1. User reset permissions on this device (isPermissionReset)
    // 2. Regular prompt: user not subscribed
    if (permission === "default") {
      if (isPermissionReset || !isSubscribed) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoggedIn, isSupported, permission, isSubscribed, isPermissionReset]);

  const handleEnable = async () => {
    const success = await subscribe();
    if (success) {
      setIsOpen(false);
    }
  };

  const handleDisableBackend = async () => {
    const success = await unsubscribe();
    if (success) {
      localStorage.setItem("dismissed_push_prompt", "true");
      setIsOpen(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem("dismissed_push_prompt", "true");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-300">
      <div className="bg-card relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 p-6 shadow-2xl transition-all duration-300 sm:p-8">
        <button
          onClick={handleDismiss}
          className="text-muted-foreground hover:bg-secondary hover:text-foreground absolute top-4 right-4 rounded-full p-2 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          {isPermissionReset ? (
            <>
              <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shadow-inner">
                <AlertTriangle className="h-8 w-8 animate-pulse" />
              </div>

              <h3 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                Sync Notifications
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                You reset browser notification permissions, but your account is
                still registered to receive them. Would you like to re-enable
                them or clear the registered data?
              </p>

              <div className="mt-6 flex w-full gap-3">
                <Button
                  variant="outline"
                  onClick={handleDisableBackend}
                  disabled={isLoading}
                  className="border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 h-11 flex-1 rounded-xl font-medium transition-all"
                >
                  Disable in App
                </Button>

                <Button
                  onClick={handleEnable}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25 h-11 flex-1 rounded-xl font-semibold shadow-lg transition-all"
                >
                  <BellRing className="mr-2 h-4 w-4" />
                  {isLoading ? "Enabling..." : "Re-enable"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-primary/10 text-primary relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner">
                <Bell className="h-8 w-8" />
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="bg-primary absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
                  <span className="bg-primary relative inline-flex h-3 w-3 rounded-full" />
                </span>
              </div>

              <h3 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                Don&apos;t Miss Chat Messages!
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                Turn on notifications to get instant updates on new messages
                from your friends or groups, even when you aren&apos;t active in
                the app.
              </p>

              <div className="text-muted-foreground bg-secondary/50 border-border/50 mt-4 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>You can disable this anytime in your Settings</span>
              </div>

              <div className="mt-6 flex w-full gap-3">
                <Button
                  onClick={handleEnable}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/25 h-11 flex-1 rounded-xl font-semibold shadow-lg transition-all"
                >
                  <BellRing className="mr-2 h-4 w-4" />
                  {isLoading ? "Enabling..." : "Enable"}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  disabled={isLoading}
                  className="border-border hover:bg-secondary h-11 flex-1 rounded-xl font-medium"
                >
                  Maybe Later
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
