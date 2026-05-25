import { useState, useRef, useEffect } from 'react'
import { Settings, Volume2, VolumeX, Bell, BellOff, Trash2 } from 'lucide-react'
import clsx from 'clsx'
import { useSettingsStore } from '../../stores/useSettingsStore'
import { queryClient } from '../../lib/queryClient'
import { toast } from '../ui/ToastProvider'

export default function HeaderSettings() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const timerSound = useSettingsStore((s) => s.timerSound)
  const tickSound = useSettingsStore((s) => s.tickSound)
  const browserNotifications = useSettingsStore((s) => s.browserNotifications)
  const setTimerSound = useSettingsStore((s) => s.setTimerSound)
  const setTickSound = useSettingsStore((s) => s.setTickSound)
  const setBrowserNotifications = useSettingsStore((s) => s.setBrowserNotifications)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function toggleNotifications() {
    if (!browserNotifications && 'Notification' in window) {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') {
        toast.error('Permissão de notificações negada')
        return
      }
    }
    setBrowserNotifications(!browserNotifications)
    toast.info(
      !browserNotifications ? 'Notificações ativadas' : 'Notificações desativadas',
    )
  }

  function clearCache() {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith('study-sprint'),
    )
    keys.forEach((k) => localStorage.removeItem(k))
    queryClient.clear()
    toast.success('Cache local limpo')
    setOpen(false)
    setTimeout(() => window.location.reload(), 600)
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground-secondary transition-colors hover:border-primary/50 hover:text-primary"
        aria-label="Configurações"
      >
        <Settings className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-surface p-2 shadow-card">
          <p className="px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted">
            Configurações
          </p>

          <button
            type="button"
            onClick={() => setTimerSound(!timerSound)}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-surface-elevated"
          >
            {timerSound ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4" />}
            Som do timer {timerSound ? 'on' : 'off'}
          </button>

          <button
            type="button"
            onClick={() => setTickSound(!tickSound)}
            className={clsx(
              'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm hover:bg-surface-elevated',
              !timerSound && 'pointer-events-none opacity-40',
            )}
          >
            <Volume2 className="h-4 w-4" />
            Tick a cada segundo {tickSound ? 'on' : 'off'}
          </button>

          <button
            type="button"
            onClick={toggleNotifications}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-foreground hover:bg-surface-elevated"
          >
            {browserNotifications ? (
              <Bell className="h-4 w-4 text-streak" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
            Notificações {browserNotifications ? 'on' : 'off'}
          </button>

          <hr className="my-1 border-border" />

          <button
            type="button"
            onClick={clearCache}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm text-danger hover:bg-danger/10"
          >
            <Trash2 className="h-4 w-4" />
            Limpar meu cache
          </button>
        </div>
      )}
    </div>
  )
}
