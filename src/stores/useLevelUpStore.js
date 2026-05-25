import { create } from 'zustand'

export const useLevelUpStore = create((set) => ({
  overlay: null,
  show: (data) => set({ overlay: data }),
  hide: () => set({ overlay: null }),
}))
