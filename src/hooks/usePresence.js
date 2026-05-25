import { useEffect } from 'react'
import { useAuthStore } from '../stores/useAuthStore'
import { pingPresence } from '../services/ranking.service'

const PING_INTERVAL_MS = 4 * 60 * 1000

export function usePresence() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) return undefined

    const sendPing = () => {
      pingPresence().catch(() => {})
    }

    sendPing()
    const id = setInterval(sendPing, PING_INTERVAL_MS)

    return () => clearInterval(id)
  }, [isAuthenticated])
}
