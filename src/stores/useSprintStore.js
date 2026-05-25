import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

export const useSprintStore = create(
  persist(
    (set, get) => ({
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
          elapsed: get().elapsed || 0,
        }),

      pauseSprint: () => set({ status: 'paused' }),

      resumeSprint: () => set({ status: 'running' }),

      completeSprint: () =>
        set({
          status: 'completed',
          elapsed: get().durationSeconds,
        }),

      abandonSprint: () =>
        set({ status: 'idle', sessionId: null, elapsed: 0 }),

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

      hasPersistedSession: () => {
        const { sessionId, status } = get()
        return Boolean(sessionId && (status === 'running' || status === 'paused'))
      },
    }),
    {
      name: 'study-sprint-timer',
      partialize: (state) => {
        if (!state.sessionId || state.status === 'idle' || state.status === 'completed') {
          return {}
        }
        return {
          sessionId: state.sessionId,
          status: state.status,
          duration: state.duration,
          durationSeconds: state.durationSeconds,
          elapsed: state.elapsed,
          subject: state.subject,
          xpPreview: state.xpPreview,
        }
      },
    },
  ),
)
