"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useKeyboardShortcutsStore } from "@/hooks/use-keyboard-shortcuts-store";
import { useIsMac } from "@/hooks/use-is-mac";
import {
  Compass,
  Film,
  Search,
  Command,
} from "lucide-react";

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutSection {
  title: string;
  icon: React.ReactNode;
  shortcuts: ShortcutItem[];
}

export function KeyboardShortcutsModal() {
  const { isOpen, close } = useKeyboardShortcutsStore();
  const isMac = useIsMac();

  const sections: ShortcutSection[] = [
    {
      title: "Navigation",
      icon: <Compass className="h-4 w-4 text-rose-400" />,
      shortcuts: [
        { keys: ["G", "H"], description: "Go to Home" },
        { keys: ["G", "F"], description: "Go to Feed" },
        { keys: ["G", "L"], description: "Go to Lists" },
        { keys: ["G", "C"], description: "Go to Chats" },
        { keys: ["G", "P"], description: "Go to My Profile" },
        { keys: ["G", "W"], description: "Go to My Watchlist" },
        { keys: ["G", "V"], description: "Go to My Favorites" },
        { keys: ["G", "D"], description: "Go to My Diary" },
        { keys: ["G", "S"], description: "Go to Settings" },
      ],
    },
    {
      title: "Media Actions (Movie / TV Page)",
      icon: <Film className="h-4 w-4 text-amber-400" />,
      shortcuts: [
        { keys: ["W"], description: "Toggle Watchlist" },
        { keys: ["F"], description: "Toggle Favorite" },
        { keys: ["L"], description: "Open Log / Review Modal" },
      ],
    },
    {
      title: "Search & Discovery",
      icon: <Search className="h-4 w-4 text-sky-400" />,
      shortcuts: [
        { keys: [isMac ? "⌘" : "Ctrl", "K"], description: "Toggle Search Overlay" },
        { keys: ["/"], description: "Quick Search" },
        { keys: ["Tab"], description: "Switch Category Filter" },
        { keys: ["↑", "↓"], description: "Navigate Search Results" },
        { keys: ["↵"], description: "Select Result" },
      ],
    },
    {
      title: "General",
      icon: <Command className="h-4 w-4 text-emerald-400" />,
      shortcuts: [
        { keys: ["?"], description: "Open Keyboard Shortcuts" },
        { keys: ["Esc"], description: "Close Active Modal / Overlay" },
      ],
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent className="max-h-[85vh] w-[calc(100%-2rem)] max-w-2xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-2xl backdrop-blur-xl">
        <DialogHeader className="border-b border-zinc-800/80 pb-4">
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-white">
            <Command className="h-5 w-5 text-primary" />
            <span>Keyboard Shortcuts</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Speed up your experience across Popcorn Vision with quick keyboard shortcuts.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-6 pt-2 md:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-zinc-400 uppercase">
                {section.icon}
                <span>{section.title}</span>
              </div>
              <div className="flex flex-col divide-y divide-zinc-800/50 rounded-2xl border border-zinc-800/70 bg-zinc-900/40 p-1">
                {section.shortcuts.map((shortcut, idx) => (
                  <div
                    key={`${shortcut.description}-${idx}`}
                    className="flex items-center justify-between px-3 py-2 text-xs"
                  >
                    <span className="text-zinc-300 font-medium">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((k, kIdx) => (
                        <kbd
                          key={`${k}-${kIdx}`}
                          className="flex min-w-5 items-center justify-center rounded-md border border-zinc-700/80 bg-zinc-800 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-zinc-200 shadow-xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
