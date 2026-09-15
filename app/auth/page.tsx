'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Leaf, Loader2, Phone, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const roles = [
  { id: 'citizen', title: 'Local Citizen', detail: 'Book pickups and earn Eco-Credits' },
  { id: 'collector', title: 'Collector / Kabadiwala', detail: 'Collect, verify, and pay citizens' },
  { id: 'hub', title: 'Collection Hub / Kabadd Store', detail: 'Sort, batch, and dispatch material' },
  { id: 'factory', title: 'Recycling Factory', detail: 'Receive traceable raw material' },
  { id: 'admin', title: 'W2W Admin Team', detail: 'Monitor the entire network' },
] as const

type Role = (typeof roles)[number]['id']

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<Role>('citizen')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function sendCode(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true); setError(''); setMessage('')
    const normalized = phone.startsWith('+') ? phone : `+91${phone.replace(/\D/g, '')}`
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalized,
      options: { shouldCreateUser: mode === 'register', data: { role, platform: 'waste2worth' } },
    })
    if (error) setError('We could not send the code. Check the number and try again.')
    else { setPhone(normalized); setStep('otp'); setMessage('A verification code was sent to your phone.') }
    setLoading(false)
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
    if (error || !data.session) setError('That code is invalid or expired. Please try again.')
    else {
      if (mode === 'register') await supabase.auth.updateUser({ data: { role, platform: 'waste2worth' } })
      router.push('/dashboard')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#f5f8f5] px-4 py-8 text-slate-900 sm:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-5xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden bg-[#123d2a] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div><div className="flex items-center gap-2 text-lg font-bold"><Leaf className="text-[#a7e46f]" /> Waste2Worth</div><p className="mt-20 max-w-sm text-4xl font-semibold leading-tight">Every local action makes the circular economy stronger.</p></div>
          <p className="text-sm text-white/60">A trusted network for citizens, collectors, hubs, factories, and the W2W team.</p>
        </section>
        <section className="p-6 sm:p-10">
          <button onClick={() => router.push('/')} className="mb-8 flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"><ArrowLeft size={16} /> Back to Waste2Worth</button>
          <div className="mb-7"><div className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-700 lg:hidden"><Leaf size={18} /> Waste2Worth</div><h1 className="text-3xl font-bold tracking-tight">{mode === 'login' ? 'Welcome back' : 'Join the network'}</h1><p className="mt-2 text-slate-500">Use your phone number for secure, passwordless access.</p></div>
          <div className="mb-6 flex rounded-xl bg-slate-100 p-1"><button onClick={() => { setMode('login'); setStep('phone') }} className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Login</button><button onClick={() => { setMode('register'); setStep('phone') }} className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold ${mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Register</button></div>
          {step === 'phone' ? <form onSubmit={sendCode} className="space-y-5"><label className="block text-sm font-semibold">Phone number<div className="mt-2 flex items-center rounded-xl border border-slate-200 px-3 focus-within:border-green-600"><Phone size={18} className="text-slate-400" /><input required value={phone} onChange={e => setPhone(e.target.value)} placeholder="98765 43210" className="w-full border-0 bg-transparent px-3 py-3 outline-none" /></div><span className="mt-2 block text-xs text-slate-400">India numbers are automatically prefixed with +91.</span></label>{mode === 'register' && <div><p className="mb-3 text-sm font-semibold">I am joining as</p><div className="space-y-2">{roles.map(item => <button type="button" key={item.id} onClick={() => setRole(item.id)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${role === item.id ? 'border-green-600 bg-green-50' : 'border-slate-200 hover:border-green-300'}`}><span className={`flex size-5 items-center justify-center rounded-full border ${role === item.id ? 'border-green-600 bg-green-600 text-white' : 'border-slate-300'}`}>{role === item.id && <Check size={13} />}</span><span><span className="block text-sm font-semibold">{item.title}</span><span className="block text-xs text-slate-500">{item.detail}</span></span></button>)}</div></div>}<Button disabled={loading} className="h-12 w-full rounded-xl bg-green-700 hover:bg-green-800">{loading ? <Loader2 className="animate-spin" /> : 'Send verification code'}</Button></form> : <form onSubmit={verifyCode} className="space-y-5"><div className="rounded-xl bg-green-50 p-4 text-sm text-green-800"><ShieldCheck className="mb-2" size={20} />{message}</div><label className="block text-sm font-semibold">6-digit verification code<input autoFocus required inputMode="numeric" maxLength={6} value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ''))} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-green-600" /></label><Button disabled={loading} className="h-12 w-full rounded-xl bg-green-700 hover:bg-green-800">{loading ? <Loader2 className="animate-spin" /> : 'Verify and continue'}</Button><button type="button" onClick={() => setStep('phone')} className="w-full text-sm text-slate-500 hover:text-slate-900">Use a different number</button></form>}
          {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        </section>
      </div>
    </main>
  )
}
