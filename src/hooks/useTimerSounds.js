import { useEffect, useRef } from 'react'
import { useSettingsStore } from '../stores/useSettingsStore'

function getAudioContext(ctxRef) {
  if (!ctxRef.current) {
    ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
  }
  if (ctxRef.current.state === 'suspended') {
    ctxRef.current.resume()
  }
  return ctxRef.current
}

function playTone(ctxRef, frequency, duration = 0.12, volume = 0.06, type = 'sine') {
  try {
    const ctx = getAudioContext(ctxRef)
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = frequency
    osc.type = type
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + duration)
  } catch {
    // ignore
  }
}

function playFanfare(ctxRef) {
  const notes = [523, 659, 784, 1047]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(ctxRef, freq, 0.2, 0.08), i * 120)
  })
}

export function useTimerSounds({ remainingSeconds, elapsed, status, prevStatusRef }) {
  const timerSound = useSettingsStore((s) => s.timerSound)
  const tickSound = useSettingsStore((s) => s.tickSound)
  const ctxRef = useRef(null)
  const lastTickRef = useRef(null)
  const lastAlertRef = useRef(null)
  const completedPlayedRef = useRef(false)

  useEffect(() => {
    if (!timerSound || status !== 'running') return

    if (tickSound && elapsed > 0) {
      if (lastTickRef.current !== elapsed) {
        lastTickRef.current = elapsed
        playTone(ctxRef, 440, 0.04, 0.02)
      }
    }

    if (remainingSeconds > 0 && remainingSeconds <= 10) {
      if (lastAlertRef.current !== remainingSeconds) {
        lastAlertRef.current = remainingSeconds
        const freq = remainingSeconds <= 3 ? 990 : 760
        playTone(ctxRef, freq, 0.1, 0.07)
      }
    } else if (remainingSeconds > 10) {
      lastAlertRef.current = null
    }
  }, [remainingSeconds, elapsed, status, timerSound, tickSound])

  useEffect(() => {
    if (status === 'completed' && timerSound && !completedPlayedRef.current) {
      completedPlayedRef.current = true
      playFanfare(ctxRef)
    }
    if (status !== 'completed') {
      completedPlayedRef.current = false
    }
  }, [status, timerSound])
}
