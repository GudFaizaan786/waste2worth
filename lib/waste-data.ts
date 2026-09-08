import type { LucideIcon } from 'lucide-react'
import {
  Trash2,
  ShoppingBag,
  FileText,
  Wrench,
  Wine,
} from 'lucide-react'

export type CategoryId =
  | 'plastic-wrappers'
  | 'single-use'
  | 'paper'
  | 'metal'
  | 'glass'

export interface WasteCategory {
  id: CategoryId
  label: string
  icon: LucideIcon
  /** points earned per kg for this material */
  ratePerKg: number
}

export const WASTE_CATEGORIES: WasteCategory[] = [
  { id: 'plastic-wrappers', label: 'Plastic Wrappers', icon: Trash2, ratePerKg: 60 },
  { id: 'single-use', label: 'Single-use Plastic', icon: ShoppingBag, ratePerKg: 70 },
  { id: 'paper', label: 'Paper', icon: FileText, ratePerKg: 40 },
  { id: 'metal', label: 'Metal', icon: Wrench, ratePerKg: 120 },
  { id: 'glass', label: 'Glass', icon: Wine, ratePerKg: 50 },
]

/** 1 Eco-Credit point = $0.10 */
export const DOLLARS_PER_POINT = 0.1

export const ORDER_STEPS = [
  'Booked',
  'Collector En Route',
  'Weighed & Verified',
  'Credits Credited',
] as const

export type PayoutPreference = 'cash' | 'credits'

export interface Order {
  id: string
  categories: CategoryId[]
  estWeight: number
  address: string
  payout: PayoutPreference
  /** index into ORDER_STEPS */
  status: number
  citizenName: string
  verifiedWeight?: number
  photoVerified?: boolean
  /** points awarded (or cash-equivalent points) */
  pointsAwarded?: number
}

export function averageRate(categories: CategoryId[]): number {
  const picked = WASTE_CATEGORIES.filter((c) => categories.includes(c.id))
  if (picked.length === 0) return 60
  return Math.round(
    picked.reduce((sum, c) => sum + c.ratePerKg, 0) / picked.length,
  )
}

export function categoryLabels(ids: CategoryId[]): string {
  return WASTE_CATEGORIES.filter((c) => ids.includes(c.id))
    .map((c) => c.label)
    .join(', ')
}

export function formatDollars(points: number): string {
  return `$${(points * DOLLARS_PER_POINT).toFixed(2)}`
}

// ---- Hub dashboard mock data ----

export const KPIS = {
  totalRecycledTons: 1284.6,
  totalPayouts: 486_200, // points issued
  segregationAccuracy: 93.4,
  activePartners: 342,
}

export interface DistributionSlice {
  label: string
  tons: number
  colorVar: string
}

export const WASTE_DISTRIBUTION: DistributionSlice[] = [
  { label: 'Plastic', tons: 512, colorVar: 'var(--chart-1)' },
  { label: 'Glass', tons: 298, colorVar: 'var(--chart-5)' },
  { label: 'Metal', tons: 274, colorVar: 'var(--chart-3)' },
  { label: 'Paper', tons: 200, colorVar: 'var(--chart-2)' },
]

export interface DispatchItem {
  id: string
  material: string
  weightTons: number
  destination: string
  status: 'Ready' | 'Loading' | 'In Transit'
}

export const DISPATCH_QUEUE: DispatchItem[] = [
  { id: 'BALE-4821', material: 'Baled PET Plastic', weightTons: 12.4, destination: 'GreenPoly Recyclers', status: 'Ready' },
  { id: 'BALE-4822', material: 'Crushed Glass Cullet', weightTons: 8.1, destination: 'ClearGlass Works', status: 'Loading' },
  { id: 'BALE-4823', material: 'Shredded Aluminium', weightTons: 5.6, destination: 'MetaMelt Foundry', status: 'Ready' },
  { id: 'BALE-4824', material: 'Baled Mixed Paper', weightTons: 9.9, destination: 'PaperCycle Mills', status: 'In Transit' },
  { id: 'BALE-4825', material: 'HDPE Regrind', weightTons: 4.2, destination: 'GreenPoly Recyclers', status: 'Ready' },
]
