import { useEffect, useRef } from 'react'

export function useTimerBeep(remainingSeconds, enabled) {
  const ctxRef = useRef(null)
  const lastBeepRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    if (remainingSeconds > 0 && remainingSeconds <= 5) {
      if (lastBeepRef.current === remainingSeconds) return
      lastBeepRef.current = remainingSeconds

      try {
        if (!ctxRef.current) {
          ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
        }
        const ctx = ctxRef.current
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = 880
        osc.type = 'sine'
        gain.gain.setValueAtTime(0.08, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.15)
      } catch {
        // Web Audio não disponível
      }
    } else if (remainingSeconds > 5) {
      lastBeepRef.current = null
    }
  }, [remainingSeconds, enabled])
}
