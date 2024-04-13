import { create } from "zustand";

export const useSeasonPoster = create((set) => ({
  poster: null,
  setSeasonPoster: (poster) => set({ poster }),
}));
