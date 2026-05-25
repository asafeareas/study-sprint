import api from './api'

export class RankingError extends Error {
  constructor(message, status = null) {
    super(message)
    this.name = 'RankingError'
    this.status = status
  }
}

function extractErrorMessage(error) {
  return error.response?.data?.message || error.message || 'Erro ao carregar ranking.'
}

function parseResponse(response) {
  const { success, data, message } = response.data
  if (!success) throw new RankingError(message || 'Erro na requisição')
  return { data, message }
}

export async function getMyRank() {
  try {
    const response = await api.get('/ranking/me')
    return parseResponse(response)
  } catch (error) {
    if (error instanceof RankingError) throw error
    throw new RankingError(extractErrorMessage(error), error.response?.status)
  }
}

export async function getLeaderboard(type = 'alltime') {
  try {
    const response = await api.get('/ranking/leaderboard', { params: { type } })
    return parseResponse(response)
  } catch (error) {
    if (error instanceof RankingError) throw error
    throw new RankingError(extractErrorMessage(error), error.response?.status)
  }
}
