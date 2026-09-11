"use client";

import { useGlobalShortcuts } from "@/hooks/use-global-shortcuts";
import { KeyboardShortcutsModal } from "./keyboard-shortcuts-modal";

export function GlobalKeyboardShortcuts() {
  useGlobalShortcuts();

  return <KeyboardShortcutsModal />;
}
