'use client'

import { useState } from 'react'
import {
  Recycle,
  Banknote,
  Target,
  Users,
  Truck,
  ArrowUpRight,
  PackageOpen,
  Split,
  Boxes,
  Route,
  type LucideIcon,
} from 'lucide-react'
import {
  KPIS,
  WASTE_DISTRIBUTION,
  DISPATCH_QUEUE,
  formatRupees,
  segregate,
  type DispatchItem,
  type Order,
} from '@/lib/waste-data'
import { cn } from '@/lib/utils'

export function HubView({
  order,
  onDispatch,
  onViewJourney,
}: {
  order: Order | null
  onDispatch: (batchId: string) => void
  onViewJourney: () => void
}) {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          icon={Recycle}
          label="Collected today"
          value={`${KPIS.collectedKg.toLocaleString()} kg`}
          sub={`${KPIS.recyclableKg.toLocaleString()} kg recyclable`}
          delta="+8.2%"
        />
        <KpiCard
          icon={Target}
          label="Segregation accuracy"
          value={`${KPIS.segregationAccuracy}%`}
          delta="+1.4%"
        />
        <KpiCard
          icon={Users}
          label="Active collectors"
          value={KPIS.activePartners.toLocaleString()}
          delta="+6 this week"
        />
        <KpiCard
          icon={Banknote}
          label="Citizen rewards"
          value={formatRupees(KPIS.citizenRewardsRupees)}
          delta="+5.1%"
        />
      </section>

      {/* Live incoming material from the network */}
      <LiveProcessing order={order} onDispatch={onDispatch} onViewJourney={onViewJourney} />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Distribution */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold tracking-tight">Material distribution</h2>
          <p className="mb-5 text-sm text-muted-foreground">Recovered material by weight</p>
          <DistributionBars />
        </section>

        {/* Dispatch queue */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Dispatch queue</h2>
              <p className="text-sm text-muted-foreground">Batches routed to authorized recyclers</p>
            </div>
            <span className="hidden rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground sm:inline">
              {DISPATCH_QUEUE.length} batches
            </span>
          </div>
          <DispatchTable />
        </section>
      </div>
    </div>
  )
}

function LiveProcessing({
  order,
  onDispatch,
  onViewJourney,
}: {
  order: Order | null
  onDispatch: (batchId: string) => void
  onViewJourney: () => void
}) {
  const [segregated, setSegregated] = useState(false)

  const ready = order && order.status >= 3
  const dispatched = order?.status === 4
  const slices = order ? segregate(order) : []
  const weight = order?.verifiedWeight ?? 0

  function createBatch() {
    const batchId = `RC${Math.floor(1000 + Math.random() * 9000)}`
    onDispatch(batchId)
  }

  if (!ready) {
    return (
      <section className="rounded-3xl border border-dashed border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-secondary text-muted-foreground">
            <PackageOpen className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Incoming material</h2>
            <p className="text-sm text-muted-foreground">
              Verified pickups from the network will arrive here for segregation and batching.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-3xl border border-primary/30 bg-card p-6 shadow-sm">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
            <PackageOpen className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight">Incoming material</h2>
            <p className="text-sm text-muted-foreground">
              {weight} kg from {order.citizenName} · via {order.collectorName}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'rounded-full px-3 py-1 text-xs font-semibold',
            dispatched
              ? 'bg-primary text-primary-foreground'
              : 'bg-accent text-accent-foreground',
          )}
        >
          {dispatched ? `Batch #${order.batchId} dispatched` : 'Awaiting processing'}
        </span>
      </div>

      {/* Step actions */}
      <div className="grid gap-3 sm:grid-cols-3">
        {/* 1. Segregate */}
        <div className="rounded-2xl bg-secondary/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Split className="size-4" /> Segregate
          </div>
          {segregated || dispatched ? (
            <ul className="space-y-1 text-sm">
              {slices.map((s) => (
                <li key={s.label} className="flex justify-between">
                  <span className="text-muted-foreground">{s.label}</span>
                  <span className="font-mono font-medium">{s.kg} kg</span>
                </li>
              ))}
            </ul>
          ) : (
            <button
              type="button"
              onClick={() => setSegregated(true)}
              className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Segregate streams
            </button>
          )}
        </div>

        {/* 2. Create batch */}
        <div className="rounded-2xl bg-secondary/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Boxes className="size-4" /> Batch &amp; dispatch
          </div>
          {dispatched ? (
            <div className="text-sm">
              <p className="font-mono font-semibold">#{order.batchId}</p>
              <p className="text-muted-foreground">→ {order.recyclerName}</p>
            </div>
          ) : (
            <button
              type="button"
              onClick={createBatch}
              disabled={!segregated}
              className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Create batch
            </button>
          )}
        </div>

        {/* 3. Trace */}
        <div className="rounded-2xl bg-secondary/60 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Route className="size-4" /> Traceability
          </div>
          <button
            type="button"
            onClick={onViewJourney}
            disabled={!dispatched}
            className="w-full rounded-lg border border-primary/40 bg-accent py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            View journey
          </button>
        </div>
      </div>
    </section>
  )
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  delta,
}: {
  icon: LucideIcon
  label: string
  value: string
  sub?: string
  delta: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
          <Icon className="size-5" />
        </span>
        <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-primary">
          <ArrowUpRight className="size-3" />
          {delta}
        </span>
      </div>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
      {sub && <p className="font-mono text-xs text-muted-foreground">{sub}</p>}
      <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

function DistributionBars() {
  const max = Math.max(...WASTE_DISTRIBUTION.map((d) => d.kg))
  const total = WASTE_DISTRIBUTION.reduce((s, d) => s + d.kg, 0)
  return (
    <div className="space-y-4">
      {WASTE_DISTRIBUTION.map((d) => {
        const pct = Math.round((d.kg / total) * 100)
        return (
          <div key={d.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: d.colorVar }} />
                {d.label}
              </span>
              <span className="font-mono text-muted-foreground">
                {d.kg} kg · {pct}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(d.kg / max) * 100}%`, backgroundColor: d.colorVar }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function DispatchTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="pb-2 font-semibold">Batch</th>
            <th className="pb-2 font-semibold">Material</th>
            <th className="pb-2 font-semibold">Weight</th>
            <th className="pb-2 font-semibold">Recycler</th>
            <th className="pb-2 text-right font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {DISPATCH_QUEUE.map((item) => (
            <tr key={item.id} className="border-b border-border/60 last:border-0">
              <td className="py-3 font-mono text-xs">#{item.id}</td>
              <td className="py-3 font-medium">{item.material}</td>
              <td className="py-3 font-mono">{item.weightKg} kg</td>
              <td className="py-3 text-muted-foreground">{item.destination}</td>
              <td className="py-3 text-right">
                <StatusBadge status={item.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }: { status: DispatchItem['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
        status === 'Ready for Recycler' && 'bg-accent text-accent-foreground',
        status === 'Awaiting Dispatch' && 'bg-secondary text-secondary-foreground',
        status === 'Dispatched' && 'bg-primary text-primary-foreground',
      )}
    >
      {status === 'Dispatched' && <Truck className="size-3" />}
      {status}
    </span>
  )
}
