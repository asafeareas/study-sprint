import { AnimatePresence, motion } from 'framer-motion'
import { useXpFloatStore } from '../../stores/useXpFloatStore'

export default function XpFloatLayer() {
  const floats = useXpFloatStore((s) => s.floats)

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      <AnimatePresence>
        {floats.map((f) => (
          <motion.span
            key={f.id}
            className="absolute font-display text-2xl font-bold text-accent text-glow-accent"
            style={{ left: f.x, top: f.y, transform: 'translate(-50%, -50%)' }}
            initial={{ opacity: 1, y: 0, scale: 1 }}
            animate={{ opacity: 0, y: -72, scale: 1.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeOut' }}
          >
            +{f.amount} XP
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
