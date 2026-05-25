import { Link } from 'react-router-dom'
import { Card } from '../components/ui'

export default function Register() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background bg-gradient-radial p-4">
      <Card glow className="w-full max-w-md text-center">
        <h1 className="font-display text-2xl text-primary">Criar conta</h1>
        <p className="mt-2 text-foreground-secondary">Junte-se ao Study Sprint</p>
        <p className="mt-8 text-sm text-muted">Página de registro — em breve</p>
        <Link
          to="/login"
          className="mt-4 inline-block text-sm text-primary hover:text-primary-hover"
        >
          Já tenho conta
        </Link>
      </Card>
    </div>
  )
}
