import { Loader2 } from 'lucide-react'
import clsx from 'clsx'

const variants = {
  primary:
    'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25 focus-visible:ring-primary',
  secondary:
    'bg-transparent border border-border text-foreground hover:border-primary hover:text-primary focus-visible:ring-primary',
  danger:
    'bg-danger text-white hover:bg-danger-hover shadow-lg shadow-danger/25 focus-visible:ring-danger',
  ghost:
    'bg-transparent text-foreground-secondary hover:text-foreground hover:bg-surface-elevated focus-visible:ring-border',
}

export default function Button({
  children,
  variant = 'primary',
  loading = false,
  disabled = false,
  className,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}
