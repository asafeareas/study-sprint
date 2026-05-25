const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { generalLimiter } = require('./middleware/rateLimit.middleware')
const { sendError, AppError } = require('./utils/response')

const authRoutes = require('./routes/auth.routes')
const sprintRoutes = require('./routes/sprint.routes')
const rankingRoutes = require('./routes/ranking.routes')
const achievementRoutes = require('./routes/achievement.routes')

function createApp() {
  const app = express()

  app.use(helmet())
  app.use(cors())
  app.use(express.json())
  app.use(generalLimiter)

  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
      next()
    })
  }

  app.get('/api/health', (req, res) => {
    res.json({ success: true, data: { status: 'ok' }, message: 'Study Sprint API' })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/sprint', sprintRoutes)
  app.use('/api/ranking', rankingRoutes)
  app.use('/api/achievements', achievementRoutes)

  app.use((req, res) => {
    sendError(res, 'Rota não encontrada', 404)
  })

  app.use((err, req, res, next) => {
    if (err instanceof AppError) {
      return sendError(res, err.message, err.statusCode)
    }

    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(', ')
      return sendError(res, message, 400)
    }

    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'campo'
      return sendError(res, `${field} já está em uso`, 409)
    }

    console.error('[Error]', err)
    return sendError(res, 'Erro interno do servidor', 500)
  })

  return app
}

module.exports = { createApp }
