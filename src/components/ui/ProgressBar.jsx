import { motion } from 'framer-motion'
import clsx from 'clsx'

const colorMap = {
  primary: 'bg-primary',
  accent: 'bg-accent',
  streak: 'bg-streak',
  danger: 'bg-danger',
}

export default function ProgressBar({
  value = 0,
  max = 100,
  color = 'primary',
  label,
  className,
}) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-foreground-secondary">{label}</span>
          <span className="font-display text-xs text-foreground">{Math.round(percent)}%</span>
        </div>
      )}
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-elevated">
        <motion.div
          className={clsx('h-full rounded-full', colorMap[color] ?? colorMap.primary)}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            boxShadow: `0 0 12px ${color === 'accent' ? 'rgba(245,158,11,0.5)' : color === 'streak' ? 'rgba(16,185,129,0.5)' : 'rgba(124,58,237,0.5)'}`,
          }}
        />
      </div>
    </div>
  )
}
