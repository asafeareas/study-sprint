import clsx from 'clsx'

export default function AuthField({
  label,
  id,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  autoComplete,
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-foreground-secondary">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={clsx(
          'w-full rounded-lg border bg-surface-elevated px-4 py-2.5 text-sm text-foreground',
          'placeholder:text-muted transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
          error ? 'border-danger' : 'border-border',
        )}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
