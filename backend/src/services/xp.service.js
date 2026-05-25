const BASE_XP_PER_25_MIN = 50
const XP_PER_STREAK_DAY = 10
const MAX_STREAK_BONUS = 100
const XP_PER_LEVEL = 200

const RANK_BY_LEVEL = [
  { min: 20, rank: 'Lendário' },
  { min: 15, rank: 'Mestre' },
  { min: 10, rank: 'Focado' },
  { min: 6, rank: 'Dedicado' },
  { min: 3, rank: 'Estudante' },
  { min: 1, rank: 'Calouro' },
]

function calculateLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

function calculateRank(level) {
  for (const entry of RANK_BY_LEVEL) {
    if (level >= entry.min) return entry.rank
  }
  return 'Calouro'
}

function calculateXpGained(durationMinutes, currentStreak) {
  const baseXp = Math.round((durationMinutes / 25) * BASE_XP_PER_25_MIN)
  const streakBonus = Math.min(currentStreak * XP_PER_STREAK_DAY, MAX_STREAK_BONUS)
  return baseXp + streakBonus
}

function applyXpToUser(user, xpGained) {
  user.xp += xpGained
  user.level = calculateLevel(user.xp)
  user.rank = calculateRank(user.level)
  return user
}

module.exports = {
  calculateLevel,
  calculateRank,
  calculateXpGained,
  applyXpToUser,
  BASE_XP_PER_25_MIN,
  XP_PER_LEVEL,
}
