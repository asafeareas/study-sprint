import { motion } from 'framer-motion'

export default function LoadingScreen({ message = 'Carregando...' }) {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background">
      <motion.h1
        className="auth-title-gradient font-display text-2xl font-bold tracking-[0.3em]"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        STUDY SPRINT
      </motion.h1>

      <div className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-surface-elevated">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.8, ease: 'easeInOut', repeat: Infinity }}
        />
      </div>

      <p className="mt-4 text-sm text-muted">{message}</p>
    </div>
  )
}
