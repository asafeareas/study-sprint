import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import clsx from 'clsx'
import { formatAchievementCondition, formatUnlockDate } from '../../utils/achievements'

export default function AchievementCard({
  achievement,
  unlocked = false,
  unlockedAt = null,
  justUnlocked = false,
}) {
  const [hover, setHover] = useState(false)

  const conditionText = formatAchievementCondition(achievement.condition)
  const dateText = formatUnlockDate(unlockedAt)

  return (
    <motion.div
      layout
      initial={justUnlocked ? { scale: 0.8, opacity: 0 } : false}
      animate={
        justUnlocked
          ? {
              scale: [0.8, 1.15, 1],
              opacity: 1,
              boxShadow: [
                '0 0 0 rgba(245,158,11,0)',
                '0 0 30px rgba(245,158,11,0.6)',
                '0 0 12px rgba(245,158,11,0.25)',
              ],
            }
          : { scale: 1, opacity: 1 }
      }
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={clsx(
        'relative aspect-square rounded-xl border p-4 transition-colors',
        unlocked
          ? 'border-accent/40 bg-gradient-to-br from-accent/10 to-primary/10 leaderboard-shimmer cursor-default'
          : 'border-border bg-surface-elevated/50 opacity-60 grayscale',
      )}
    >
      {!unlocked && (
        <div className="absolute right-2 top-2 text-muted">
          <Lock className="h-4 w-4" />
        </div>
      )}

      <div className="flex h-full flex-col items-center justify-center text-center">
        <span
          className={clsx(
            'text-4xl leading-none',
            unlocked && 'drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]',
          )}
        >
          {achievement.icon}
        </span>
        <p
          className={clsx(
            'mt-2 text-xs font-semibold leading-tight',
            unlocked ? 'text-foreground' : 'text-foreground-secondary',
          )}
        >
          {achievement.name}
        </p>
        <p className="mt-1 line-clamp-2 text-[10px] text-muted">{achievement.description}</p>
      </div>

      {hover && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute inset-x-2 bottom-2 z-10 rounded-md border border-border bg-surface px-2 py-1.5 text-center text-[10px] shadow-lg"
        >
          {unlocked ? (
            <>
              <p className="text-accent">+{achievement.xpReward} XP</p>
              {dateText && <p className="text-muted">Desbloqueada em {dateText}</p>}
            </>
          ) : (
            <p className="text-foreground-secondary">{conditionText}</p>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
