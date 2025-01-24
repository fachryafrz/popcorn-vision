import { create } from "zustand";

export const userStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
