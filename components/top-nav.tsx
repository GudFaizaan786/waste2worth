'use client'

import { Recycle, User, Truck, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewKey = 'citizen' | 'collector' | 'hub'

const TABS: { key: ViewKey; label: string; icon: typeof User }[] = [
  { key: 'citizen', label: 'Citizen View', icon: User },
  { key: 'collector', label: 'Collector View', icon: Truck },
  { key: 'hub', label: 'Hub Dashboard', icon: LayoutDashboard },
]

export function TopNav({
  active,
  onChange,
}: {
  active: ViewKey
  onChange: (v: ViewKey) => void
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Recycle className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-base font-bold tracking-tight">ReLoop</p>
            <p className="text-xs text-muted-foreground">Smart Waste &amp; Recycling</p>
          </div>
        </div>

        <nav
          aria-label="Switch user perspective"
          className="flex items-center gap-1 rounded-xl border border-border bg-secondary/60 p-1"
        >
          {TABS.map(({ key, label, icon: Icon }) => {
            const isActive = active === key
            return (
              <button
                key={key}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onChange(key)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors md:flex-none',
                  isActive
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
                <span>{label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
