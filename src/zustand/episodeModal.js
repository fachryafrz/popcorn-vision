import { create } from "zustand";

export const useEpisodeModal = create((set) => ({
  episode: null,
  setEpisodeModal: (episode) => set({ episode }),
}));
