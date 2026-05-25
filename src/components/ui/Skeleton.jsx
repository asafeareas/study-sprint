import clsx from 'clsx'

export function Skeleton({ className }) {
  return <div className={clsx('skeleton-shimmer rounded-lg bg-surface-elevated', className)} />
}

export function StatCardSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-6">
      <Skeleton className="h-12 w-12 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  )
}

export function LeaderboardRowSkeleton() {
  return (
    <tr className="border-b border-border/50">
      <td className="px-4 py-3"><Skeleton className="h-4 w-8" /></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell"><Skeleton className="h-5 w-16" /></td>
      <td className="px-4 py-3"><Skeleton className="h-4 w-14" /></td>
      <td className="hidden px-4 py-3 md:table-cell"><Skeleton className="h-4 w-8" /></td>
    </tr>
  )
}
