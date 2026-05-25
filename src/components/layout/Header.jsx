import { Badge } from '../ui'
import HeaderSettings from './HeaderSettings'
import { useAuthStore } from '../../stores/useAuthStore'

export default function Header() {
  const user = useAuthStore((s) => s.user)

  if (!user) return null

  const initials = user.username?.slice(0, 2).toUpperCase() || '??'

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface/80 px-6 py-4 backdrop-blur-sm">
      <div>
        <h1 className="text-lg font-medium text-foreground">
          Olá, <span className="text-primary">{user.username}</span>
        </h1>
        <p className="text-sm text-foreground-secondary">Pronto para subir de rank?</p>
      </div>

      <div className="flex items-center gap-3">
        <HeaderSettings />
        <Badge variant="xp">{user.xp?.toLocaleString('pt-BR')} XP</Badge>
        <Badge variant="rank">{user.rank}</Badge>
        {user.currentStreak > 0 && (
          <Badge variant="streak">
            🔥 {user.currentStreak} {user.currentStreak === 1 ? 'dia' : 'dias'}
          </Badge>
        )}

        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary/20 font-display text-sm text-primary"
          title={user.username}
        >
          {initials}
        </div>
      </div>
    </header>
  )
}
