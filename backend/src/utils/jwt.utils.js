const jwt = require('jsonwebtoken')

const JWT_SECRET = () => process.env.JWT_SECRET || 'dev-secret-change-me'
const JWT_EXPIRES_IN = () => process.env.JWT_EXPIRES_IN || '7d'

function signToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET(), { expiresIn: JWT_EXPIRES_IN() })
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET())
}

function getTokenExpirySeconds() {
  const expiresIn = JWT_EXPIRES_IN()
  const match = expiresIn.match(/^(\d+)([dhms])$/)
  if (!match) return 7 * 24 * 60 * 60
  const value = parseInt(match[1], 10)
  const unit = match[2]
  const multipliers = { s: 1, m: 60, h: 3600, d: 86400 }
  return value * (multipliers[unit] || 86400)
}

module.exports = { signToken, verifyToken, getTokenExpirySeconds }
