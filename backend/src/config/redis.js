const Redis = require('ioredis')

let redis = null

function getRedis() {
  if (!redis) {
    const url = process.env.REDIS_URL || 'redis://localhost:6379'
    redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })

    redis.on('connect', () => {
      console.log('[Redis] Conectado com sucesso')
    })

    redis.on('error', (err) => {
      console.error('[Redis] Erro:', err.message)
    })
  }
  return redis
}

async function connectRedis() {
  const client = getRedis()
  if (client.status !== 'ready' && client.status !== 'connecting') {
    await client.connect()
  }
  return client
}

module.exports = { getRedis, connectRedis }
