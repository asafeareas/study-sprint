import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Zap,
  Trophy,
  User,
  LogOut,
} from 'lucide-react'
import clsx from 'clsx'
import { logout } from '../../services/auth.service'

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/sprint', icon: Zap, label: 'Sprint' },
  { to: '/leaderboard', icon: Trophy, label: 'Ranking' },
  { to: '/profile', icon: User, label: 'Perfil' },
]

export default function Sidebar() {
  async function handleLogout() {
    await logout()
    window.location.href = '/login'
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-svh w-16 flex-col items-center border-r border-border bg-surface py-6">
      <NavLink to="/dashboard" className="mb-8 font-display text-[10px] font-bold tracking-widest text-primary">
        SS
      </NavLink>

      <nav className="flex flex-1 flex-col items-center gap-2">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={label}
            className={({ isActive }) =>
              clsx(
                'flex h-11 w-11 items-center justify-center rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary/20 text-primary shadow-glow'
                  : 'text-foreground-secondary hover:bg-surface-elevated hover:text-foreground',
              )
            }
          >
            <Icon className="h-5 w-5" />
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        title="Sair"
        className="flex h-11 w-11 items-center justify-center rounded-lg text-foreground-secondary transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </aside>
  )
}
