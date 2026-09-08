'use client'

import { useEffect } from 'react'
import {
  X,
  User,
  Truck,
  Factory,
  Recycle,
  Scale,
  Camera,
  MapPin,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import {
  categoryLabels,
  formatRupees,
  segregate,
  type Order,
} from '@/lib/waste-data'

export function WasteJourneyModal({
  order,
  open,
  onClose,
}: {
  order: Order | null
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !order) return null

  const slices = segregate(order)
  const weight = order.verifiedWeight ?? order.estWeight

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Waste journey"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card shadow-2xl sm:rounded-3xl"
      >
        <div className="sticky top-0 flex items-start justify-between gap-4 border-b border-border bg-card/95 px-6 py-4 backdrop-blur">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Waste journey</h2>
            <p className="font-mono text-xs text-muted-foreground">
              Txn #{order.transactionId ?? '—'} · {weight} kg
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <ol className="space-y-0 p-6">
          <Stage
            icon={User}
            title="Citizen"
            name={order.citizenName}
            lines={[
              `${weight} kg deposited`,
              categoryLabels(order.categories),
            ]}
          />
          <Stage
            icon={Truck}
            title="Verified Collector"
            name={`${order.collectorName} · ⭐ ${order.collectorRating}`}
            lines={[
              `Weighed ${weight} kg`,
              order.photoVerified ? 'Photo + OTP + GPS verified' : 'Verification pending',
            ]}
            evidence
          />
          <Stage
            icon={Factory}
            title="Material Recovery Hub"
            name={order.hubName}
            lines={slices.map((s) => `${s.label}: ${s.kg} kg`)}
          />
          <Stage
            icon={Recycle}
            title="Authorized Recycler"
            name={order.recyclerName}
            lines={[
              order.batchId ? `Batch #${order.batchId}` : 'Batch pending dispatch',
              order.payout === 'credits'
                ? `${order.pointsAwarded ?? 0} Eco Points to citizen`
                : `${formatRupees(order.cashAwarded ?? 0)} paid to citizen`,
            ]}
            isLast
          />
        </ol>

        <div className="border-t border-border bg-accent px-6 py-4 text-center text-accent-foreground">
          <p className="text-pretty text-sm font-semibold">
            We don&apos;t just collect waste. We make its journey visible.
          </p>
        </div>
      </div>
    </div>
  )
}

function Stage({
  icon: Icon,
  title,
  name,
  lines,
  evidence,
  isLast,
}: {
  icon: LucideIcon
  title: string
  name: string
  lines: string[]
  evidence?: boolean
  isLast?: boolean
}) {
  return (
    <li className="flex gap-4 pb-6 last:pb-0">
      <div className="flex flex-col items-center">
        <span className="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
          <Icon className="size-5" />
        </span>
        {!isLast && <span className="mt-1 w-0.5 flex-1 bg-primary/40" />}
      </div>
      <div className="min-w-0 flex-1 pt-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        <p className="text-sm font-bold">{name}</p>
        <ul className="mt-1.5 space-y-1">
          {lines.map((l, i) => (
            <li key={i} className="text-sm text-muted-foreground">
              {l}
            </li>
          ))}
        </ul>
        {evidence && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip icon={Scale} label="Digital scale" />
            <Chip icon={Camera} label="Photo" />
            <Chip icon={ShieldCheck} label="OTP" />
            <Chip icon={MapPin} label="GPS" />
          </div>
        )}
      </div>
    </li>
  )
}

function Chip({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
      <Icon className="size-3" />
      {label}
    </span>
  )
}
