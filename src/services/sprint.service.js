import api from './api'

export class SprintError extends Error {
  constructor(message, status = null) {
    super(message)
    this.name = 'SprintError'
    this.status = status
  }
}

function extractErrorMessage(error) {
  return (
    error.response?.data?.message ||
    error.message ||
    'Erro de conexão. Tente novamente.'
  )
}

function parseResponse(response) {
  const { success, data, message } = response.data
  if (!success) {
    throw new SprintError(message || 'Erro na requisição')
  }
  return { data, message }
}

export async function startSprint(subject, duration) {
  try {
    const response = await api.post('/sprint/start', {
      subject: subject || undefined,
      duration,
    })
    return parseResponse(response)
  } catch (error) {
    if (error instanceof SprintError) throw error
    throw new SprintError(extractErrorMessage(error), error.response?.status)
  }
}

export async function completeSprint(sessionId, duration) {
  try {
    const response = await api.post('/sprint/complete', { sessionId, duration })
    return parseResponse(response)
  } catch (error) {
    if (error instanceof SprintError) throw error
    throw new SprintError(extractErrorMessage(error), error.response?.status)
  }
}

export async function abandonSprint(sessionId) {
  try {
    const response = await api.post('/sprint/abandon', { sessionId })
    return parseResponse(response)
  } catch (error) {
    if (error instanceof SprintError) throw error
    throw new SprintError(extractErrorMessage(error), error.response?.status)
  }
}

export async function getHistory(page = 1, limit = 10) {
  try {
    const response = await api.get('/sprint/history', { params: { page, limit } })
    return parseResponse(response)
  } catch (error) {
    if (error instanceof SprintError) throw error
    throw new SprintError(extractErrorMessage(error), error.response?.status)
  }
}
