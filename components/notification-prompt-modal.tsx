"use client";

import { useState, useEffect } from "react";
import { Bell, ShieldCheck, BellRing, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { STORAGE_KEYS } from "@/lib/constants";

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
  } = usePushNotifications(isLoggedIn);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoggedIn || !isSupported) return;

    // Check if prompt was dismissed
    const isDismissed =
      localStorage.getItem(STORAGE_KEYS.DISMISSED_PUSH_PROMPT) === "true" ||
      localStorage.getItem(STORAGE_KEYS.LEGACY_DISMISSED_PUSH_PROMPT) === "true";

    if (isDismissed) return;

    // Show modal if permission is default and user not subscribed
    if (permission === "default" && !isSubscribed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, isSupported, permission, isSubscribed]);

  const handleEnable = async () => {
    const success = await subscribe();
    if (success) {
      setIsOpen(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEYS.DISMISSED_PUSH_PROMPT, "true");
    localStorage.removeItem(STORAGE_KEYS.LEGACY_DISMISSED_PUSH_PROMPT);
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
        </div>
      </div>
    </div>
  );
}
