'use client'

import { useState } from 'react'
import { TopNav, type ViewKey } from '@/components/top-nav'
import { CitizenView } from '@/components/citizen/citizen-view'
import { BookPickupModal, type PickupDraft } from '@/components/citizen/book-pickup-modal'
import { CollectorView } from '@/components/collector/collector-view'
import { HubView } from '@/components/hub/hub-view'
import { WasteJourneyModal } from '@/components/waste-journey-modal'
import {
  createOrder,
  demoOrder,
  segregate,
  type Order,
} from '@/lib/waste-data'

const INITIAL_WALLET_POINTS = 1840
const INITIAL_WALLET_CASH = 126.5

export default function Page() {
  const [view, setView] = useState<ViewKey>('citizen')
  const [modalOpen, setModalOpen] = useState(false)
  const [journeyOpen, setJourneyOpen] = useState(false)
  const [walletPoints, setWalletPoints] = useState(INITIAL_WALLET_POINTS)
  const [walletCash, setWalletCash] = useState(INITIAL_WALLET_CASH)
  const [order, setOrder] = useState<Order | null>(null)

  function handleBook(draft: PickupDraft) {
    setOrder(createOrder(draft))
    setModalOpen(false)
  }

  function handleEnRoute() {
    setOrder((prev) => (prev ? { ...prev, status: Math.max(prev.status, 1) } : prev))
  }

  function handleComplete(payload: {
    verifiedWeight: number
    points: number
    cash: number
    transactionId: string
  }) {
    setOrder((prev) =>
      prev
        ? {
            ...prev,
            status: 3,
            verifiedWeight: payload.verifiedWeight,
            photoVerified: true,
            transactionId: payload.transactionId,
            pointsAwarded: payload.points,
            cashAwarded: payload.cash,
          }
        : prev,
    )
    if (order?.payout === 'credits') {
      setWalletPoints((p) => p + payload.points)
    } else {
      setWalletCash((c) => c + payload.cash)
    }
  }

  function handleDispatch(batchId: string) {
    setOrder((prev) =>
      prev
        ? { ...prev, status: 4, batchId, segregation: segregate(prev) }
        : prev,
    )
  }

  function handleDemo() {
    const demo = demoOrder()
    setWalletPoints(INITIAL_WALLET_POINTS)
    setWalletCash(INITIAL_WALLET_CASH)
    setOrder(demo)
    setView('citizen')
  }

  function openJourney() {
    setJourneyOpen(true)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav active={view} onChange={setView} onDemo={handleDemo} />

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6">
          <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
            {view === 'citizen' && 'Turn your recyclable waste into value'}
            {view === 'collector' && 'Your collection jobs'}
            {view === 'hub' && 'Material recovery & traceability'}
          </h1>
          <p className="mt-1 text-pretty text-sm text-muted-foreground sm:text-base">
            {view === 'citizen' &&
              'Book doorstep pickups, choose cash or Eco-Credits, and trace every kilogram to the recycler.'}
            {view === 'collector' &&
              'Accept pickups, verify weight with photo and OTP, and release instant citizen payouts.'}
            {view === 'hub' &&
              'Aggregate incoming material, segregate streams, and dispatch traceable batches to recyclers.'}
          </p>
        </div>

        {view === 'citizen' && (
          <CitizenView
            walletPoints={walletPoints}
            walletCash={walletCash}
            order={order}
            onBook={() => setModalOpen(true)}
            onViewJourney={openJourney}
          />
        )}
        {view === 'collector' && (
          <CollectorView order={order} onEnRoute={handleEnRoute} onComplete={handleComplete} />
        )}
        {view === 'hub' && (
          <HubView order={order} onDispatch={handleDispatch} onViewJourney={openJourney} />
        )}
      </main>

      <BookPickupModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleBook}
      />
      <WasteJourneyModal
        order={order}
        open={journeyOpen}
        onClose={() => setJourneyOpen(false)}
      />
    </div>
  )
}
