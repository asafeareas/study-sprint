const bcrypt = require('bcryptjs')
const { getRedis } = require('../config/redis')
const User = require('../models/User')
const { signToken, getTokenExpirySeconds } = require('../utils/jwt.utils')
const { sendSuccess, AppError } = require('../utils/response')
const { calculateRank } = require('../services/xp.service')
const { updateLeaderboard } = require('../services/leaderboard.service')

async function register(req, res, next) {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      throw new AppError('username, email e password são obrigatórios', 400)
    }

    if (password.length < 6) {
      throw new AppError('Senha deve ter no mínimo 6 caracteres', 400)
    }

    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    })
    if (existing) {
      throw new AppError('Email ou username já cadastrado', 409)
    }

    const hashed = await bcrypt.hash(password, 12)
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashed,
      level: 1,
      rank: calculateRank(1),
    })

    const token = signToken(user._id)
    await updateLeaderboard(user._id, 0, 0)

    console.log(`[Auth] Novo usuário registrado: ${user.username}`)

    return sendSuccess(
      res,
      { user: user.toPublicJSON(), token },
      'Conta criada com sucesso',
      201,
    )
  } catch (err) {
    next(err)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      throw new AppError('email e password são obrigatórios', 400)
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select('+password')
      .populate('achievements')

    if (!user) {
      throw new AppError('Credenciais inválidas', 401)
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      throw new AppError('Credenciais inválidas', 401)
    }

    const token = signToken(user._id)

    console.log(`[Auth] Login: ${user.username}`)

    return sendSuccess(res, {
      user: user.toPublicJSON(),
      token,
    })
  } catch (err) {
    next(err)
  }
}

async function me(req, res, next) {
  try {
    return sendSuccess(res, { user: req.user.toPublicJSON() })
  } catch (err) {
    next(err)
  }
}

async function logout(req, res, next) {
  try {
    const redis = getRedis()
    const ttl = getTokenExpirySeconds()
    await redis.set(`blacklist:${req.token}`, '1', 'EX', ttl)

    console.log(`[Auth] Logout: ${req.user.username}`)

    return sendSuccess(res, null, 'Logout realizado com sucesso')
  } catch (err) {
    next(err)
  }
}

module.exports = { register, login, me, logout }
