import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui'

export default function NotFound() {
  return (
    <div className="auth-cyber-bg flex min-h-svh flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="font-display text-8xl font-bold text-primary/30">404</p>
        <h1 className="mt-4 font-display text-2xl text-foreground">Sessão não encontrada</h1>
        <p className="mt-2 max-w-md text-foreground-secondary">
          Esta rota não existe no mapa do Study Sprint. Volte para sua base e continue
          acumulando XP.
        </p>
        <Link to="/dashboard" className="mt-8 inline-block">
          <Button className="font-display tracking-wider">VOLTAR AO DASHBOARD</Button>
        </Link>
      </motion.div>
    </div>
  )
}
