const BASE_XP_PER_25_MIN = 50
const XP_PER_STREAK_DAY = 10
const MAX_STREAK_BONUS = 100
export const XP_PER_LEVEL = 200

export function calculateXpPreview(durationMinutes, currentStreak = 0) {
  const baseXp = Math.round((durationMinutes / 25) * BASE_XP_PER_25_MIN)
  const streakBonus = Math.min(currentStreak * XP_PER_STREAK_DAY, MAX_STREAK_BONUS)
  return baseXp + streakBonus
}

export function calculateLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

export function getLevelProgress(xp, level) {
  const currentLevelStart = (level - 1) * XP_PER_LEVEL
  const nextLevelStart = level * XP_PER_LEVEL
  const remaining = Math.max(0, nextLevelStart - xp)
  const percent = Math.min(
    100,
    Math.round(((xp - currentLevelStart) / XP_PER_LEVEL) * 100),
  )

  return {
    remaining,
    percent,
    currentLevel: level,
    nextLevel: level + 1,
    currentLevelStart,
    nextLevelStart,
  }
}
