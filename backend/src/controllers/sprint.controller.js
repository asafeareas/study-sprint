const Session = require('../models/Session')
const User = require('../models/User')
const { sendSuccess, AppError } = require('../utils/response')
const { calculateXpGained, applyXpToUser } = require('../services/xp.service')
const { updateStreak } = require('../services/streak.service')
const { updateLeaderboard } = require('../services/leaderboard.service')
const { checkAndAwardAchievements } = require('../services/achievement.service')

async function start(req, res, next) {
  try {
    const { duration = 25, subject } = req.body

    const session = await Session.create({
      userId: req.user._id,
      duration,
      subject: subject || null,
    })

    console.log(`[Sprint] Iniciado: ${req.user.username} — session ${session._id}`)

    return sendSuccess(
      res,
      { sessionId: session._id, session },
      'Sprint iniciado',
      201,
    )
  } catch (err) {
    next(err)
  }
}

async function complete(req, res, next) {
  try {
    const { sessionId, duration } = req.body

    if (!sessionId) {
      throw new AppError('sessionId é obrigatório', 400)
    }

    const session = await Session.findOne({
      _id: sessionId,
      userId: req.user._id,
    })

    if (!session) {
      throw new AppError('Sessão não encontrada', 404)
    }

    if (session.status) {
      throw new AppError('Sessão já finalizada', 400)
    }

    const user = await User.findById(req.user._id)
    const finalDuration = duration ?? session.duration

    const streakResult = await updateStreak(user._id, user)
    const streakForXp = streakResult.streakIncremented
      ? streakResult.currentStreak
      : user.currentStreak

    const xpGained = calculateXpGained(finalDuration, streakForXp)

    if (streakResult.streakIncremented) {
      user.currentStreak = streakResult.currentStreak
      if (user.currentStreak > user.longestStreak) {
        user.longestStreak = user.currentStreak
      }
    }

    user.totalSprints += 1
    user.totalMinutes += finalDuration
    user.lastSprintDate = new Date()
    applyXpToUser(user, xpGained)

    session.duration = finalDuration
    session.xpGained = xpGained
    session.status = 'completed'
    session.completedAt = new Date()
    await session.save()
    await user.save()

    await updateLeaderboard(user._id, xpGained, user.xp)

    const newAchievements = await checkAndAwardAchievements(user)
    if (newAchievements.length > 0) {
      await user.save()
      await updateLeaderboard(user._id, 0, user.xp)
    }

    await user.populate('achievements')

    console.log(
      `[Sprint] Completo: ${user.username} +${xpGained} XP (streak: ${user.currentStreak})`,
    )

    return sendSuccess(res, {
      session,
      xpGained,
      user: user.toPublicJSON(),
      newAchievements,
      streak: {
        current: user.currentStreak,
        incremented: streakResult.streakIncremented,
        alreadySprintedToday: streakResult.alreadySprintedToday,
      },
    })
  } catch (err) {
    next(err)
  }
}

async function abandon(req, res, next) {
  try {
    const { sessionId } = req.body

    if (!sessionId) {
      throw new AppError('sessionId é obrigatório', 400)
    }

    const session = await Session.findOne({
      _id: sessionId,
      userId: req.user._id,
    })

    if (!session) {
      throw new AppError('Sessão não encontrada', 404)
    }

    if (session.status) {
      throw new AppError('Sessão já finalizada', 400)
    }

    session.status = 'abandoned'
    session.completedAt = new Date()
    await session.save()

    console.log(`[Sprint] Abandonado: ${req.user.username} — session ${sessionId}`)

    return sendSuccess(res, { session }, 'Sprint abandonado')
  } catch (err) {
    next(err)
  }
}

async function history(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10))
    const skip = (page - 1) * limit

    const filter = { userId: req.user._id, status: 'completed' }

    const [sessions, total] = await Promise.all([
      Session.find(filter)
        .sort({ completedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Session.countDocuments(filter),
    ])

    return sendSuccess(res, {
      sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { start, complete, abandon, history }
