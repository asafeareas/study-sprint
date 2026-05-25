import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, Trophy } from 'lucide-react'
import clsx from 'clsx'
import { useToastStore } from '../../stores/useToastStore'

const TOAST_DURATION = 4000

const styles = {
  success: {
    icon: CheckCircle,
    border: 'border-streak/40',
    bg: 'bg-streak/10',
    text: 'text-streak',
  },
  error: {
    icon: AlertCircle,
    border: 'border-danger/40',
    bg: 'bg-danger/10',
    text: 'text-danger',
  },
  info: {
    icon: Info,
    border: 'border-primary/40',
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
  achievement: {
    icon: Trophy,
    border: 'border-accent/40',
    bg: 'bg-accent/10',
    text: 'text-accent',
  },
}

function ToastItem({ toast, onDismiss }) {
  const style = styles[toast.type] || styles.info
  const Icon = style.icon

  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), TOAST_DURATION)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.96 }}
      className={clsx(
        'pointer-events-auto flex w-80 items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm',
        style.border,
        style.bg,
      )}
    >
      <Icon className={clsx('mt-0.5 h-5 w-5 shrink-0', style.text)} />
      <div className="min-w-0 flex-1">
        {toast.title && (
          <p className={clsx('text-sm font-semibold', style.text)}>{toast.title}</p>
        )}
        <p className="text-sm text-foreground">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="text-muted hover:text-foreground"
        aria-label="Fechar"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export function toast(type, message, title) {
  return useToastStore.getState().addToast({ type, message, title })
}

toast.success = (message, title) => toast('success', message, title)
toast.error = (message, title) => toast('error', message, title)
toast.info = (message, title) => toast('info', message, title)
toast.achievement = (message, title) => toast('achievement', message, title)

export default function ToastProvider() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[90] flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
