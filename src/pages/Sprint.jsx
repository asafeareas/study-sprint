import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Timer from '../components/sprint/Timer'
import SprintResultModal from '../components/sprint/SprintResultModal'
import { ProgressBar } from '../components/ui'
import { useAuthStore } from '../stores/useAuthStore'
import { useSprintStore } from '../stores/useSprintStore'
import {
  startSprint as apiStartSprint,
  completeSprint as apiCompleteSprint,
  abandonSprint as apiAbandonSprint,
} from '../services/sprint.service'
import { calculateXpPreview } from '../utils/xp'

const MOTIVATIONAL = [
  'Um sprint de cada vez. Consistência vence intensidade.',
  'Seu futuro eu agradece cada minuto de foco agora.',
  'Rank Lendário não se constrói em um dia — mas começa hoje.',
  'Distração é temporária. O XP é permanente.',
  'Respire. Foque. Conquiste.',
  'Cada 25 minutos te aproxima do topo do ranking.',
  'O streak não mente: apareça todo dia.',
  'Estudar é um boss fight. Você está no turno certo.',
]

function FloatingParticles() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: 2 + Math.random() * 4,
    duration: 8 + Math.random() * 12,
    delay: Math.random() * 5,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/30"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

export default function Sprint() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)

  const {
    sessionId,
    status,
    duration,
    durationSeconds,
    elapsed,
    subject,
    xpPreview,
    setSessionId,
    startSprint,
    pauseSprint,
    resumeSprint,
    completeSprint,
    abandonSprint,
    tick,
    reset,
    configure,
  } = useSprintStore()

  const [quoteIndex, setQuoteIndex] = useState(0)
  const [apiLoading, setApiLoading] = useState(false)
  const [error, setError] = useState('')
  const [resultModal, setResultModal] = useState(null)

  const startedRef = useRef(false)
  const completedRef = useRef(false)

  const progressPercent =
    durationSeconds > 0 ? (elapsed / durationSeconds) * 100 : 0

  useEffect(() => {
    const id = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % MOTIVATIONAL.length)
    }, 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (status !== 'running') return undefined
    const id = setInterval(() => tick(), 1000)
    return () => clearInterval(id)
  }, [status, tick])

  async function initSession() {
    if (sessionId || apiLoading) return
    setApiLoading(true)
    setError('')
    try {
      const { data } = await apiStartSprint(subject, duration)
      setSessionId(data.sessionId)
      startSprint()
    } catch (err) {
      setError(err.message)
    } finally {
      setApiLoading(false)
    }
  }

  useEffect(() => {
    if (!location.state?.autoStart && status === 'idle' && !sessionId) {
      configure({
        subject: '',
        duration: 25,
        currentStreak: user?.currentStreak ?? 0,
      })
    }
  }, [location.state?.autoStart, status, sessionId, configure, user?.currentStreak])

  useEffect(() => {
    if (location.state?.autoStart && !startedRef.current && status === 'idle') {
      startedRef.current = true
      initSession()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.autoStart])

  useEffect(() => {
    if (status !== 'completed' || !sessionId || completedRef.current) return

    completedRef.current = true
    const previousLevel = user?.level

    async function finish() {
      try {
        const { data } = await apiCompleteSprint(sessionId, duration)
        setUser(data.user)
        setResultModal({
          xpGained: data.xpGained,
          user: data.user,
          previousLevel,
          newAchievements: data.newAchievements || [],
        })
      } catch (err) {
        setError(err.message)
        completedRef.current = false
      }
    }

    finish()
  }, [status, sessionId, duration, setUser, user?.level])

  async function handleAbandon() {
    if (sessionId) {
      try {
        await apiAbandonSprint(sessionId)
      } catch {
        // segue com reset local
      }
    }
    reset()
    navigate('/dashboard')
  }

  function handleCloseResult() {
    setResultModal(null)
    reset()
    completedRef.current = false
    startedRef.current = false
    navigate('/dashboard')
  }

  function handleStart() {
    if (!sessionId) {
      initSession()
    } else {
      startSprint()
    }
  }

  const displayXp = calculateXpPreview(duration, user?.currentStreak ?? 0) || xpPreview

  return (
    <div className="relative min-h-svh overflow-hidden bg-background">
      <FloatingParticles />

      <Link
        to="/dashboard"
        className="group fixed left-4 top-4 z-20 flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm text-foreground-secondary opacity-0 transition-all hover:border-border hover:bg-surface/80 hover:opacity-100 focus:opacity-100"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="opacity-0 transition-opacity group-hover:opacity-100">
          Voltar
        </span>
      </Link>

      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center px-4 py-16">
        <motion.p
          key={quoteIndex}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 max-w-lg text-center text-sm italic text-foreground-secondary"
        >
          "{MOTIVATIONAL[quoteIndex]}"
        </motion.p>

        {subject && (
          <p className="mb-2 font-display text-sm uppercase tracking-widest text-primary">
            {subject}
          </p>
        )}

        <Timer
          durationSeconds={durationSeconds}
          elapsed={elapsed}
          status={apiLoading && status === 'idle' ? 'idle' : status}
          onStart={handleStart}
          onPause={pauseSprint}
          onResume={resumeSprint}
          onAbandon={handleAbandon}
        />

        {error && (
          <p className="mt-4 text-sm text-danger" role="alert">
            {error}
          </p>
        )}

        <div className="mt-10 w-full max-w-xs">
          <ProgressBar
            value={progressPercent}
            label={`~${displayXp} XP ao completar`}
            color="accent"
          />
        </div>
      </div>

      <SprintResultModal
        isOpen={Boolean(resultModal)}
        onClose={handleCloseResult}
        xpGained={resultModal?.xpGained ?? 0}
        user={resultModal?.user}
        previousLevel={resultModal?.previousLevel}
        newAchievements={resultModal?.newAchievements}
      />
    </div>
  )
}
