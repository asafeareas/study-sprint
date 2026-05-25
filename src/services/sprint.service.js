import api from './api'

export const sprintService = {
  start: (data) => api.post('/sprints', data),
  complete: (id, data) => api.patch(`/sprints/${id}/complete`, data),
  history: () => api.get('/sprints'),
}
