import type { LucideIcon } from 'lucide-react'
import {
  Recycle,
  FileText,
  Wrench,
  Wine,
  Flame,
} from 'lucide-react'

export type CategoryId =
  | 'plastic'
  | 'paper'
  | 'metal'
  | 'glass'
  | 'difficult-plastic'

export interface WasteCategory {
  id: CategoryId
  label: string
  icon: LucideIcon
  /** rupees paid per kg (cash payout) */
  cashPerKg: number
  /** Eco points earned per kg (credits payout) */
  pointsPerKg: number
  /** difficult-to-recycle incentive — the waste that usually goes to waste */
  bonus?: boolean
}

export const WASTE_CATEGORIES: WasteCategory[] = [
  { id: 'plastic', label: 'Plastic', icon: Recycle, cashPerKg: 20, pointsPerKg: 15 },
  { id: 'paper', label: 'Paper', icon: FileText, cashPerKg: 14, pointsPerKg: 10 },
  { id: 'metal', label: 'Metal', icon: Wrench, cashPerKg: 35, pointsPerKg: 12 },
  { id: 'glass', label: 'Glass', icon: Wine, cashPerKg: 8, pointsPerKg: 8 },
  {
    id: 'difficult-plastic',
    label: 'Difficult Plastic',
    icon: Flame,
    cashPerKg: 5,
    pointsPerKg: 30,
    bonus: true,
  },
]

export const ORDER_STEPS = [
  'Booked',
  'Collector En Route',
  'Weighed & Verified',
  'Reward Credited',
  'Sent to Recycler',
] as const

export type PayoutPreference = 'cash' | 'credits'

export interface SegregationSlice {
  label: string
  kg: number
}

export interface Order {
  id: string
  categories: CategoryId[]
  estWeight: number
  address: string
  payout: PayoutPreference
  /** index into ORDER_STEPS */
  status: number
  citizenName: string
  collectorName: string
  collectorRating: number
  hubName: string
  recyclerName: string
  /** 4-digit code the citizen shares to confirm the collector's weight */
  otp: string
  verifiedWeight?: number
  photoVerified?: boolean
  transactionId?: string
  pointsAwarded?: number
  cashAwarded?: number
  batchId?: string
  segregation?: SegregationSlice[]
}

const DEFAULTS = {
  collectorName: 'Rahul Verma',
  collectorRating: 4.8,
  hubName: 'Jaipur Central Hub',
  recyclerName: 'GreenCycle Industries',
}

export function makeOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000))
}

export function makeOrderId(): string {
  return `PK-${Math.floor(1000 + Math.random() * 9000)}`
}

export function makeTransactionId(): string {
  return `EC${Math.floor(10000 + Math.random() * 90000)}`
}

export function createOrder(draft: {
  categories: CategoryId[]
  estWeight: number
  address: string
  payout: PayoutPreference
}): Order {
  return {
    id: makeOrderId(),
    categories: draft.categories,
    estWeight: draft.estWeight,
    address: draft.address,
    payout: draft.payout,
    status: 0,
    citizenName: 'Aarav Sharma',
    otp: makeOtp(),
    ...DEFAULTS,
  }
}

export function avgCashRate(ids: CategoryId[]): number {
  const picked = WASTE_CATEGORIES.filter((c) => ids.includes(c.id))
  if (picked.length === 0) return 20
  return round2(picked.reduce((s, c) => s + c.cashPerKg, 0) / picked.length)
}

export function avgPointsRate(ids: CategoryId[]): number {
  const picked = WASTE_CATEGORIES.filter((c) => ids.includes(c.id))
  if (picked.length === 0) return 15
  return Math.round(picked.reduce((s, c) => s + c.pointsPerKg, 0) / picked.length)
}

export function categoryLabels(ids: CategoryId[]): string {
  return WASTE_CATEGORIES.filter((c) => ids.includes(c.id))
    .map((c) => c.label)
    .join(', ')
}

export function hasBonus(ids: CategoryId[]): boolean {
  return WASTE_CATEGORIES.some((c) => c.bonus && ids.includes(c.id))
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}

export function formatRupees(n: number): string {
  return `₹${n.toFixed(2)}`
}

/** Split a verified weight into recyclable PET vs. hard-to-recycle streams */
export function segregate(order: Order): SegregationSlice[] {
  const total = order.verifiedWeight ?? order.estWeight
  const difficult = hasBonus(order.categories) ? round2(total * 0.3) : 0
  const pet = round2(total - difficult)
  const slices: SegregationSlice[] = [{ label: 'Recyclable PET', kg: pet }]
  if (difficult > 0) slices.push({ label: 'Multilayer / difficult', kg: difficult })
  return slices
}

// ---- Citizen impact passport ----

export const IMPACT_PASSPORT = {
  totalRecycledKg: 47.2,
  pickups: 12,
  earnedRupees: 684,
  ecoPoints: 2340,
  plasticDivertedKg: 18.4,
}

// ---- Hub dashboard mock data ----

export const KPIS = {
  collectedKg: 1248,
  recyclableKg: 1062,
  segregationAccuracy: 86.4,
  activePartners: 47,
  citizenRewardsRupees: 24_850,
}

export interface DistributionSlice {
  label: string
  kg: number
  colorVar: string
}

export const WASTE_DISTRIBUTION: DistributionSlice[] = [
  { label: 'Plastic', kg: 512, colorVar: 'var(--chart-1)' },
  { label: 'Paper', kg: 310, colorVar: 'var(--chart-2)' },
  { label: 'Metal', kg: 94, colorVar: 'var(--chart-3)' },
  { label: 'Glass', kg: 75, colorVar: 'var(--chart-5)' },
]

export interface DispatchItem {
  id: string
  material: string
  weightKg: number
  destination: string
  status: 'Ready for Recycler' | 'Awaiting Dispatch' | 'Dispatched'
}

export const DISPATCH_QUEUE: DispatchItem[] = [
  { id: 'B1024', material: 'Plastic', weightKg: 182, destination: 'GreenCycle Industries', status: 'Ready for Recycler' },
  { id: 'B1025', material: 'Paper', weightKg: 310, destination: 'PaperCycle Mills', status: 'Awaiting Dispatch' },
  { id: 'B1026', material: 'Metal', weightKg: 94, destination: 'MetaMelt Foundry', status: 'Dispatched' },
]
