import api from './api'

export const rankingService = {
  leaderboard: (params) => api.get('/ranking', { params }),
  myRank: () => api.get('/ranking/me'),
}
