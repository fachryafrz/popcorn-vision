import { debounce } from "@mui/material";
import { create } from "zustand";

export const useHoverCard = create((set) => {
  const debounced = debounce((film, position) => {
    set({ card: film });
    set({ position });
  }, 1000);

  return {
    card: null,
    setHoverCard: (card) => set({ card }),
    position: null,
    setPosition: (position) => set({ position }),
    handleMouseOver: debounced,
    handleMouseLeave: () => {
      set({ card: null });
      set({ position: null });
      debounced.clear();
    },
  };
});
