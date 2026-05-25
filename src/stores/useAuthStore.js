import { create } from 'zustand'

const STORAGE_KEY = 'study-sprint-auth'

function loadStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.token) return null
    return parsed
  } catch {
    return null
  }
}

const stored = loadStoredAuth()

export const useAuthStore = create((set) => ({
  user: stored?.user ?? null,
  token: stored?.token ?? null,
  isAuthenticated: Boolean(stored?.token),

  login: (user, token) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ user: null, token: null, isAuthenticated: false })
  },

  setUser: (user) => {
    const token = useAuthStore.getState().token
    if (token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
    }
    set({ user })
  },
}))
