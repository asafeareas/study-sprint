const Achievement = require('../models/Achievement')
const { sendSuccess, AppError } = require('../utils/response')
const { seedAchievements, buildUnlockMap } = require('../services/achievement.service')

async function getAll(req, res, next) {
  try {
    const achievements = await Achievement.find().sort({ 'condition.value': 1 })
    return sendSuccess(res, { achievements })
  } catch (err) {
    next(err)
  }
}

async function getMine(req, res, next) {
  try {
    await req.user.populate([
      { path: 'achievements' },
      { path: 'achievementUnlocks.achievementId' },
    ])

    const all = await Achievement.find().lean()
    const ownedKeys = new Set(req.user.achievements.map((a) => a.key))
    const unlockMap = buildUnlockMap(req.user)

    const withStatus = all.map((a) => {
      const unlocked = ownedKeys.has(a.key)
      const unlockedAt =
        unlockMap[a.key] ||
        unlockMap[String(a._id)] ||
        null

      return {
        ...a,
        unlocked,
        unlockedAt,
      }
    })

    return sendSuccess(res, {
      achievements: req.user.achievements,
      all: withStatus,
      unlockMap,
    })
  } catch (err) {
    next(err)
  }
}

async function seed(req, res, next) {
  try {
    if (process.env.NODE_ENV === 'production') {
      throw new AppError('Endpoint disponível apenas em desenvolvimento', 403)
    }

    const achievements = await seedAchievements()
    console.log(`[Achievements] Seed: ${achievements.length} conquistas`)

    return sendSuccess(res, { achievements }, 'Conquistas populadas com sucesso', 201)
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getMine, seed }
