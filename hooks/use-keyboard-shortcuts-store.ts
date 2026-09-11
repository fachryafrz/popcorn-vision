import { create } from "zustand";

interface KeyboardShortcutsState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useKeyboardShortcutsStore = create<KeyboardShortcutsState>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
  }),
);
