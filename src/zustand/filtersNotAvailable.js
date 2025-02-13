import { create } from "zustand";

export const useFiltersNotAvailable = create((set) => ({
  filtersNotAvailable: false,
  setFiltersNotAvailable: (filtersNotAvailable) => set({ filtersNotAvailable }),
}))