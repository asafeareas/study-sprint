import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Zap, Trophy, User, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { logout } from '../../services/auth.service'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sprint', icon: Zap, label: 'Sprint' },
  { to: '/leaderboard', icon: Trophy, label: 'Ranking' },
  { to: '/profile', icon: User, label: 'Perfil' },
]

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      title={label}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 rounded-lg transition-all duration-200 md:h-11 md:w-11 md:justify-center lg:h-auto lg:w-full lg:px-3 lg:py-2.5',
          isActive
            ? 'bg-primary/20 text-primary shadow-glow'
            : 'text-foreground-secondary hover:bg-surface-elevated hover:text-foreground',
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="hidden text-sm font-medium lg:inline">{label}</span>
    </NavLink>
  )
}

export default function Sidebar() {
  async function handleLogout() {
    await logout()
    window.location.href = '/login'
  }

  return (
    <>
      <motion.aside
        layout
        className="fixed left-0 top-0 z-40 hidden h-svh w-16 flex-col border-r border-border bg-surface py-6 md:flex lg:w-56"
      >
        <NavLink
          to="/dashboard"
          className="mb-6 flex items-center justify-center font-display text-[10px] font-bold tracking-widest text-primary lg:justify-start lg:px-6 lg:text-xs"
        >
          <span className="lg:hidden">SS</span>
          <span className="hidden lg:inline">STUDY SPRINT</span>
        </NavLink>

        <nav className="flex flex-1 flex-col items-center gap-1 px-2 lg:items-stretch lg:px-4">
          {links.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="flex justify-center px-2 lg:px-4">
          <button
            type="button"
            onClick={handleLogout}
            title="Sair"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-danger/10 hover:text-danger lg:w-full lg:justify-start lg:gap-3 lg:px-3"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className="hidden text-sm lg:inline">Sair</span>
          </button>
        </div>
      </motion.aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-border bg-surface/95 px-1 py-2 backdrop-blur-md md:hidden">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center gap-0.5 rounded-lg px-2 py-1 text-[10px]',
                isActive ? 'text-primary' : 'text-muted',
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className="flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] text-muted"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </nav>
    </>
  )
}
