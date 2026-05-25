const { sendSuccess, AppError } = require('../utils/response')
const {
  getLeaderboard,
  getUserRank,
  getOnlineUsers,
} = require('../services/leaderboard.service')

async function leaderboard(req, res, next) {
  try {
    const type = req.query.type === 'weekly' ? 'weekly' : 'alltime'
    const entries = await getLeaderboard(type)

    return sendSuccess(res, { type, entries })
  } catch (err) {
    next(err)
  }
}

async function online(req, res, next) {
  try {
    const users = await getOnlineUsers()
    return sendSuccess(res, { users, count: users.length })
  } catch (err) {
    next(err)
  }
}

async function myRank(req, res, next) {
  try {
    const [alltime, weekly] = await Promise.all([
      getUserRank(req.user._id, 'alltime'),
      getUserRank(req.user._id, 'weekly'),
    ])

    return sendSuccess(res, {
      user: req.user.toPublicJSON(),
      ranking: { alltime, weekly },
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { leaderboard, online, myRank }
