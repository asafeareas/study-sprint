import { create } from 'zustand'

export const useSprintStore = create((set) => ({
  isActive: false,
  timeRemaining: 25 * 60,
  xpEarned: 0,

  startSprint: () => set({ isActive: true }),
  stopSprint: () => set({ isActive: false }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  addXp: (amount) => set((state) => ({ xpEarned: state.xpEarned + amount })),
  reset: () => set({ isActive: false, timeRemaining: 25 * 60, xpEarned: 0 }),
}))
