const { getRedis } = require('../config/redis')
const User = require('../models/User')

const KEYS = {
  ALLTIME: 'leaderboard:alltime',
  WEEKLY: 'leaderboard:weekly',
}

const ONLINE_PREFIX = 'online:'
const ONLINE_TTL = 300

async function updateLeaderboard(userId, xpGained, totalXp) {
  const redis = getRedis()
  await redis.zadd(KEYS.ALLTIME, totalXp, String(userId))
  if (xpGained > 0) {
    await redis.zincrby(KEYS.WEEKLY, xpGained, String(userId))
  }
}

async function getLeaderboard(type = 'alltime', limit = 50) {
  const redis = getRedis()
  const key = type === 'weekly' ? KEYS.WEEKLY : KEYS.ALLTIME

  const entries = await redis.zrevrange(key, 0, limit - 1, 'WITHSCORES')

  const result = []
  for (let i = 0; i < entries.length; i += 2) {
    result.push({
      userId: entries[i],
      score: parseInt(entries[i + 1], 10),
      position: Math.floor(i / 2) + 1,
    })
  }

  const userIds = result.map((e) => e.userId)
  const users = await User.find({ _id: { $in: userIds } })
    .select('username xp level rank currentStreak totalSprints')
    .lean()

  const userMap = Object.fromEntries(users.map((u) => [String(u._id), u]))

  return result.map((entry) => ({
    ...entry,
    user: userMap[entry.userId] || null,
  }))
}

async function getUserRank(userId, type = 'alltime') {
  const redis = getRedis()
  const key = type === 'weekly' ? KEYS.WEEKLY : KEYS.ALLTIME
  const id = String(userId)

  const rank = await redis.zrevrank(key, id)
  const score = await redis.zscore(key, id)

  return {
    position: rank !== null ? rank + 1 : null,
    score: score !== null ? parseInt(score, 10) : 0,
    type,
  }
}

async function setUserOnline(userId) {
  const redis = getRedis()
  await redis.set(`${ONLINE_PREFIX}${userId}`, '1', 'EX', ONLINE_TTL)
}

async function getOnlineUsers() {
  const redis = getRedis()
  const keys = await redis.keys(`${ONLINE_PREFIX}*`)

  const userIds = keys.map((k) => k.replace(ONLINE_PREFIX, ''))
  if (userIds.length === 0) return []

  const users = await User.find({ _id: { $in: userIds } })
    .select('username xp level rank')
    .lean()

  return users
}

async function resetWeeklyLeaderboard() {
  const redis = getRedis()
  await redis.del(KEYS.WEEKLY)
  console.log('[Leaderboard] Ranking semanal resetado (domingo)')
}

function startWeeklyResetCron() {
  const cron = require('node-cron')
  cron.schedule('0 0 * * 0', resetWeeklyLeaderboard, {
    timezone: 'America/Sao_Paulo',
  })
  console.log('[Cron] Reset semanal agendado: domingos 00:00')
}

module.exports = {
  KEYS,
  updateLeaderboard,
  getLeaderboard,
  getUserRank,
  setUserOnline,
  getOnlineUsers,
  resetWeeklyLeaderboard,
  startWeeklyResetCron,
}
