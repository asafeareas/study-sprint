import { Link } from 'react-router-dom'
import { Card } from '../components/ui'

export default function Login() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background bg-gradient-radial p-4">
      <Card glow className="w-full max-w-md text-center">
        <h1 className="font-display text-2xl text-glow-primary text-primary">Study Sprint</h1>
        <p className="mt-2 text-foreground-secondary">Entre na sua jornada de estudos</p>
        <p className="mt-8 text-sm text-muted">Página de login — em breve</p>
        <Link
          to="/register"
          className="mt-4 inline-block text-sm text-primary hover:text-primary-hover"
        >
          Criar conta
        </Link>
      </Card>
    </div>
  )
}
