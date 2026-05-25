const { getRedis } = require('../config/redis')
const User = require('../models/User')
const { verifyToken } = require('../utils/jwt.utils')
const { AppError } = require('../utils/response')
const { setUserOnline } = require('../services/leaderboard.service')

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError('Token não fornecido', 401)
    }

    const token = authHeader.slice(7)
    const redis = getRedis()

    const isBlacklisted = await redis.get(`blacklist:${token}`)
    if (isBlacklisted) {
      throw new AppError('Sessão inválida. Faça login novamente.', 401)
    }

    let decoded
    try {
      decoded = verifyToken(token)
    } catch {
      throw new AppError('Token inválido ou expirado', 401)
    }

    const user = await User.findById(decoded.userId).populate('achievements')
    if (!user) {
      throw new AppError('Usuário não encontrado', 401)
    }

    req.user = user
    req.token = token

    setUserOnline(user._id).catch(() => {})

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = { authMiddleware }
