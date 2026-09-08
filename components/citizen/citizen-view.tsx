'use client'

import { Wallet, Plus, Coins, MapPin, Package, Leaf } from 'lucide-react'
import {
  formatDollars,
  categoryLabels,
  ORDER_STEPS,
  type Order,
} from '@/lib/waste-data'
import { OrderTimeline } from './order-timeline'

export function CitizenView({
  walletPoints,
  order,
  onBook,
}: {
  walletPoints: number
  order: Order | null
  onBook: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Wallet header */}
      <section className="overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground shadow-sm">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
              <Wallet className="size-4" />
              Eco-Credits Wallet
            </div>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold tracking-tight">
                {formatDollars(walletPoints)}
              </span>
              <span className="mb-1 flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-sm font-semibold">
                <Coins className="size-3.5" />
                {walletPoints.toLocaleString()} Points
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onBook}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-foreground px-5 py-3 text-sm font-semibold text-primary shadow-sm transition-transform hover:scale-[1.02]"
          >
            <Plus className="size-4" />
            Book Pickup
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Active order */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold tracking-tight">Active order</h2>
            {order && (
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                {ORDER_STEPS[order.status]}
              </span>
            )}
          </div>

          {order ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-3 rounded-2xl bg-secondary/60 p-4 sm:grid-cols-2">
                <Detail icon={<Package className="size-4" />} label="Materials" value={categoryLabels(order.categories)} />
                <Detail icon={<Leaf className="size-4" />} label="Est. weight" value={`${order.estWeight} kg`} />
                <Detail icon={<MapPin className="size-4" />} label="Address" value={order.address} />
                <Detail
                  icon={<Coins className="size-4" />}
                  label="Payout"
                  value={order.payout === 'credits' ? 'Eco-Credits' : 'Cash'}
                />
              </div>
              <OrderTimeline order={order} />
            </div>
          ) : (
            <EmptyState onBook={onBook} />
          )}
        </section>

        {/* Side tips */}
        <section className="space-y-4 lg:col-span-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-3 text-sm font-bold">How it works</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <Step n={1} text="Segregate waste by category at home." />
              <Step n={2} text="Book a doorstep pickup slot in seconds." />
              <Step n={3} text="A verified Kabadiwala weighs & collects." />
              <Step n={4} text="Get paid instantly in cash or Eco-Credits." />
            </ol>
          </div>
          <div className="rounded-3xl border border-border bg-accent p-6 text-accent-foreground">
            <Leaf className="mb-2 size-5" />
            <p className="text-sm font-semibold">You&apos;ve diverted 48 kg from landfill this month.</p>
            <p className="mt-1 text-xs opacity-80">That&apos;s roughly 92 kg of CO₂ avoided.</p>
          </div>
        </section>
      </div>
    </div>
  )
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  )
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {n}
      </span>
      <span className="pt-0.5 leading-snug">{text}</span>
    </li>
  )
}

function EmptyState({ onBook }: { onBook: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
      <span className="mb-3 grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Package className="size-6" />
      </span>
      <p className="text-sm font-semibold">No active pickups</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Book a doorstep pickup to start earning Eco-Credits for your segregated waste.
      </p>
      <button
        type="button"
        onClick={onBook}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus className="size-4" />
        Book Pickup
      </button>
    </div>
  )
}
