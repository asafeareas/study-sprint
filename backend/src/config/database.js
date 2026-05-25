const mongoose = require('mongoose')

async function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/study-sprint'

  mongoose.connection.on('connected', () => {
    console.log('[MongoDB] Conectado com sucesso')
  })

  mongoose.connection.on('error', (err) => {
    console.error('[MongoDB] Erro de conexão:', err.message)
  })

  await mongoose.connect(uri)
  return mongoose.connection
}

module.exports = { connectDatabase }
