import { Card } from '../components/ui'

export default function Sprint() {
  return (
    <div className="min-h-svh bg-background p-6">
      <h1 className="font-display text-2xl text-foreground">Sprint</h1>
      <p className="text-foreground-secondary">Modo foco — timer e sessões em breve</p>
      <Card className="mt-6 max-w-lg">
        <p className="font-display text-5xl text-primary animate-float">25:00</p>
      </Card>
    </div>
  )
}
