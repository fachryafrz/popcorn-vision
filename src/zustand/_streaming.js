import { create } from "zustand";

export const useStreaming = create((set) => ({
  isStreaming: false,
  setIsStreaming: (isStreaming) => set({ isStreaming }),

  mediaType: null,
  setMediaType: (mediaType) => set({ mediaType }),

  chapter: {
    season: 1,
    episode: 1,
  },
  setChapter: (chapter) => set({ chapter }),
}));
