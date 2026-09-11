"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth-client";
import { useAuthModalStore } from "@/lib/auth-modal-store";
import { useSearchOverlayStore } from "./use-search-overlay-store";
import { useKeyboardShortcutsStore } from "./use-keyboard-shortcuts-store";

function isEditableElement(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) {
    return false;
  }
  const tagName = target.tagName.toUpperCase();
  return (
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT" ||
    target.isContentEditable ||
    Boolean(target.closest('[role="dialog"], [role="menu"], [role="listbox"]'))
  );
}

export function useGlobalShortcuts() {
  const router = useRouter();
  const session = authClient.useSession();
  const isLoggedIn = Boolean(session.data?.user);
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isLoggedIn ? {} : "skip",
  );
  const openAuth = useAuthModalStore((state) => state.open);
  const { open: openSearchOverlay, isOpen: isSearchOpen } =
    useSearchOverlayStore();
  const {
    open: openShortcuts,
    close: closeShortcuts,
    isOpen: isShortcutsOpen,
  } = useKeyboardShortcutsStore();

  const gPressedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow Escape to close keyboard shortcuts dialog
      if (e.key === "Escape" && isShortcutsOpen) {
        e.preventDefault();
        closeShortcuts();
        return;
      }

      // Ignore shortcuts when typing in inputs/textareas or when modals are active
      if (isEditableElement(e.target)) {
        return;
      }

      // If search overlay is already open, do not handle global navigation shortcuts
      if (isSearchOpen) {
        return;
      }

      // Toggle shortcuts help dialog: '?' or 'Shift + /'
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        if (isShortcutsOpen) {
          closeShortcuts();
        } else {
          openShortcuts();
        }
        return;
      }

      // Quick Search Overlay: '/' key
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        openSearchOverlay();
        return;
      }

      // Navigation sequences: 'G' followed by second key
      const key = e.key.toLowerCase();
      if (!gPressedRef.current) {
        if (key === "g" && !e.ctrlKey && !e.metaKey && !e.altKey) {
          gPressedRef.current = true;
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            gPressedRef.current = false;
          }, 1000);
        }
        return;
      }

      // 'G' was pressed earlier within the 1-second window
      gPressedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const username = currentUser?.username;

      switch (key) {
        case "h":
          e.preventDefault();
          router.push("/");
          break;
        case "f":
          e.preventDefault();
          router.push("/feed");
          break;
        case "l":
          e.preventDefault();
          router.push("/lists");
          break;
        case "c":
          e.preventDefault();
          if (isLoggedIn) {
            router.push("/chat");
          } else {
            openAuth();
          }
          break;
        case "p":
          e.preventDefault();
          if (isLoggedIn && username) {
            router.push(`/@${username}`);
          } else {
            openAuth();
          }
          break;
        case "w":
          e.preventDefault();
          if (isLoggedIn && username) {
            router.push(`/@${username}?tab=watchlist`);
          } else {
            openAuth();
          }
          break;
        case "v":
          e.preventDefault();
          if (isLoggedIn && username) {
            router.push(`/@${username}?tab=favorites`);
          } else {
            openAuth();
          }
          break;
        case "d":
          e.preventDefault();
          if (isLoggedIn && username) {
            router.push(`/@${username}?tab=diary`);
          } else {
            openAuth();
          }
          break;
        case "s":
          e.preventDefault();
          if (isLoggedIn) {
            router.push("/settings");
          } else {
            openAuth();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [
    router,
    isLoggedIn,
    currentUser,
    openAuth,
    openSearchOverlay,
    openShortcuts,
    closeShortcuts,
    isShortcutsOpen,
    isSearchOpen,
  ]);
}
