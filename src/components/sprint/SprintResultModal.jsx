import { useEffect } from 'react'
import { Modal, Badge } from '../ui'
import { useAchievementToastStore } from '../../stores/useAchievementToastStore'

export default function SprintResultModal({
  isOpen,
  onClose,
  xpGained,
  user,
  previousLevel,
  newAchievements = [],
}) {
  const pushAchievements = useAchievementToastStore((s) => s.pushAchievements)
  const leveledUp = user && previousLevel && user.level > previousLevel

  useEffect(() => {
    if (isOpen && newAchievements.length > 0) {
      pushAchievements(newAchievements)
    }
  }, [isOpen, newAchievements, pushAchievements])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sprint completo!">
      <div className="space-y-4 text-center">
        <p className="font-display text-4xl text-accent text-glow-accent">+{xpGained} XP</p>

        {leveledUp && (
          <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3">
            <p className="text-sm text-foreground-secondary">Level up!</p>
            <p className="font-display text-xl text-primary">
              Nível {previousLevel} → {user.level}
            </p>
            <Badge variant="rank" className="mt-2">
              {user.rank}
            </Badge>
          </div>
        )}

        <div className="flex justify-center gap-4 text-sm text-foreground-secondary">
          <span>{user?.xp?.toLocaleString('pt-BR')} XP total</span>
          <span>Nível {user?.level}</span>
        </div>

        {newAchievements.length > 0 && (
          <div className="rounded-lg border border-border bg-surface-elevated p-4 text-left">
            <p className="mb-2 text-sm font-medium text-foreground">Conquistas desbloqueadas</p>
            <ul className="space-y-2">
              {newAchievements.map((a) => (
                <li key={a._id || a.key} className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-foreground">{a.name}</span>
                  {a.xpReward > 0 && (
                    <span className="ml-auto font-display text-xs text-accent">
                      +{a.xpReward} XP
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-hover"
        >
          Continuar
        </button>
      </div>
    </Modal>
  )
}
