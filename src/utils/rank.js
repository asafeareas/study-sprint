export const RANK_ORDER = ['Calouro', 'Estudante', 'Dedicado', 'Focado', 'Mestre', 'Lendário']

export const RANK_AVATAR_COLORS = {
  Calouro: 'from-gray-500 to-gray-600',
  Estudante: 'from-blue-500 to-blue-700',
  Dedicado: 'from-emerald-500 to-emerald-700',
  Focado: 'from-primary to-purple-800',
  Mestre: 'from-accent to-amber-700',
  'Lendário': 'from-yellow-400 to-orange-500',
}

const NEXT_RANK_LEVEL = {
  Calouro: 3,
  Estudante: 6,
  Dedicado: 10,
  Focado: 15,
  Mestre: 20,
  'Lendário': null,
}

const RANK_START_LEVEL = {
  Calouro: 1,
  Estudante: 3,
  Dedicado: 6,
  Focado: 10,
  Mestre: 15,
  'Lendário': 20,
}

const NEXT_RANK_NAME = {
  Calouro: 'Estudante',
  Estudante: 'Dedicado',
  Dedicado: 'Focado',
  Focado: 'Mestre',
  Mestre: 'Lendário',
  'Lendário': null,
}

export function xpForLevel(level) {
  return (level - 1) * 200
}

export function getNextRankProgress(rank, xp) {
  const nextLevel = NEXT_RANK_LEVEL[rank]
  if (!nextLevel) {
    return { percent: 100, remaining: 0, nextRank: null, targetXp: null }
  }

  const startXp = xpForLevel(RANK_START_LEVEL[rank])
  const targetXp = xpForLevel(nextLevel)
  const clampedXp = Math.max(startXp, Math.min(xp, targetXp))
  const percent = Math.round(((clampedXp - startXp) / (targetXp - startXp)) * 100)
  const remaining = Math.max(0, targetXp - xp)

  return {
    percent,
    remaining,
    nextRank: NEXT_RANK_NAME[rank],
    targetXp,
  }
}
