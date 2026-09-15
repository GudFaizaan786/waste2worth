'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Factory, LayoutDashboard, Leaf, LogOut, MapPin, PackageCheck, ShieldCheck, Truck, UserRound } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const dashboardCopy = {
  citizen: { title: 'Citizen dashboard', subtitle: 'Book pickups, track rewards, and follow your waste journey.', icon: UserRound, actions: ['Book a doorstep pickup', 'View Eco-Credits wallet', 'Track active order'] },
  collector: { title: 'Collector dashboard', subtitle: 'Manage assigned pickups and verify every handover.', icon: Truck, actions: ['View pickup queue', 'Verify weight and OTP', 'Release instant payout'] },
  hub: { title: 'Collection hub dashboard', subtitle: 'Turn incoming waste into clean, traceable material batches.', icon: LayoutDashboard, actions: ['Review incoming material', 'Segregate and create batch', 'Dispatch to recycler'] },
  factory: { title: 'Recycling factory dashboard', subtitle: 'Receive verified material and keep the loop moving.', icon: Factory, actions: ['View dispatched batches', 'Confirm material receipt', 'Download batch traceability'] },
  admin: { title: 'W2W admin dashboard', subtitle: 'Monitor the full Waste2Worth network and partner performance.', icon: ShieldCheck, actions: ['Review network KPIs', 'Manage partner approvals', 'Audit waste journeys'] },
} as const

type Role = keyof typeof dashboardCopy

export default function DashboardPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>('citizen')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<'EN' | 'HI'>('EN')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      const value = data.user?.user_metadata?.role as Role | undefined
      if (!data.user) router.replace('/auth')
      else { setRole(value && value in dashboardCopy ? value : 'citizen'); setPhone(data.user.phone ?? '') }
      setLoading(false)
    })
  }, [router])

  async function signOut() { await createClient().auth.signOut(); router.replace('/auth') }
  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f5f8f5] text-slate-500">Loading your workspace...</main>
  const copy = dashboardCopy[role]
  const Icon = copy.icon
  const isHindi = lang === 'HI'

  return <main className="min-h-screen bg-[#f5f8f5] text-slate-900"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6"><div className="flex items-center gap-2 font-bold"><span className="grid size-9 place-items-center rounded-xl bg-green-700 text-white"><Leaf size={19} /></span>Waste2Worth</div><div className="flex items-center gap-2"><button onClick={() => setLang(lang === 'EN' ? 'HI' : 'EN')} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold">{lang === 'EN' ? 'हिन्दी' : 'English'}</button><button onClick={signOut} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Sign out"><LogOut size={18} /></button></div></div></header><div className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-sm font-semibold text-green-700">{isHindi ? 'आपका कार्यक्षेत्र' : 'YOUR WORKSPACE'}</p><h1 className="text-3xl font-bold tracking-tight">{isHindi ? 'Waste2Worth डैशबोर्ड' : copy.title}</h1><p className="mt-2 text-slate-500">{isHindi ? 'आपकी भूमिका के लिए बनाया गया नेटवर्क डैशबोर्ड।' : copy.subtitle}</p></div><div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm shadow-sm"><span className="size-2 rounded-full bg-green-500" />{phone || 'Verified phone'}</div></div><div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]"><section className="rounded-3xl bg-[#123d2a] p-6 text-white shadow-lg sm:p-8"><div className="mb-10 flex items-start justify-between"><div className="grid size-12 place-items-center rounded-2xl bg-[#a7e46f] text-[#123d2a]"><Icon size={24} /></div><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold capitalize">{role}</span></div><h2 className="max-w-lg text-2xl font-semibold">{isHindi ? 'भूमिका के अनुसार अपने काम को आगे बढ़ाएं' : copy.subtitle}</h2><div className="mt-7 grid gap-3 sm:grid-cols-3">{copy.actions.map((action, index) => <button key={action} className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/10 p-4 text-left text-sm transition hover:bg-white/15"><span><span className="mb-3 block text-xs text-white/50">0{index + 1}</span>{isHindi ? ['पिकअप बुक करें', 'सत्यापन पूरा करें', 'ट्रेसबिलिटी देखें'][index] : action}</span><ArrowRight size={16} className="text-[#a7e46f]" /></button>)}</div></section><aside className="space-y-5"><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold text-slate-500">Network status</p><div className="mt-5 space-y-4 text-sm"><div className="flex items-center justify-between"><span className="flex items-center gap-2"><MapPin size={16} className="text-green-600" />Active local partners</span><strong>248</strong></div><div className="flex items-center justify-between"><span className="flex items-center gap-2"><PackageCheck size={16} className="text-green-600" />Material in motion</span><strong>1.8T</strong></div><div className="flex items-center justify-between"><span className="flex items-center gap-2"><Truck size={16} className="text-green-600" />Verified today</span><strong>96%</strong></div></div></div><Button onClick={() => router.push('/')} variant="outline" className="h-12 w-full rounded-xl bg-white">Explore the public demo</Button></aside></div></div></main>
}
