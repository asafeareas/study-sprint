function sendSuccess(res, data = null, message = 'OK', statusCode = 200) {
  return res.status(statusCode).json({ success: true, data, message })
}

function sendError(res, message = 'Erro interno', statusCode = 500, data = null) {
  return res.status(statusCode).json({ success: false, data, message })
}

class AppError extends Error {
  constructor(message, statusCode = 400) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
  }
}

module.exports = { sendSuccess, sendError, AppError }
