import api from './api'
import { useAuthStore } from '../stores/useAuthStore'

export class AuthError extends Error {
  constructor(message, status = null) {
    super(message)
    this.name = 'AuthError'
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
    throw new AuthError(message || 'Erro na requisição')
  }
  return { data, message }
}

export async function login(email, password) {
  try {
    const response = await api.post('/auth/login', { email, password })
    return parseResponse(response)
  } catch (error) {
    if (error instanceof AuthError) throw error
    throw new AuthError(extractErrorMessage(error), error.response?.status)
  }
}

export async function register(username, email, password) {
  try {
    const response = await api.post('/auth/register', { username, email, password })
    return parseResponse(response)
  } catch (error) {
    if (error instanceof AuthError) throw error
    throw new AuthError(extractErrorMessage(error), error.response?.status)
  }
}

export async function getMe() {
  try {
    const response = await api.get('/auth/me')
    return parseResponse(response)
  } catch (error) {
    if (error instanceof AuthError) throw error
    throw new AuthError(extractErrorMessage(error), error.response?.status)
  }
}

export async function logout() {
  try {
    await api.post('/auth/logout')
  } catch {
    // Ignora falha de rede — limpa sessão local mesmo assim
  } finally {
    useAuthStore.getState().logout()
  }
}
