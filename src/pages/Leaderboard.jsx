import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { Badge, ProgressBar } from '../components/ui'
import { useAuthStore } from '../stores/useAuthStore'
import {
  getLeaderboard,
  getOnlineUsers,
  getMyRanking,
} from '../services/ranking.service'
import { RANK_AVATAR_COLORS, getNextRankProgress } from '../utils/rank'

const POLL_MS = 30_000

const TOP_STYLES = {
  1: 'border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-transparent shadow-[0_0_20px_rgba(234,179,8,0.15)] leaderboard-shimmer',
  2: 'border-slate-400/50 bg-gradient-to-r from-slate-400/10 to-transparent shadow-[0_0_16px_rgba(148,163,184,0.12)] leaderboard-shimmer',
  3: 'border-amber-700/50 bg-gradient-to-r from-amber-700/10 to-transparent shadow-[0_0_14px_rgba(180,83,9,0.12)] leaderboard-shimmer',
}

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' }

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  }),
}

function UserAvatar({ username, rank }) {
  const initials = username?.slice(0, 2).toUpperCase() || '??'
  const gradient = RANK_AVATAR_COLORS[rank] || RANK_AVATAR_COLORS.Calouro

  return (
    <div
      className={clsx(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-xs text-white',
        gradient,
      )}
    >
      {initials}
    </div>
  )
}

function LeaderboardRow({ entry, isCurrentUser, index }) {
  const { position, user, score } = entry
  if (!user) return null

  const topStyle = TOP_STYLES[position]

  return (
    <motion.tr
      custom={index}
      variants={rowVariants}
      initial="hidden"
      animate="visible"
      className={clsx(
        'border-b border-border/50 transition-colors',
        topStyle,
        isCurrentUser && 'bg-primary/15 ring-1 ring-inset ring-primary/40',
        !topStyle && !isCurrentUser && 'hover:bg-surface-elevated/50',
      )}
    >
      <td className="px-4 py-3 font-display text-sm">
        <span className="flex items-center gap-1">
          {MEDALS[position] || (
            <span className="text-foreground-secondary">#{position}</span>
          )}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <UserAvatar username={user.username} rank={user.rank} />
          <span className={clsx('font-medium', isCurrentUser && 'text-primary')}>
            {user.username}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-primary/80">(você)</span>
            )}
          </span>
        </div>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <Badge variant="rank">{user.rank}</Badge>
      </td>
      <td className="px-4 py-3 font-display text-sm text-accent">
        {score.toLocaleString('pt-BR')} XP
      </td>
      <td className="hidden px-4 py-3 font-display text-sm text-foreground-secondary md:table-cell">
        {user.totalSprints ?? 0}
      </td>
    </motion.tr>
  )
}

export default function Leaderboard() {
  const [type, setType] = useState('weekly')
  const currentUser = useAuthStore((s) => s.user)
  const currentUserId = currentUser?._id || currentUser?.id

  const { data: onlineData } = useQuery({
    queryKey: ['ranking-online'],
    queryFn: async () => {
      const res = await getOnlineUsers()
      return res.data
    },
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
  })

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['leaderboard', type],
    queryFn: async () => {
      const res = await getLeaderboard(type)
      return res.data
    },
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
  })

  const { data: myData } = useQuery({
    queryKey: ['my-ranking', type],
    queryFn: async () => {
      const res = await getMyRanking()
      return res.data
    },
    refetchInterval: POLL_MS,
    refetchOnWindowFocus: true,
  })

  const entries = leaderboardData?.entries ?? []
  const onlineCount = onlineData?.count ?? 0

  const myRanking = type === 'weekly' ? myData?.ranking?.weekly : myData?.ranking?.alltime
  const myUser = myData?.user ?? currentUser
  const rankProgress = getNextRankProgress(myUser?.rank, myUser?.xp ?? 0)

  const isInTop50 = useMemo(
    () => entries.some((e) => String(e.userId) === String(currentUserId)),
    [entries, currentUserId],
  )

  const showMyExtraRow = currentUserId && !isInTop50 && myRanking?.position

  return (
    <div className="pb-36">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <motion.h1
            className="leaderboard-title font-display text-3xl font-bold tracking-[0.25em] sm:text-4xl"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            RANKING
          </motion.h1>
          <p className="mt-1 text-sm text-foreground-secondary">
            Atualizado em tempo real a cada 30s
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex rounded-lg border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setType('weekly')}
              className={clsx(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                type === 'weekly'
                  ? 'bg-primary text-white'
                  : 'text-foreground-secondary hover:text-foreground',
              )}
            >
              Esta Semana
            </button>
            <button
              type="button"
              onClick={() => setType('alltime')}
              className={clsx(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                type === 'alltime'
                  ? 'bg-primary text-white'
                  : 'text-foreground-secondary hover:text-foreground',
              )}
            >
              Todos os Tempos
            </button>
          </div>

          <span className="inline-flex animate-pulse items-center gap-1.5 rounded-full border border-streak/30 bg-streak/10 px-3 py-1 text-xs font-medium text-streak">
            <span>🟢</span>
            {onlineCount} online agora
          </span>
        </div>
      </header>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left">
            <thead>
              <tr className="border-b border-border bg-surface-elevated/80 text-xs uppercase tracking-wider text-muted">
                <th className="px-4 py-3 font-display">#</th>
                <th className="px-4 py-3">Jogador</th>
                <th className="hidden px-4 py-3 sm:table-cell">Rank</th>
                <th className="px-4 py-3">XP</th>
                <th className="hidden px-4 py-3 md:table-cell">Sprints</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted">
                    Carregando ranking...
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted">
                    Nenhum jogador no ranking ainda. Seja o primeiro!
                  </td>
                </tr>
              ) : (
                entries.map((entry, index) => (
                  <LeaderboardRow
                    key={entry.userId}
                    entry={entry}
                    index={index}
                    isCurrentUser={String(entry.userId) === String(currentUserId)}
                  />
                ))
              )}

              {showMyExtraRow && (
                <LeaderboardRow
                  entry={{
                    userId: currentUserId,
                    position: myRanking.position,
                    score: myRanking.score,
                    user: myUser,
                  }}
                  index={entries.length}
                  isCurrentUser
                />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky — Sua Posição */}
      <div className="fixed bottom-0 left-16 right-0 z-30 border-t border-border bg-surface/95 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted">Sua posição</p>
            <p className="font-display text-2xl text-foreground">
              {myRanking?.position ? `#${myRanking.position}` : '—'}
              <span className="ml-3 text-base text-accent">
                {(myRanking?.score ?? myUser?.xp ?? 0).toLocaleString('pt-BR')} XP
              </span>
            </p>
          </div>

          <div className="flex-1 sm:max-w-md">
            {rankProgress.nextRank ? (
              <>
                <p className="mb-1.5 text-xs text-foreground-secondary">
                  Faltam{' '}
                  <span className="font-display text-accent">
                    {rankProgress.remaining.toLocaleString('pt-BR')} XP
                  </span>{' '}
                  para <span className="text-primary">{rankProgress.nextRank}</span>
                </p>
                <ProgressBar
                  value={rankProgress.percent}
                  color="primary"
                  label={`${myUser?.rank} → ${rankProgress.nextRank}`}
                />
              </>
            ) : (
              <p className="text-sm text-accent">🏆 Rank máximo alcançado — Lendário!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
