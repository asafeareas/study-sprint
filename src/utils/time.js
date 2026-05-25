export function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatRelativeTime(date) {
  const now = Date.now()
  const then = new Date(date).getTime()
  const diffSec = Math.floor((now - then) / 1000)

  if (diffSec < 60) return 'agora mesmo'
  if (diffSec < 3600) return `há ${Math.floor(diffSec / 60)} min`
  if (diffSec < 86400) return `há ${Math.floor(diffSec / 3600)} h`
  if (diffSec < 604800) return `há ${Math.floor(diffSec / 86400)} dias`
  return new Date(date).toLocaleDateString('pt-BR')
}
