const rateLimit = require('express-rate-limit')

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Muitas requisições. Tente novamente em alguns minutos.',
  },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Muitas tentativas de autenticação. Aguarde e tente novamente.',
  },
})

module.exports = { generalLimiter, authLimiter }
