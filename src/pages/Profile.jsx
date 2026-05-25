import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  Zap,
  Target,
  Clock,
  Flame,
  Trophy,
  TrendingUp,
} from 'lucide-react'
import clsx from 'clsx'
import { Card, Badge, ProgressBar } from '../components/ui'
import AchievementCard from '../components/achievements/AchievementCard'
import { useAuthStore } from '../stores/useAuthStore'
import { getMe } from '../services/auth.service'
import { getMyAchievements } from '../services/achievement.service'
import { getMyRanking } from '../services/ranking.service'
import { RANK_AVATAR_COLORS } from '../utils/rank'
import { getLevelProgress, XP_PER_LEVEL } from '../utils/xp'

function StatItem({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-border/60 bg-surface-elevated/50 px-4 py-3">
      <div className="mb-1 flex items-center gap-2 text-muted">
        <Icon className="h-4 w-4" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-display text-lg text-foreground">{value}</p>
    </div>
  )
}

export default function Profile() {
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const { data: meData } = useQuery({
    queryKey: ['profile-me'],
    queryFn: async () => {
      const res = await getMe()
      return res.data.user
    },
  })

  const { data: rankData } = useQuery({
    queryKey: ['profile-rank'],
    queryFn: async () => {
      const res = await getMyRanking()
      return res.data
    },
  })

  const { data: achievementsData, isLoading: loadingAchievements } = useQuery({
    queryKey: ['profile-achievements'],
    queryFn: async () => {
      const res = await getMyAchievements()
      return res.data
    },
  })

  useEffect(() => {
    if (meData) setUser(meData)
  }, [meData, setUser])

  const profile = meData || user
  if (!profile) return null

  const globalPosition = rankData?.ranking?.alltime?.position
  const levelProgress = getLevelProgress(profile.xp ?? 0, profile.level ?? 1)
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric',
      })
    : '—'

  const initials = profile.username?.slice(0, 2).toUpperCase() || '??'
  const avatarGradient = RANK_AVATAR_COLORS[profile.rank] || RANK_AVATAR_COLORS.Calouro
  const allAchievements = achievementsData?.all ?? []

  return (
    <div className="space-y-8 pb-8">
      {/* Hero */}
      <Card glow className="overflow-hidden">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div
            className={clsx(
              'flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-3xl text-white shadow-glow',
              avatarGradient,
            )}
          >
            {initials}
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-foreground">{profile.username}</h1>
            <p className="text-sm text-foreground-secondary">{profile.email}</p>
            <p className="mt-1 text-xs text-muted">Membro desde {memberSince}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <Badge variant="rank" className="leaderboard-shimmer text-sm">
                {profile.rank}
              </Badge>
              <Badge variant="xp">Nível {profile.level}</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats grid */}
      <section>
        <h2 className="mb-4 font-display text-lg text-foreground">Estatísticas</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatItem icon={Zap} label="XP Total" value={profile.xp?.toLocaleString('pt-BR')} />
          <StatItem icon={TrendingUp} label="Level" value={profile.level} />
          <StatItem icon={Target} label="Rank" value={profile.rank} />
          <StatItem icon={Target} label="Sprints totais" value={profile.totalSprints ?? 0} />
          <StatItem
            icon={Clock}
            label="Minutos estudados"
            value={`${(profile.totalMinutes ?? 0).toLocaleString('pt-BR')} min`}
          />
          <StatItem
            icon={Flame}
            label="Streak atual"
            value={`${profile.currentStreak ?? 0} dias`}
          />
          <StatItem
            icon={Flame}
            label="Maior streak"
            value={`${profile.longestStreak ?? 0} dias`}
          />
          <StatItem
            icon={Trophy}
            label="Posição global"
            value={globalPosition ? `#${globalPosition}` : '—'}
          />
        </div>
      </section>

      {/* Level XP bar */}
      <section>
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-foreground">
              Nível {levelProgress.currentLevel}
            </p>
            <p className="text-sm text-foreground-secondary">
              <span className="font-display text-accent">
                {levelProgress.remaining.toLocaleString('pt-BR')} XP
              </span>{' '}
              para o nível {levelProgress.nextLevel}
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <ProgressBar
              value={levelProgress.percent}
              color="primary"
              label={`${profile.xp?.toLocaleString('pt-BR')} / ${levelProgress.nextLevelStart.toLocaleString('pt-BR')} XP`}
            />
          </motion.div>
          <p className="mt-2 text-xs text-muted">
            Cada nível requer {XP_PER_LEVEL} XP
          </p>
        </Card>
      </section>

      {/* Achievements */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-foreground">Conquistas</h2>
          <span className="text-sm text-muted">
            {allAchievements.filter((a) => a.unlocked).length} / {allAchievements.length}
          </span>
        </div>

        {loadingAchievements ? (
          <p className="text-muted">Carregando conquistas...</p>
        ) : allAchievements.length === 0 ? (
          <Card>
            <p className="text-center text-sm text-muted">
              Nenhuma conquista cadastrada. Execute o seed no backend.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {allAchievements.map((achievement) => (
              <AchievementCard
                key={achievement._id || achievement.key}
                achievement={achievement}
                unlocked={achievement.unlocked}
                unlockedAt={achievement.unlockedAt}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
