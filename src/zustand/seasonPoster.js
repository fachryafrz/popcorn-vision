import { create } from "zustand";

export const useSeasonPoster = create((set) => ({
  poster: [],
  setSeasonPoster: (update) =>
    set((state) => ({
      poster: typeof update === "function" ? update(state.poster) : update,
    })),
}));
