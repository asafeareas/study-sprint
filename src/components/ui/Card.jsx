import clsx from 'clsx'

export default function Card({
  children,
  glow = false,
  className,
  ...props
}) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-border bg-surface p-6 shadow-card',
        glow && 'animate-glow border-primary/30',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
