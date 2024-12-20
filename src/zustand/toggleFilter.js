import { create } from "zustand";

export const useToggleFilter = create((set) => ({
  toggleFilter: null,
  setToggleFilter: (toggleFilter) => set({ toggleFilter }),
}));
