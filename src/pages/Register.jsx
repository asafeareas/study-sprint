import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui'
import AuthShell from '../components/auth/AuthShell'
import AuthField from '../components/auth/AuthField'
import { register } from '../services/auth.service'
import { useAuthStore } from '../stores/useAuthStore'

const RANKS = [
  { name: 'Calouro', icon: '🌱', level: '1-2' },
  { name: 'Estudante', icon: '📖', level: '3-5' },
  { name: 'Dedicado', icon: '⚔️', level: '6-9' },
  { name: 'Focado', icon: '🎯', level: '10-14' },
  { name: 'Mestre', icon: '🏆', level: '15-19' },
  { name: 'Lendário', icon: '👑', level: '20+' },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateForm({ username, email, password, confirmPassword }) {
  const errors = {}

  if (!username || username.trim().length < 3) {
    errors.username = 'Username deve ter no mínimo 3 caracteres'
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = 'Informe um email válido'
  }

  if (!password || password.length < 6) {
    errors.password = 'Senha deve ter no mínimo 6 caracteres'
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem'
  }

  return errors
}

export default function Register() {
  const navigate = useNavigate()
  const authLogin = useAuthStore((s) => s.login)

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const errors = validateForm({ username, email, password, confirmPassword })
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      triggerShake()
      return
    }

    setLoading(true)
    try {
      const { data } = await register(username.trim(), email.trim(), password)
      authLogin(data.user, data.token)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Falha ao criar conta. Tente novamente.')
      triggerShake()
    } finally {
      setLoading(false)
    }
  }

  function handleBlur(field) {
    const errors = validateForm({ username, email, password, confirmPassword })
    if (errors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: errors[field] }))
    } else {
      setFieldErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  return (
    <AuthShell shake={shake} className="!p-5 sm:!p-6">
      <h2 className="mb-1 font-display text-lg text-foreground">Criar conta</h2>
      <p className="mb-5 text-sm text-foreground-secondary">
        Suba de rank estudando com foco
      </p>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <AuthField
          id="username"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onBlur={() => handleBlur('username')}
          error={fieldErrors.username}
          placeholder="seu_nick"
          autoComplete="username"
        />

        <AuthField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          error={fieldErrors.email}
          placeholder="seu@email.com"
          autoComplete="email"
        />

        <AuthField
          id="password"
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur('password')}
          error={fieldErrors.password}
          placeholder="mín. 6 caracteres"
          autoComplete="new-password"
        />

        <AuthField
          id="confirmPassword"
          label="Confirmar senha"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          error={fieldErrors.confirmPassword}
          placeholder="repita a senha"
          autoComplete="new-password"
        />

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <Button type="submit" loading={loading} className="mt-1 w-full font-display tracking-wider">
          CRIAR CONTA
        </Button>
      </form>

      <div className="mt-6 border-t border-border pt-5">
        <p className="mb-3 text-center text-xs uppercase tracking-widest text-muted">
          Ranks disponíveis
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {RANKS.map((rank) => (
            <div
              key={rank.name}
              title={`${rank.name} (nível ${rank.level})`}
              className="flex flex-col items-center gap-0.5 rounded-lg border border-border/60 bg-surface-elevated/50 px-2 py-1.5 transition-colors hover:border-primary/40"
            >
              <span className="text-lg leading-none">{rank.icon}</span>
              <span className="font-display text-[9px] uppercase tracking-wide text-foreground-secondary">
                {rank.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-5 text-center text-sm text-foreground-secondary">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-primary-hover">
          Entrar
        </Link>
      </p>
    </AuthShell>
  )
}
