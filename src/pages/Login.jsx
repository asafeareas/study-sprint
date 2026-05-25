import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'
import AuthShell from '../components/auth/AuthShell'
import AuthField from '../components/auth/AuthField'
import { login } from '../services/auth.service'
import { toast } from '../components/ui/ToastProvider'
import { useAuthStore } from '../stores/useAuthStore'

export default function Login() {
  const navigate = useNavigate()
  const authLogin = useAuthStore((s) => s.login)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Preencha email e senha.')
      triggerShake()
      return
    }

    setLoading(true)
    try {
      const { data } = await login(email, password)
      authLogin(data.user, data.token)
      toast.success(`Bem-vindo, ${data.user.username}!`)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.message || 'Falha ao entrar. Tente novamente.'
      setError(msg)
      toast.error(msg)
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  return (
    <AuthShell shake={shake}>
      <h2 className="mb-1 font-display text-lg text-foreground">Entrar</h2>
      <p className="mb-6 text-sm text-foreground-secondary">
        Continue sua jornada de XP e ranks
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          autoComplete="email"
        />

        <AuthField
          id="password"
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} className="mt-2 w-full font-display tracking-wider">
          ENTRAR
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground-secondary">
        Não tem conta?{' '}
        <Link to="/register" className="font-medium text-primary hover:text-primary-hover">
          Criar conta
        </Link>
      </p>
    </AuthShell>
  )
}
