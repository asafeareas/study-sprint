import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Target,
  Clock,
  Flame,
  Trophy,
  Play,
  Zap,
} from 'lucide-react'
import clsx from 'clsx'
import { Card, Button } from '../components/ui'
import { StatCardSkeleton } from '../components/ui/Skeleton'
import AnimatedNumber from '../components/ui/AnimatedNumber'
import { useAuthStore } from '../stores/useAuthStore'
import { useSprintStore } from '../stores/useSprintStore'
import { getMe } from '../services/auth.service'
import { getHistory } from '../services/sprint.service'
import { getMyRanking } from '../services/ranking.service'
import { calculateXpPreview } from '../utils/xp'
import { formatRelativeTime } from '../utils/time'

const DURATIONS = [
  { label: '25 min', value: 25, sub: 'Pomodoro' },
  { label: '50 min', value: 50, sub: 'Pomodoro duplo' },
  { label: 'Livre', value: 'free', sub: 'Personalizado' },
]

function StatCard({ icon: Icon, label, value, suffix = '' }) {
  const isNumber = typeof value === 'number'

  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="font-display text-2xl text-foreground">
          {isNumber ? <AnimatedNumber value={value} /> : value}
          {suffix}
        </p>
        <p className="text-xs text-foreground-secondary">{label}</p>
      </div>
    </Card>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const configure = useSprintStore((s) => s.configure)

  const [subject, setSubject] = useState('')
  const [durationChoice, setDurationChoice] = useState(25)
  const [customMinutes, setCustomMinutes] = useState(60)
  const [rankPosition, setRankPosition] = useState(null)
  const [recentSessions, setRecentSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const duration =
    durationChoice === 'free' ? Number(customMinutes) || 60 : durationChoice
  const xpPreview = calculateXpPreview(duration, user?.currentStreak ?? 0)

  useEffect(() => {
    async function load() {
      try {
        const [meRes, historyRes, rankRes] = await Promise.all([
          getMe(),
          getHistory(1, 5),
          getMyRanking().catch(() => null),
        ])
        setUser(meRes.data.user)
        setRecentSessions(historyRes.data.sessions || [])
        if (rankRes?.data?.ranking?.alltime) {
          setRankPosition(rankRes.data.ranking.alltime.position)
        }
      } catch {
        // Mantém dados do store local
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [setUser])

  function handleStartSprint() {
    configure({
      subject,
      duration,
      currentStreak: user?.currentStreak ?? 0,
    })
    navigate('/sprint', { state: { autoStart: true } })
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              icon={Target}
              label="Total de Sprints"
              value={user?.totalSprints ?? 0}
            />
            <StatCard
              icon={Clock}
              label="Total de Minutos"
              value={user?.totalMinutes ?? 0}
            />
            <StatCard
              icon={Flame}
              label="Streak Atual"
              value={user?.currentStreak ?? 0}
              suffix={user?.currentStreak === 1 ? ' dia' : ' dias'}
            />
            <StatCard
              icon={Trophy}
              label="Posição no Ranking"
              value={rankPosition ?? '—'}
              suffix={rankPosition ? 'º' : ''}
            />
          </>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Sprint */}
        <section className="lg:col-span-2">
          <Card glow className="h-full">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-accent" />
              <h2 className="font-display text-lg text-foreground">Quick Sprint</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="subject" className="mb-1.5 block text-sm text-foreground-secondary">
                  Matéria / assunto (opcional)
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Matemática, Direito Constitucional..."
                  className="w-full rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <p className="mb-2 text-sm text-foreground-secondary">Duração</p>
                <div className="flex flex-wrap gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.label}
                      type="button"
                      onClick={() => setDurationChoice(d.value)}
                      className={clsx(
                        'rounded-lg border px-4 py-2 text-sm transition-all',
                        durationChoice === d.value
                          ? 'border-primary bg-primary/15 text-primary'
                          : 'border-border text-foreground-secondary hover:border-primary/50',
                      )}
                    >
                      <span className="font-medium">{d.label}</span>
                      <span className="ml-1 text-xs opacity-70">({d.sub})</span>
                    </button>
                  ))}
                </div>
                {durationChoice === 'free' && (
                  <input
                    type="number"
                    min={5}
                    max={180}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Number(e.target.value))}
                    className="mt-2 w-32 rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm"
                  />
                )}
              </div>

              <p className="text-sm text-foreground-secondary">
                Você vai ganhar{' '}
                <span className="font-display text-accent">~{xpPreview} XP</span>
              </p>

              <Button
                onClick={handleStartSprint}
                className="w-full py-3 font-display text-base tracking-wider"
              >
                <Play className="h-5 w-5 fill-current" />
                INICIAR SPRINT
              </Button>
            </div>
          </Card>
        </section>

        {/* Recent activity */}
        <section>
          <Card className="h-full">
            <h2 className="mb-4 font-display text-lg text-foreground">Atividade Recente</h2>

            {loading ? (
              <p className="text-sm text-muted">Carregando...</p>
            ) : recentSessions.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="text-4xl opacity-50">📭</span>
                <p className="mt-3 text-sm text-foreground-secondary">
                  Nenhum sprint ainda. Comece agora!
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {recentSessions.map((session) => (
                  <li
                    key={session._id}
                    className="rounded-lg border border-border/60 bg-surface-elevated/50 px-3 py-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {session.subject || 'Sprint de foco'}
                        </p>
                        <p className="text-xs text-muted">
                          {session.duration} min · {formatRelativeTime(session.completedAt)}
                        </p>
                      </div>
                      <span className="shrink-0 font-display text-sm text-accent">
                        +{session.xpGained} XP
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </div>
  )
}
