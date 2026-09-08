'use client'

import { useEffect, useState } from 'react'
import { X, MapPin, Banknote, Coins, Check, Flame } from 'lucide-react'
import {
  WASTE_CATEGORIES,
  avgCashRate,
  avgPointsRate,
  formatRupees,
  type CategoryId,
  type PayoutPreference,
} from '@/lib/waste-data'
import { cn } from '@/lib/utils'

export interface PickupDraft {
  categories: CategoryId[]
  estWeight: number
  address: string
  payout: PayoutPreference
}

export function BookPickupModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (draft: PickupDraft) => void
}) {
  const [categories, setCategories] = useState<CategoryId[]>(['plastic'])
  const [estWeight, setEstWeight] = useState(4)
  const [address, setAddress] = useState('')
  const [payout, setPayout] = useState<PayoutPreference>('credits')

  useEffect(() => {
    if (open) return
    const t = setTimeout(() => {
      setCategories(['plastic'])
      setEstWeight(4)
      setAddress('')
      setPayout('credits')
    }, 200)
    return () => clearTimeout(t)
  }, [open])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const estPoints = Math.round(estWeight * avgPointsRate(categories))
  const estCash = estWeight * avgCashRate(categories)

  function toggle(id: CategoryId) {
    setCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (categories.length === 0 || address.trim() === '') return
    onSubmit({ categories, estWeight, address: address.trim(), payout })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Book a doorstep pickup"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-border bg-card p-5 shadow-2xl sm:rounded-3xl sm:p-6"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight">Book a doorstep pickup</h2>
            <p className="text-sm text-muted-foreground">
              Segregate, schedule, and choose your reward.
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

        {/* Categories */}
        <fieldset className="mb-5">
          <legend className="mb-2 text-sm font-semibold">What do you have?</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {WASTE_CATEGORIES.map(({ id, label, icon: Icon, bonus }) => {
              const checked = categories.includes(id)
              return (
                <label
                  key={id}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition-colors',
                    checked
                      ? 'border-primary bg-accent text-accent-foreground'
                      : 'border-border bg-card hover:bg-secondary',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(id)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      'grid size-5 shrink-0 place-items-center rounded-md border',
                      checked
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border',
                    )}
                  >
                    {checked && <Check className="size-3.5" />}
                  </span>
                  <Icon className="size-4 shrink-0 opacity-70" />
                  <span className="flex-1 font-medium">{label}</span>
                  {bonus && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      <Flame className="size-2.5" />
                      BONUS
                    </span>
                  )}
                </label>
              )
            })}
          </div>
        </fieldset>

        {/* Weight slider */}
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="weight" className="text-sm font-semibold">
              Approximate quantity
            </label>
            <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-sm font-semibold text-foreground">
              {estWeight} kg
            </span>
          </div>
          <input
            id="weight"
            type="range"
            min={1}
            max={25}
            step={1}
            value={estWeight}
            onChange={(e) => setEstWeight(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>1 kg</span>
            <span>25 kg</span>
          </div>
        </div>

        {/* Address */}
        <div className="mb-5">
          <label htmlFor="address" className="mb-2 block text-sm font-semibold">
            Pickup address
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <input
              id="address"
              type="text"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="14 Civil Lines, Jaipur 302006"
              className="w-full bg-transparent py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Payout toggle */}
        <div className="mb-6">
          <span className="mb-2 block text-sm font-semibold">How would you like your reward?</span>
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-secondary/60 p-1">
            <PayoutOption
              active={payout === 'cash'}
              onClick={() => setPayout('cash')}
              icon={<Banknote className="size-4" />}
              label="Cash"
            />
            <PayoutOption
              active={payout === 'credits'}
              onClick={() => setPayout('credits')}
              icon={<Coins className="size-4" />}
              label="Eco-Credits"
            />
          </div>
        </div>

        {/* Estimate summary */}
        <div className="mb-5 flex items-center justify-between rounded-xl bg-accent px-4 py-3 text-accent-foreground">
          <span className="text-sm font-medium">Estimated reward</span>
          <span className="font-mono text-base font-bold">
            {payout === 'credits' ? `${estPoints} pts` : formatRupees(estCash)}
          </span>
        </div>

        <button
          type="submit"
          disabled={categories.length === 0 || address.trim() === ''}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Request Pickup
        </button>
      </form>
    </div>
  )
}

function PayoutOption({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-card text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {label}
    </button>
  )
}
