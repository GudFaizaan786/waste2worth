'use client'

import {
  Recycle,
  Banknote,
  Target,
  Users,
  Truck,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'
import {
  KPIS,
  WASTE_DISTRIBUTION,
  DISPATCH_QUEUE,
  formatDollars,
  type DispatchItem,
} from '@/lib/waste-data'
import { cn } from '@/lib/utils'

export function HubView() {
  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          icon={Recycle}
          label="Total Recycled Waste"
          value={`${KPIS.totalRecycledTons.toLocaleString()} T`}
          delta="+8.2% MoM"
        />
        <KpiCard
          icon={Banknote}
          label="Total Payouts Issued"
          value={formatDollars(KPIS.totalPayouts)}
          sub={`${KPIS.totalPayouts.toLocaleString()} pts`}
          delta="+5.1% MoM"
        />
        <KpiCard
          icon={Target}
          label="Segregation Accuracy"
          value={`${KPIS.segregationAccuracy}%`}
          delta="+1.4% MoM"
        />
        <KpiCard
          icon={Users}
          label="Active Kabadiwala Partners"
          value={KPIS.activePartners.toLocaleString()}
          delta="+23 this week"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Distribution */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-bold tracking-tight">Waste Category Distribution</h2>
          <p className="mb-5 text-sm text-muted-foreground">Recovered material by weight</p>
          <DistributionBars />
        </section>

        {/* Dispatch queue */}
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight">Dispatch queue</h2>
              <p className="text-sm text-muted-foreground">Raw material ready to ship to factories</p>
            </div>
            <span className="hidden rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground sm:inline">
              {DISPATCH_QUEUE.length} bales
            </span>
          </div>
          <DispatchTable />
        </section>
      </div>
    </div>
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
  const max = Math.max(...WASTE_DISTRIBUTION.map((d) => d.tons))
  const total = WASTE_DISTRIBUTION.reduce((s, d) => s + d.tons, 0)
  return (
    <div className="space-y-4">
      {WASTE_DISTRIBUTION.map((d) => {
        const pct = Math.round((d.tons / total) * 100)
        return (
          <div key={d.label}>
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 font-medium">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: d.colorVar }} />
                {d.label}
              </span>
              <span className="font-mono text-muted-foreground">
                {d.tons} T · {pct}%
              </span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${(d.tons / max) * 100}%`, backgroundColor: d.colorVar }}
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
            <th className="pb-2 font-semibold">Destination</th>
            <th className="pb-2 text-right font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {DISPATCH_QUEUE.map((item) => (
            <tr key={item.id} className="border-b border-border/60 last:border-0">
              <td className="py-3 font-mono text-xs">{item.id}</td>
              <td className="py-3 font-medium">{item.material}</td>
              <td className="py-3 font-mono">{item.weightTons} T</td>
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
        status === 'Ready' && 'bg-accent text-accent-foreground',
        status === 'Loading' && 'bg-secondary text-secondary-foreground',
        status === 'In Transit' && 'bg-primary text-primary-foreground',
      )}
    >
      {status === 'In Transit' && <Truck className="size-3" />}
      {status}
    </span>
  )
}
