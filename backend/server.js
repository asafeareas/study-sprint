require('dotenv').config()

const { createApp } = require('./src/app')
const { connectDatabase } = require('./src/config/database')
const { connectRedis } = require('./src/config/redis')
const { startWeeklyResetCron } = require('./src/services/leaderboard.service')
const { connectWithRetry } = require('./src/utils/connectRetry')

const PORT = process.env.PORT || 3001

async function startServer() {
  try {
    await connectWithRetry('MongoDB', connectDatabase)
    await connectWithRetry('Redis', connectRedis)

    startWeeklyResetCron()

    const app = createApp()

    app.listen(PORT, () => {
      console.log(`[Server] Study Sprint API rodando em http://localhost:${PORT}`)
      console.log(`[Server] Ambiente: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (err) {
    console.error('[Server] Falha ao iniciar:', err.message)
    process.exit(1)
  }
}

startServer()
