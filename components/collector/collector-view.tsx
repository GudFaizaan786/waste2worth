'use client'

import { useEffect, useState } from 'react'
import {
  Navigation,
  Phone,
  MapPin,
  Scale,
  Camera,
  CheckCircle2,
  Loader2,
  Sparkles,
  Coins,
  User,
  PackageCheck,
} from 'lucide-react'
import {
  averageRate,
  categoryLabels,
  formatDollars,
  type Order,
} from '@/lib/waste-data'
import { cn } from '@/lib/utils'

export function CollectorView({
  order,
  onEnRoute,
  onComplete,
}: {
  order: Order | null
  onEnRoute: () => void
  onComplete: (verifiedWeight: number, points: number) => void
}) {
  const [weight, setWeight] = useState('')
  const [photoState, setPhotoState] = useState<'idle' | 'scanning' | 'verified'>('idle')
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    setWeight('')
    setPhotoState('idle')
    setPaying(false)
  }, [order?.id, order?.status])

  if (!order || order.status >= 3) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center shadow-sm">
        <span className="mx-auto mb-3 grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
          <PackageCheck className="size-6" />
        </span>
        <p className="text-sm font-semibold">No jobs in your queue</p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-muted-foreground">
          New doorstep pickups booked by citizens will appear here for you to accept and verify.
        </p>
      </div>
    )
  }

  const rate = averageRate(order.categories)
  const parsedWeight = Number.parseFloat(weight)
  const validWeight = Number.isFinite(parsedWeight) && parsedWeight > 0
  const points = validWeight ? Math.round(parsedWeight * rate) : 0
  const canPayout = validWeight && photoState === 'verified' && order.status >= 1

  function simulatePhoto() {
    setPhotoState('scanning')
    setTimeout(() => setPhotoState('verified'), 1400)
  }

  function triggerPayout() {
    if (!canPayout) return
    setPaying(true)
    setTimeout(() => {
      onComplete(parsedWeight, points)
      setPaying(false)
    }, 900)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Job card */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
            Active job
          </span>
          <span className="font-mono text-xs text-muted-foreground">{order.id}</span>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-full bg-secondary text-foreground">
            <User className="size-5" />
          </span>
          <div>
            <p className="font-semibold">{order.citizenName}</p>
            <p className="text-xs text-muted-foreground">Verified citizen</p>
          </div>
        </div>

        <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-secondary/60 p-3.5 text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <span className="font-medium">{order.address}</span>
        </div>

        <dl className="mb-5 space-y-2.5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Materials</dt>
            <dd className="text-right font-medium">{categoryLabels(order.categories)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Est. weight</dt>
            <dd className="font-medium">{order.estWeight} kg</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Rate</dt>
            <dd className="font-medium">{rate} pts / kg</dd>
          </div>
        </dl>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onEnRoute}
            disabled={order.status >= 1}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Navigation className="size-4" />
            {order.status >= 1 ? 'En route' : 'Navigate'}
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <Phone className="size-4" />
            Call
          </button>
        </div>
      </section>

      {/* Verification form */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
        <h2 className="mb-1 text-lg font-bold tracking-tight">Verify &amp; pay out</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Weigh the collected waste, run AI photo verification, then release the instant payout.
        </p>

        {/* Weight input */}
        <label htmlFor="verified-weight" className="mb-2 block text-sm font-semibold">
          Verified weight (kg)
        </label>
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
          <Scale className="size-4 shrink-0 text-muted-foreground" />
          <input
            id="verified-weight"
            type="number"
            min={0}
            step="0.1"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="e.g. 4.5"
            className="w-full bg-transparent py-2.5 font-mono text-sm outline-none placeholder:text-muted-foreground"
          />
          <span className="text-sm text-muted-foreground">kg</span>
        </div>

        {/* Photo verification */}
        <span className="mb-2 block text-sm font-semibold">AI photo verification</span>
        <button
          type="button"
          onClick={simulatePhoto}
          disabled={photoState !== 'idle'}
          className={cn(
            'mb-5 flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-8 text-sm transition-colors',
            photoState === 'verified'
              ? 'border-primary bg-accent text-accent-foreground'
              : 'border-border bg-secondary/40 text-muted-foreground hover:bg-secondary',
          )}
        >
          {photoState === 'idle' && (
            <>
              <Camera className="size-6" />
              <span className="font-medium">Tap to simulate photo upload</span>
              <span className="text-xs">JPG / PNG · analysed for segregation quality</span>
            </>
          )}
          {photoState === 'scanning' && (
            <>
              <Loader2 className="size-6 animate-spin" />
              <span className="font-medium">Analysing segregation…</span>
            </>
          )}
          {photoState === 'verified' && (
            <>
              <Sparkles className="size-6" />
              <span className="font-semibold">Verified · 96% segregation match</span>
              <span className="text-xs">No contamination detected</span>
            </>
          )}
        </button>

        {/* Payout summary */}
        <div className="mb-4 flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Coins className="size-4 text-muted-foreground" />
            Instant payout
          </div>
          <div className="text-right">
            <p className="font-mono text-base font-bold">
              {order.payout === 'credits' ? `${points} pts` : formatDollars(points)}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.payout === 'credits' ? 'to Eco-Credits wallet' : 'cash on delivery'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={triggerPayout}
          disabled={!canPayout || paying}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {paying ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Releasing payout…
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" /> Trigger instant payout
            </>
          )}
        </button>
        {!canPayout && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Enter a weight and complete photo verification to enable payout.
          </p>
        )}
      </section>
    </div>
  )
}
