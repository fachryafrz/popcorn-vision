import { create } from "zustand";

export const useConfetti = create((set) => ({
  confetti: false,
  setConfetti: (confetti) => set({ confetti }),
}));
