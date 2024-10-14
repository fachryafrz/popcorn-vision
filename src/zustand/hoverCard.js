import { create } from "zustand";

export const useHoverCard = create((set) => ({
  card: null,
  setHoverCard: (card) => set({ card }),
  position: null,
  setPosition: (position) => set({ position }),
}));
