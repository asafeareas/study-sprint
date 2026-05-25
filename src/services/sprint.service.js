import api from './api'

export const sprintService = {
  start: (data) => api.post('/sprint/start', data),
  complete: (data) => api.post('/sprint/complete', data),
  abandon: (data) => api.post('/sprint/abandon', data),
  history: (params) => api.get('/sprint/history', { params }),
}
