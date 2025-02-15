import debounce from "debounce";
import { create } from "zustand";

export const useHoverCard = create((set) => {
  const debounced = debounce((film) => {
    set({ card: film });
  }, 800);

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
