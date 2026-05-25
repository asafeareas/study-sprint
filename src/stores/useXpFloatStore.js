import { create } from 'zustand'

let floatId = 0

export const useXpFloatStore = create((set) => ({
  floats: [],

  spawn: (amount, x = '50%', y = '40%') => {
    const id = ++floatId
    set((state) => ({
      floats: [...state.floats, { id, amount, x, y }],
    }))
    setTimeout(() => {
      set((state) => ({
        floats: state.floats.filter((f) => f.id !== id),
      }))
    }, 1600)
  },
}))
