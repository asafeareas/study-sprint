import { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, X, Volume2, VolumeX } from 'lucide-react'
import clsx from 'clsx'
import { Button } from '../ui'
import { formatTime } from '../../utils/time'
import { useTimerSounds } from '../../hooks/useTimerSounds'
import { useSettingsStore } from '../../stores/useSettingsStore'

const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function XpParticles() {
  const particles = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 160,
        delay: Math.random() * 0.3,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute text-lg text-accent"
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -80 - Math.random() * 40, scale: 0.3 }}
          transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
          style={{ left: `calc(50% + ${p.x}px)` }}
        >
          +XP
        </motion.span>
      ))}
    </div>
  )
}

export default function Timer({
  durationSeconds,
  elapsed,
  status,
  onStart,
  onPause,
  onResume,
  onAbandon,
  loading = false,
}) {
  const remaining = Math.max(0, durationSeconds - elapsed)
  const progress = durationSeconds > 0 ? elapsed / durationSeconds : 0
  const strokeOffset = CIRCUMFERENCE * (1 - progress)

  const timerSound = useSettingsStore((s) => s.timerSound)
  const setTimerSound = useSettingsStore((s) => s.setTimerSound)

  useTimerSounds({
    remainingSeconds: remaining,
    elapsed,
    status,
  })

  const isIdle = status === 'idle'
  const isRunning = status === 'running'
  const isPaused = status === 'paused'
  const isCompleted = status === 'completed'

  return (
    <div className="relative flex flex-col items-center">
      <button
        type="button"
        onClick={() => setTimerSound(!timerSound)}
        className="absolute -right-2 -top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface text-muted hover:text-primary"
        title={timerSound ? 'Desativar sons' : 'Ativar sons'}
      >
        {timerSound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </button>

      <div className="relative">
        {isCompleted && <XpParticles />}

        <svg width={220} height={220} className="-rotate-90">
          <circle
            cx={110}
            cy={110}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={6}
            className="text-surface-elevated"
          />
          <circle
            cx={110}
            cy={110}
            r={RADIUS}
            fill="none"
            stroke="url(#timerGradient)"
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeOffset}
            className="transition-[stroke-dashoffset] duration-1000 ease-linear drop-shadow-[0_0_12px_rgba(124,58,237,0.6)]"
          />
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <motion.span
                key="done"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-2xl text-accent text-glow-accent"
              >
                FEITO!
              </motion.span>
            ) : (
              <motion.span
                key="time"
                className="font-display text-4xl tracking-wider text-foreground"
              >
                {formatTime(remaining)}
              </motion.span>
            )}
          </AnimatePresence>
          <span className="mt-1 text-xs uppercase tracking-widest text-muted">
            {isPaused ? 'Pausado' : isRunning ? 'Em foco' : isCompleted ? 'Completo' : 'Pronto'}
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {isIdle && (
          <Button
            onClick={onStart}
            loading={loading}
            className="min-w-[140px] font-display tracking-wider"
          >
            <Play className="h-4 w-4" />
            INICIAR
          </Button>
        )}

        {isRunning && (
          <>
            <Button variant="secondary" onClick={onPause} className="font-display">
              <Pause className="h-4 w-4" />
              PAUSAR
            </Button>
            <Button variant="danger" onClick={onAbandon}>
              <X className="h-4 w-4" />
              ABANDONAR
            </Button>
          </>
        )}

        {isPaused && (
          <>
            <Button onClick={onResume} className="font-display">
              <RotateCcw className="h-4 w-4" />
              RETOMAR
            </Button>
            <Button variant="danger" onClick={onAbandon}>
              <X className="h-4 w-4" />
              ABANDONAR
            </Button>
          </>
        )}

        {isCompleted && (
          <p className={clsx('font-display text-sm text-accent animate-pulse-xp')}>
            Processando recompensas...
          </p>
        )}
      </div>
    </div>
  )
}
