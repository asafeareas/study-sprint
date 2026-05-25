import { useEffect } from 'react'
import { formatTime } from '../utils/time'

const DEFAULT_TITLE = 'Study Sprint — Foco Gamificado'

export function useSprintTabTitle(status, durationSeconds, elapsed) {
  useEffect(() => {
    if (status === 'running' || status === 'paused') {
      const remaining = Math.max(0, durationSeconds - elapsed)
      document.title = `⏱️ ${formatTime(remaining)} — Study Sprint`
    } else {
      document.title = DEFAULT_TITLE
    }

    return () => {
      document.title = DEFAULT_TITLE
    }
  }, [status, durationSeconds, elapsed])
}
