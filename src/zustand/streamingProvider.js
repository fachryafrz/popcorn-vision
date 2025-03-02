import { create } from "zustand";

export const useStreamingProvider = create((set) => ({
  streamingProvider: "VidLink",
  setStreamingProvider: (streamingProvider) => set({ streamingProvider }),
}));
