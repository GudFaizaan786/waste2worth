'use client'

import {
  Wallet,
  Plus,
  Coins,
  MapPin,
  Package,
  Leaf,
  Flame,
  Route,
  ShieldCheck,
  Banknote,
} from 'lucide-react'
import {
  formatRupees,
  categoryLabels,
  ORDER_STEPS,
  WASTE_CATEGORIES,
  IMPACT_PASSPORT,
  type Order,
} from '@/lib/waste-data'
import { OrderTimeline } from './order-timeline'

export function CitizenView({
  walletPoints,
  walletCash,
  order,
  onBook,
  onViewJourney,
}: {
  walletPoints: number
  walletCash: number
  order: Order | null
  onBook: () => void
  onViewJourney: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Wallet header */}
      <section className="overflow-hidden rounded-3xl border border-border bg-primary text-primary-foreground shadow-sm">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary-foreground/80">
              <Wallet className="size-4" />
              Eco Wallet
            </div>
            <div className="flex flex-wrap items-end gap-3">
              <span className="text-4xl font-bold tracking-tight">
                {formatRupees(walletCash)}
              </span>
              <span className="mb-1 flex items-center gap-1 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-sm font-semibold">
                <Coins className="size-3.5" />
                {walletPoints.toLocaleString()} Eco Points
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onBook}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-foreground px-5 py-3 text-sm font-semibold text-primary shadow-sm transition-transform hover:scale-[1.02]"
          >
            <Plus className="size-4" />
            Book a Pickup
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

              {/* OTP for verification */}
              {order.status < 3 && (
                <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-accent px-4 py-3 text-accent-foreground">
                  <ShieldCheck className="size-5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Share this OTP with your collector</p>
                    <p className="text-xs opacity-80">Confirms the verified weight at your door.</p>
                  </div>
                  <span className="rounded-lg bg-primary px-3 py-1.5 font-mono text-lg font-bold tracking-[0.3em] text-primary-foreground">
                    {order.otp}
                  </span>
                </div>
              )}

              <OrderTimeline order={order} />

              {order.status >= 3 && (
                <button
                  type="button"
                  onClick={onViewJourney}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-primary/40 bg-accent py-3 text-sm font-semibold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Route className="size-4" />
                  Trace my waste journey
                </button>
              )}
            </div>
          ) : (
            <EmptyState onBook={onBook} />
          )}
        </section>

        {/* Side panel */}
        <section className="space-y-4 lg:col-span-2">
          <TodaysRates />
          <ImpactPassport />
        </section>
      </div>
    </div>
  )
}

function TodaysRates() {
  const bonus = WASTE_CATEGORIES.find((c) => c.bonus)
  const regular = WASTE_CATEGORIES.filter((c) => !c.bonus)
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-3 text-sm font-bold">Today&apos;s rates</h3>
      <ul className="space-y-2 text-sm">
        {regular.map((c) => (
          <li key={c.id} className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-muted-foreground">
              <c.icon className="size-4" />
              {c.label}
            </span>
            <span className="font-mono font-medium">{formatRupees(c.cashPerKg)}/kg</span>
          </li>
        ))}
      </ul>
      {bonus && (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-accent px-3 py-2.5 text-accent-foreground">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <Flame className="size-4" />
            {bonus.label}
          </span>
          <span className="rounded-full bg-primary px-2.5 py-1 font-mono text-xs font-bold text-primary-foreground">
            +{bonus.pointsPerKg} pts/kg
          </span>
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Bonus points for the waste that usually goes to waste.
      </p>
    </div>
  )
}

function ImpactPassport() {
  const p = IMPACT_PASSPORT
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Leaf className="size-4 text-primary" />
        <h3 className="text-sm font-bold">Your recycling passport</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Recycled" value={`${p.totalRecycledKg} kg`} />
        <Stat label="Pickups" value={String(p.pickups)} />
        <Stat label="Earned" value={formatRupees(p.earnedRupees)} icon={<Banknote className="size-3.5" />} />
        <Stat label="Eco Points" value={p.ecoPoints.toLocaleString()} icon={<Coins className="size-3.5" />} />
      </div>
      <div className="mt-3 rounded-xl bg-accent px-3 py-2.5 text-accent-foreground">
        <p className="text-sm font-semibold">{p.plasticDivertedKg} kg plastic diverted from landfill</p>
      </div>
    </div>
  )
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-secondary/60 p-3">
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 text-lg font-bold tracking-tight">{value}</p>
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

function EmptyState({ onBook }: { onBook: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-12 text-center">
      <span className="mb-3 grid size-12 place-items-center rounded-full bg-secondary text-muted-foreground">
        <Package className="size-6" />
      </span>
      <p className="text-sm font-semibold">No active pickups</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Book a doorstep pickup to start earning cash or Eco-Credits for your segregated waste.
      </p>
      <button
        type="button"
        onClick={onBook}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Plus className="size-4" />
        Book a Pickup
      </button>
    </div>
  )
}
