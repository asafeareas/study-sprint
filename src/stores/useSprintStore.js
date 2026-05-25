import { create } from 'zustand'
import { calculateXpPreview } from '../utils/xp'

const initialState = {
  sessionId: null,
  status: 'idle',
  duration: 25,
  durationSeconds: 25 * 60,
  elapsed: 0,
  subject: '',
  xpPreview: 50,
}

export const useSprintStore = create((set, get) => ({
  ...initialState,

  configure: ({ subject = '', duration = 25, currentStreak = 0 }) => {
    const durationSeconds = duration * 60
    set({
      subject,
      duration,
      durationSeconds,
      elapsed: 0,
      status: 'idle',
      sessionId: null,
      xpPreview: calculateXpPreview(duration, currentStreak),
    })
  },

  setSessionId: (sessionId) => set({ sessionId }),

  startSprint: () =>
    set({
      status: 'running',
      elapsed: 0,
    }),

  pauseSprint: () => set({ status: 'paused' }),

  resumeSprint: () => set({ status: 'running' }),

  completeSprint: () =>
    set({
      status: 'completed',
      elapsed: get().durationSeconds,
    }),

  abandonSprint: () => set({ status: 'idle', sessionId: null, elapsed: 0 }),

  tick: () => {
    const { status, elapsed, durationSeconds } = get()
    if (status !== 'running') return

    const next = elapsed + 1
    if (next >= durationSeconds) {
      set({ elapsed: durationSeconds, status: 'completed' })
    } else {
      set({ elapsed: next })
    }
  },

  reset: () => set({ ...initialState }),
}))
