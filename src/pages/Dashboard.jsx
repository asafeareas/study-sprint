import { Badge, Card, ProgressBar } from '../components/ui'

export default function Dashboard() {
  return (
    <div className="min-h-svh bg-background p-6">
      <header className="mb-8">
        <h1 className="font-display text-2xl text-foreground">Dashboard</h1>
        <p className="text-foreground-secondary">Sua base de operações de estudo</p>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <Badge variant="xp">+120 XP</Badge>
          <p className="mt-2 font-display text-3xl text-accent">2.450</p>
          <p className="text-sm text-foreground-secondary">XP total</p>
        </Card>
        <Card>
          <Badge variant="streak">7 dias</Badge>
          <p className="mt-2 font-display text-3xl text-streak">🔥</p>
          <p className="text-sm text-foreground-secondary">Streak ativo</p>
        </Card>
        <Card glow>
          <Badge variant="rank">Rank B</Badge>
          <ProgressBar value={65} label="Progresso para Rank A" color="primary" className="mt-4" />
        </Card>
      </div>
    </div>
  )
}
