import { create } from 'zustand'

export const useAchievementToastStore = create((set) => ({
  queue: [],

  pushAchievements: (achievements) => {
    if (!achievements?.length) return
    set((state) => ({
      queue: [
        ...state.queue,
        ...achievements.map((a) => ({ ...a, id: `${a.key || a._id}-${Date.now()}-${Math.random()}` })),
      ],
    }))
  },

  dismiss: (id) =>
    set((state) => ({
      queue: state.queue.filter((t) => t.id !== id),
    })),
}))
