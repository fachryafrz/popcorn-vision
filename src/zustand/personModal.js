import { create } from "zustand";

export const usePersonModal = create((set) => ({
  person: null,
  setPersonModal: (person) => set({ person }),
}));
