import { useEffect, useRef } from 'react'

export function useWakeLock(enabled) {
  const wakeLockRef = useRef(null)

  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return undefined

    let released = false

    async function requestLock() {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen')
        wakeLockRef.current.addEventListener('release', () => {
          wakeLockRef.current = null
        })
      } catch {
        // Permissão negada ou não suportado
      }
    }

    requestLock()

    const onVisibility = () => {
      if (document.visibilityState === 'visible' && !released) {
        requestLock()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      released = true
      document.removeEventListener('visibilitychange', onVisibility)
      wakeLockRef.current?.release().catch(() => {})
      wakeLockRef.current = null
    }
  }, [enabled])
}
