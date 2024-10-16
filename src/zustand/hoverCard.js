import debounce from "debounce";
import { create } from "zustand";

export const useHoverCard = create((set) => {
  const debounced = debounce((e, film) => {
    set({ card: film });
    set({ position: e.target.getBoundingClientRect() });
  }, 400);

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
