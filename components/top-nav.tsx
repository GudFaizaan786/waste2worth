'use client'

import { useState } from 'react'
import { Recycle, User, Truck, LayoutDashboard, Play, LogIn, Languages } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ViewKey = 'citizen' | 'collector' | 'hub'

const TABS: { key: ViewKey; label: string; icon: typeof User }[] = [
  { key: 'citizen', label: 'Citizen', icon: User },
  { key: 'collector', label: 'Collector', icon: Truck },
  { key: 'hub', label: 'Hub', icon: LayoutDashboard },
]

export function TopNav({
  active,
  onChange,
  onDemo,
}: {
  active: ViewKey
  onChange: (v: ViewKey) => void
  onDemo: () => void
}) {
  const [language, setLanguage] = useState<'EN' | 'HI'>('EN')
  const hindi = language === 'HI'

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Recycle className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-base font-bold tracking-tight">Waste2Worth</p>
              <p className="text-xs text-muted-foreground">Don&apos;t throw value away</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDemo}
            className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground md:hidden"
          >
            <Play className="size-3.5" />
            Demo
          </button>
        </div>

        <div className="flex items-center gap-2">
          <nav
            aria-label="Switch user perspective"
            className="flex flex-1 items-center gap-1 rounded-xl border border-border bg-secondary/60 p-1"
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
                  <span>{hindi ? ({ citizen: 'नागरिक', collector: 'कलेक्टर', hub: 'हब' }[key]) : label}</span>
                </button>
              )
            })}
          </nav>
          <button type="button" onClick={() => setLanguage(hindi ? 'EN' : 'HI')} className="hidden items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary md:inline-flex" aria-label="Switch language"><Languages className="size-4" /> {hindi ? 'English' : 'हिन्दी'}</button>
          <a href="/dashboard" className="hidden items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary hover:text-primary md:inline-flex">
            <LogIn className="size-4" /> Login
          </a>
          <button
            type="button"
            onClick={onDemo}
            className="hidden items-center gap-1.5 rounded-xl border border-primary/40 bg-accent px-3.5 py-2 text-sm font-semibold text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground md:inline-flex"
          >
            <Play className="size-4" />
            Demo Mode
          </button>
        </div>
      </div>
    </header>
  )
}
