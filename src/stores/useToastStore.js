import { create } from 'zustand'

const MAX_TOASTS = 3

let idCounter = 0

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = ++idCounter
    const entry = { id, ...toast }

    set((state) => {
      const next = [...state.toasts, entry]
      return { toasts: next.slice(-MAX_TOASTS) }
    })

    return id
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}))
