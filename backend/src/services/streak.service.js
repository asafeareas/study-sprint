const { getRedis } = require('../config/redis')

const DAY_KEY_TTL = 48 * 60 * 60
const STREAK_KEY_TTL = 49 * 60 * 60

function formatDate(date) {
  return date.toISOString().slice(0, 10)
}

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

function daysBetween(dateA, dateB) {
  const a = startOfDay(dateA).getTime()
  const b = startOfDay(dateB).getTime()
  return Math.round((b - a) / (24 * 60 * 60 * 1000))
}

/**
 * Atualiza streak ao completar sprint.
 * Retorna { currentStreak, streakIncremented, alreadySprintedToday }
 */
async function updateStreak(userId, user) {
  const redis = getRedis()
  const today = formatDate(new Date())
  const todayKey = `streak:${userId}:${today}`

  const alreadyToday = await redis.exists(todayKey)
  if (alreadyToday) {
    return {
      currentStreak: user.currentStreak,
      streakIncremented: false,
      alreadySprintedToday: true,
    }
  }

  let newStreak = 1

  if (user.lastSprintDate) {
    const daysSince = daysBetween(user.lastSprintDate, new Date())

    if (daysSince === 1) {
      newStreak = user.currentStreak + 1
    } else if (daysSince === 0) {
      newStreak = user.currentStreak
    } else if (daysSince <= 2) {
      newStreak = user.currentStreak > 0 ? user.currentStreak + 1 : 1
    } else {
      newStreak = 1
    }
  }

  await redis.set(todayKey, '1', 'EX', DAY_KEY_TTL)
  await redis.set(`user:streak:${userId}`, String(newStreak), 'EX', STREAK_KEY_TTL)

  return {
    currentStreak: newStreak,
    streakIncremented: true,
    alreadySprintedToday: false,
  }
}

async function getStreakFromRedis(userId) {
  const redis = getRedis()
  const value = await redis.get(`user:streak:${userId}`)
  return value ? parseInt(value, 10) : null
}

module.exports = { updateStreak, getStreakFromRedis, formatDate }
