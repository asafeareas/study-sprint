const Achievement = require('../models/Achievement')
const { applyXpToUser } = require('./xp.service')

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

function isAchievementUnlocked(user, achievement) {
  const current = getStatValue(user, achievement.condition.type)
  return current >= achievement.condition.value
}

async function checkAndAwardAchievements(user) {
  const allAchievements = await Achievement.find().lean()
  const ownedIds = new Set(user.achievements.map((id) => String(id)))

  const newlyUnlocked = []

  for (const achievement of allAchievements) {
    if (ownedIds.has(String(achievement._id))) continue
    if (!isAchievementUnlocked(user, achievement)) continue

    user.achievements.push(achievement._id)
    if (achievement.xpReward > 0) {
      applyXpToUser(user, achievement.xpReward)
    }
    newlyUnlocked.push(achievement)
  }

  return newlyUnlocked
}

const SEED_ACHIEVEMENTS = [
  {
    key: 'first_sprint',
    name: 'Primeira Sprint',
    description: 'Complete sua primeira sessão de foco',
    icon: '🎯',
    xpReward: 25,
    condition: { type: 'sprints', value: 1 },
  },
  {
    key: 'sprint_10',
    name: 'Em Ritmo',
    description: 'Complete 10 sprints',
    icon: '⚡',
    xpReward: 50,
    condition: { type: 'sprints', value: 10 },
  },
  {
    key: 'sprint_50',
    name: 'Maratonista',
    description: 'Complete 50 sprints',
    icon: '🏃',
    xpReward: 150,
    condition: { type: 'sprints', value: 50 },
  },
  {
    key: 'streak_3',
    name: 'Consistente',
    description: 'Mantenha um streak de 3 dias',
    icon: '🔥',
    xpReward: 30,
    condition: { type: 'streak', value: 3 },
  },
  {
    key: 'streak_7',
    name: 'Semana de Fogo',
    description: 'Mantenha um streak de 7 dias',
    icon: '🔥',
    xpReward: 75,
    condition: { type: 'streak', value: 7 },
  },
  {
    key: 'streak_30',
    name: 'Imparável',
    description: 'Mantenha um streak de 30 dias',
    icon: '💎',
    xpReward: 300,
    condition: { type: 'streak', value: 30 },
  },
  {
    key: 'level_5',
    name: 'Subindo de Nível',
    description: 'Alcance o nível 5',
    icon: '⭐',
    xpReward: 50,
    condition: { type: 'level', value: 5 },
  },
  {
    key: 'level_10',
    name: 'Veterano',
    description: 'Alcance o nível 10',
    icon: '🌟',
    xpReward: 100,
    condition: { type: 'level', value: 10 },
  },
  {
    key: 'level_20',
    name: 'Lenda Viva',
    description: 'Alcance o nível 20',
    icon: '👑',
    xpReward: 250,
    condition: { type: 'level', value: 20 },
  },
  {
    key: 'minutes_500',
    name: 'Quinhentas Horas? Quase.',
    description: 'Estude por 500 minutos no total',
    icon: '📚',
    xpReward: 80,
    condition: { type: 'minutes', value: 500 },
  },
  {
    key: 'minutes_2500',
    name: 'Mestre do Tempo',
    description: 'Estude por 2500 minutos no total',
    icon: '⏳',
    xpReward: 200,
    condition: { type: 'minutes', value: 2500 },
  },
]

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
  seedAchievements,
  SEED_ACHIEVEMENTS,
}
