import clsx from 'clsx'

const variants = {
  rank: 'bg-accent/15 text-accent border-accent/30 font-display',
  xp: 'bg-streak/15 text-streak border-streak/30 font-display',
  streak: 'bg-orange-500/15 text-orange-400 border-orange-500/30 font-display',
  novo: 'bg-primary/15 text-primary border-primary/30 animate-pulse-xp',
}

export default function Badge({
  children,
  variant = 'rank',
  className,
  ...props
}) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}
