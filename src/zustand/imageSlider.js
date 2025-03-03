import { create } from "zustand";

export const useImageSlider = create((set) => ({
  images: [],
  setImages: (images) => set({ images }),

  selectedIndex: 0,
  setSelectedIndex: (selectedIndex) => set({ selectedIndex }),

  open: false,
  setOpen: (open) => set({ open }),
}));
