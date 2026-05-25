import api from './api'

export class AchievementError extends Error {
  constructor(message, status = null) {
    super(message)
    this.name = 'AchievementError'
    this.status = status
  }
}

function extractErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Erro ao carregar conquistas.'
}

function parseResponse(response) {
  const { success, data, message } = response.data
  if (!success) throw new AchievementError(message || 'Erro na requisição')
  return { data, message }
}

export async function getAchievements() {
  try {
    const response = await api.get('/achievements')
    return parseResponse(response)
  } catch (error) {
    if (error instanceof AchievementError) throw error
    throw new AchievementError(extractErrorMessage(error), error.response?.status)
  }
}

export async function getMyAchievements() {
  try {
    const response = await api.get('/achievements/mine')
    return parseResponse(response)
  } catch (error) {
    if (error instanceof AchievementError) throw error
    throw new AchievementError(extractErrorMessage(error), error.response?.status)
  }
}
