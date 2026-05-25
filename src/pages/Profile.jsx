import { Card, ProgressBar } from '../components/ui'

export default function Profile() {
  return (
    <div className="min-h-svh bg-background p-6">
      <h1 className="font-display text-2xl text-foreground">Perfil</h1>
      <p className="text-foreground-secondary">Suas estatísticas e conquistas</p>
      <Card className="mt-6 max-w-md">
        <ProgressBar value={40} label="Nível 12" color="accent" />
      </Card>
    </div>
  )
}
