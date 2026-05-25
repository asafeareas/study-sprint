import { useEffect, useRef } from 'react'
import { useAuthStore } from '../stores/useAuthStore'
import { useLevelUpStore } from '../stores/useLevelUpStore'

export function useLevelUp() {
  const user = useAuthStore((s) => s.user)
  const show = useLevelUpStore((s) => s.show)
  const prevLevelRef = useRef(user?.level ?? null)

  useEffect(() => {
    if (!user?.level) return

    const prev = prevLevelRef.current
    if (prev !== null && user.level > prev) {
      show({
        level: user.level,
        previousLevel: prev,
        rank: user.rank,
      })
    }
    prevLevelRef.current = user.level
  }, [user?.level, user?.rank, show])
}
