import { create } from "zustand";

export const useLocation = create((set) => ({
  location: null,
  setLocation: (location) => set({ location }),
}));
