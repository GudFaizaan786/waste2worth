'use client'

import { useState } from 'react'
import { TopNav, type ViewKey } from '@/components/top-nav'
import { CitizenView } from '@/components/citizen/citizen-view'
import { BookPickupModal, type PickupDraft } from '@/components/citizen/book-pickup-modal'
import { CollectorView } from '@/components/collector/collector-view'
import { HubView } from '@/components/hub/hub-view'
import type { Order } from '@/lib/waste-data'

const INITIAL_WALLET_POINTS = 1200

export default function Page() {
  const [view, setView] = useState<ViewKey>('citizen')
  const [modalOpen, setModalOpen] = useState(false)
  const [walletPoints, setWalletPoints] = useState(INITIAL_WALLET_POINTS)
  const [order, setOrder] = useState<Order | null>(null)

  function handleBook(draft: PickupDraft) {
    setOrder({
      id: `PK-${Math.floor(1000 + Math.random() * 9000)}`,
      categories: draft.categories,
      estWeight: draft.estWeight,
      address: draft.address,
      payout: draft.payout,
      status: 0,
      citizenName: 'Aarav Sharma',
    })
    setModalOpen(false)
  }

  function handleEnRoute() {
    setOrder((prev) => (prev ? { ...prev, status: Math.max(prev.status, 1) } : prev))
  }

  function handleComplete(verifiedWeight: number, points: number) {
    setOrder((prev) =>
      prev
        ? { ...prev, status: 3, verifiedWeight, photoVerified: true, pointsAwarded: points }
        : prev,
    )
    if (order?.payout === 'credits') {
      setWalletPoints((p) => p + points)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav active={view} onChange={setView} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            {view === 'citizen' && 'Turn your waste into Eco-Credits'}
            {view === 'collector' && 'Your collection jobs'}
            {view === 'hub' && 'Recycling hub overview'}
          </h1>
          <p className="mt-1 text-pretty text-sm text-muted-foreground sm:text-base">
            {view === 'citizen' &&
              'Schedule doorstep pickups for segregated waste and track your rewards in real time.'}
            {view === 'collector' &&
              'Accept pickups, verify weight and segregation, and release instant citizen payouts.'}
            {view === 'hub' &&
              'Monitor recovery volumes, payouts, accuracy, and outbound dispatch to factories.'}
          </p>
        </div>

        {view === 'citizen' && (
          <CitizenView
            walletPoints={walletPoints}
            order={order}
            onBook={() => setModalOpen(true)}
          />
        )}
        {view === 'collector' && (
          <CollectorView order={order} onEnRoute={handleEnRoute} onComplete={handleComplete} />
        )}
        {view === 'hub' && <HubView />}
      </main>

      <BookPickupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleBook}
      />
    </div>
  )
}
