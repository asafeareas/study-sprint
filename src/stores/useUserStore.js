import { create } from 'zustand'

export const useUserStore = create((set) => ({
  stats: null,
  achievements: [],

  setStats: (stats) => set({ stats }),
  setAchievements: (achievements) => set({ achievements }),
}))
