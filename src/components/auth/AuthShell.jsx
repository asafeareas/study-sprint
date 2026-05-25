import { motion } from 'framer-motion'
import { Card } from '../ui'

const pageVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function AuthShell({ children, shake = false, className }) {
  return (
    <div className="auth-cyber-bg relative flex min-h-svh items-center justify-center p-4">
      <motion.div
        className="relative z-10 w-full max-w-md"
        variants={pageVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          animate={shake ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="auth-title-gradient font-display text-2xl font-bold tracking-[0.2em] sm:text-3xl">
              STUDY SPRINT
            </h1>
            <p className="mt-2 text-sm text-foreground-secondary">
              Foco gamificado para sua jornada de estudos
            </p>
          </div>

          <Card glow className={className}>
            {children}
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
