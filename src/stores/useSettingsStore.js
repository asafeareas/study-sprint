import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
  persist(
    (set) => ({
      timerSound: true,
      tickSound: false,
      browserNotifications: false,

      setTimerSound: (timerSound) => set({ timerSound }),
      setTickSound: (tickSound) => set({ tickSound }),
      setBrowserNotifications: (browserNotifications) => set({ browserNotifications }),
    }),
    { name: 'study-sprint-settings' },
  ),
)
