const Achievement = require('../models/Achievement')
const { applyXpToUser } = require('./xp.service')
const { getUserRank } = require('./leaderboard.service')

const SEED_ACHIEVEMENTS = [
  {
    key: 'first_sprint',
    name: 'Primeiro Passo',
    description: 'Complete seu primeiro sprint',
    icon: '🎯',
    xpReward: 25,
    condition: { type: 'sprints', value: 1 },
  },
  {
    key: 'sprint_5',
    name: 'Em Ritmo',
    description: 'Complete 5 sprints',
    icon: '⚡',
    xpReward: 50,
    condition: { type: 'sprints', value: 5 },
  },
  {
    key: 'sprint_25',
    name: 'Maratonista',
    description: 'Complete 25 sprints',
    icon: '🏃',
    xpReward: 100,
    condition: { type: 'sprints', value: 25 },
  },
  {
    key: 'sprint_100',
    name: 'Centurião',
    description: 'Complete 100 sprints',
    icon: '💯',
    xpReward: 500,
    condition: { type: 'sprints', value: 100 },
  },
  {
    key: 'streak_3',
    name: 'Consistente',
    description: '3 dias seguidos',
    icon: '🔥',
    xpReward: 75,
    condition: { type: 'streak', value: 3 },
  },
  {
    key: 'streak_7',
    name: 'Semana Perfeita',
    description: '7 dias seguidos',
    icon: '🌟',
    xpReward: 200,
    condition: { type: 'streak', value: 7 },
  },
  {
    key: 'streak_30',
    name: 'Mês de Ferro',
    description: '30 dias seguidos',
    icon: '👑',
    xpReward: 1000,
    condition: { type: 'streak', value: 30 },
  },
  {
    key: 'level_5',
    name: 'Subindo',
    description: 'Alcance o nível 5',
    icon: '📈',
    xpReward: 100,
    condition: { type: 'level', value: 5 },
  },
  {
    key: 'level_10',
    name: 'Dedicado Oficial',
    description: 'Alcance o nível 10',
    icon: '🎓',
    xpReward: 300,
    condition: { type: 'level', value: 10 },
  },
  {
    key: 'minutes_500',
    name: '500 Minutos',
    description: 'Estude 500 minutos',
    icon: '⏰',
    xpReward: 250,
    condition: { type: 'minutes', value: 500 },
  },
  {
    key: 'top_10',
    name: 'Elite',
    description: 'Entre no top 10 do ranking',
    icon: '🏆',
    xpReward: 500,
    condition: { type: 'top_rank', value: 10 },
  },
  {
    key: 'night_owl',
    name: 'Coruja',
    description: 'Complete sprint após 22h',
    icon: '🦉',
    xpReward: 50,
    condition: { type: 'night_sprint', value: 22 },
  },
]

function getStatValue(user, type) {
  switch (type) {
    case 'sprints':
      return user.totalSprints
    case 'streak':
      return user.currentStreak
    case 'level':
      return user.level
    case 'minutes':
      return user.totalMinutes
    default:
      return 0
  }
}

async function checkAchievementCondition(user, achievement, context = {}) {
  const { type, value } = achievement.condition

  switch (type) {
    case 'sprints':
    case 'streak':
    case 'level':
    case 'minutes':
      return getStatValue(user, type) >= value

    case 'top_rank': {
      const rank = await getUserRank(user._id, 'alltime')
      return rank.position !== null && rank.position <= value
    }

    case 'night_sprint': {
      if (!context.completedAt) return false
      const hour = new Date(context.completedAt).getHours()
      return hour >= value
    }

    default:
      return false
  }
}

function grantAchievement(user, achievement) {
  user.achievements.push(achievement._id)
  user.achievementUnlocks.push({
    achievementId: achievement._id,
    unlockedAt: new Date(),
  })
  if (achievement.xpReward > 0) {
    applyXpToUser(user, achievement.xpReward)
  }
}

async function checkAndAwardAchievements(user, context = {}) {
  const allAchievements = await Achievement.find().lean()
  const ownedIds = new Set(user.achievements.map((id) => String(id)))

  const newlyUnlocked = []

  for (const achievement of allAchievements) {
    if (ownedIds.has(String(achievement._id))) continue

    const unlocked = await checkAchievementCondition(user, achievement, context)
    if (!unlocked) continue

    grantAchievement(user, achievement)
    newlyUnlocked.push(achievement)
    ownedIds.add(String(achievement._id))
  }

  return newlyUnlocked
}

function buildUnlockMap(user) {
  const map = {}
  for (const entry of user.achievementUnlocks || []) {
    const id = String(entry.achievementId?._id || entry.achievementId)
    map[id] = entry.unlockedAt
    if (entry.achievementId?.key) {
      map[entry.achievementId.key] = entry.unlockedAt
    }
  }
  return map
}

async function seedAchievements() {
  const results = []
  for (const data of SEED_ACHIEVEMENTS) {
    const doc = await Achievement.findOneAndUpdate({ key: data.key }, data, {
      upsert: true,
      new: true,
    })
    results.push(doc)
  }
  return results
}

module.exports = {
  checkAndAwardAchievements,
  checkAchievementCondition,
  seedAchievements,
  buildUnlockMap,
  SEED_ACHIEVEMENTS,
}
