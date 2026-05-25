const BASE_XP_PER_25_MIN = 50
const XP_PER_STREAK_DAY = 10
const MAX_STREAK_BONUS = 100

export function calculateXpPreview(durationMinutes, currentStreak = 0) {
  const baseXp = Math.round((durationMinutes / 25) * BASE_XP_PER_25_MIN)
  const streakBonus = Math.min(currentStreak * XP_PER_STREAK_DAY, MAX_STREAK_BONUS)
  return baseXp + streakBonus
}
