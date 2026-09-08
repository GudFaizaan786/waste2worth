'use client'

import { Check, CalendarCheck, Truck, Scale, Coins, Recycle } from 'lucide-react'
import { ORDER_STEPS, formatRupees, type Order } from '@/lib/waste-data'
import { cn } from '@/lib/utils'

const STEP_ICONS = [CalendarCheck, Truck, Scale, Coins, Recycle]

export function OrderTimeline({ order }: { order: Order }) {
  return (
    <ol className="relative">
      {ORDER_STEPS.map((label, i) => {
        const Icon = STEP_ICONS[i]
        const done = i < order.status
        const current = i === order.status
        const isLast = i === ORDER_STEPS.length - 1
        return (
          <li key={label} className="flex gap-4 pb-6 last:pb-0">
            <div className="relative flex flex-col items-center">
              <span
                className={cn(
                  'grid size-9 place-items-center rounded-full border-2 transition-colors',
                  done && 'border-primary bg-primary text-primary-foreground',
                  current && 'border-primary bg-accent text-accent-foreground',
                  !done && !current && 'border-border bg-card text-muted-foreground',
                )}
              >
                {done ? <Check className="size-4" /> : <Icon className="size-4" />}
              </span>
              {!isLast && (
                <span
                  className={cn(
                    'mt-1 w-0.5 flex-1',
                    done ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </div>
            <div className="pt-1.5">
              <p
                className={cn(
                  'text-sm font-semibold',
                  current || done ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </p>
              <p className="text-xs text-muted-foreground">
                {stepHint(i, current, done, order)}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function stepHint(i: number, current: boolean, done: boolean, order: Order): string {
  switch (i) {
    case 0:
      return `Order ${order.id} placed`
    case 1:
      return current
        ? `${order.collectorName} is on the way`
        : done
          ? 'Collector arrived'
          : 'Awaiting collector'
    case 2:
      return order.verifiedWeight
        ? `Verified ${order.verifiedWeight} kg${order.photoVerified ? ' · photo + OTP' : ''}`
        : 'Weighing at your door'
    case 3:
      if (!order.transactionId) return 'Reward on the way'
      return order.payout === 'credits'
        ? `${order.pointsAwarded} pts · Txn #${order.transactionId}`
        : `${formatRupees(order.cashAwarded ?? 0)} · Txn #${order.transactionId}`
    case 4:
      return order.batchId
        ? `Batch #${order.batchId} → ${order.recyclerName}`
        : 'Awaiting hub dispatch'
    default:
      return ''
  }
}
