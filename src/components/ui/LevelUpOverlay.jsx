import { AnimatePresence, motion } from 'framer-motion'
import { useLevelUpStore } from '../../stores/useLevelUpStore'
import { Badge } from './index'

export default function LevelUpOverlay() {
  const overlay = useLevelUpStore((s) => s.overlay)
  const hide = useLevelUpStore((s) => s.hide)

  return (
    <AnimatePresence>
      {overlay && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={hide}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.p
              className="font-display text-5xl font-bold tracking-widest text-accent sm:text-7xl"
              animate={{
                textShadow: [
                  '0 0 20px rgba(245,158,11,0.5)',
                  '0 0 60px rgba(245,158,11,0.9)',
                  '0 0 20px rgba(245,158,11,0.5)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              LEVEL UP!
            </motion.p>

            <p className="mt-6 font-display text-3xl text-primary">
              Nível {overlay.previousLevel} → {overlay.level}
            </p>

            {overlay.rank && (
              <Badge variant="rank" className="mt-4 text-base">
                {overlay.rank}
              </Badge>
            )}

            <button
              type="button"
              onClick={hide}
              className="mt-10 rounded-lg bg-primary px-8 py-3 font-medium text-white hover:bg-primary-hover"
            >
              Continuar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
