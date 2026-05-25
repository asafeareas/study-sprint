import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useAchievementToastStore } from '../../stores/useAchievementToastStore'

const TOAST_DURATION_MS = 4000

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), TOAST_DURATION_MS)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="pointer-events-auto w-80 overflow-hidden rounded-xl border border-accent/40 bg-surface shadow-glow-accent"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-3xl">{toast.icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-accent">
            Conquista desbloqueada!
          </p>
          <p className="truncate font-medium text-foreground">{toast.name}</p>
          {toast.xpReward > 0 && (
            <p className="font-display text-sm text-accent">+{toast.xpReward} XP</p>
          )}
        </div>
      </div>
      <motion.div
        className="h-0.5 bg-accent"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: TOAST_DURATION_MS / 1000, ease: 'linear' }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.div>
  )
}

export default function AchievementToastContainer() {
  const queue = useAchievementToastStore((s) => s.queue)
  const dismiss = useAchievementToastStore((s) => s.dismiss)

  return (
    <div className="pointer-events-none fixed right-4 top-28 z-[95] flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {queue.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
