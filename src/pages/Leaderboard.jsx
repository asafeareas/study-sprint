import { Card } from '../components/ui'

export default function Leaderboard() {
  return (
    <div className="min-h-svh bg-background p-6">
      <h1 className="font-display text-2xl text-foreground">Leaderboard</h1>
      <p className="text-foreground-secondary">Ranking global — em breve</p>
      <Card className="mt-6">
        <p className="text-muted">Nenhum dado carregado ainda.</p>
      </Card>
    </div>
  )
}
