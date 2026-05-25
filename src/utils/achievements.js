export function formatAchievementCondition(condition) {
  if (!condition) return ''

  const { type, value } = condition

  switch (type) {
    case 'sprints':
      return `Complete ${value} sprint${value > 1 ? 's' : ''}`
    case 'streak':
      return `${value} dia${value > 1 ? 's' : ''} seguidos`
    case 'level':
      return `Alcance o nível ${value}`
    case 'minutes':
      return `Estude ${value} minutos`
    case 'top_rank':
      return `Entre no top ${value} do ranking`
    case 'night_sprint':
      return `Complete sprint após ${value}h`
    default:
      return condition.description || ''
  }
}

export function formatUnlockDate(date) {
  if (!date) return null
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
