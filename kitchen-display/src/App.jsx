import { useState, useEffect, useCallback } from 'react'
import OrderCard from './components/OrderCard.jsx'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const POLL_INTERVAL = 10_000

async function fetchOrders() {
  const res = await fetch(`${API_URL}/api/orders/`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function patchStatus(id, status) {
  const res = await fetch(`${API_URL}/api/orders/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export default function App() {
  const [orders, setOrders] = useState([])
  const [lastUpdated, setLastUpdated] = useState(null)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    try {
      const data = await fetchOrders()
      setOrders(data)
      setLastUpdated(new Date())
      setError(null)
    } catch (e) {
      setError(e.message)
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, POLL_INTERVAL)
    return () => clearInterval(id)
  }, [load])

  const handleAdvance = async (id, nextStatus) => {
    try {
      await patchStatus(id, nextStatus)
      await load()
    } catch (e) {
      setError(`Failed to update order: ${e.message}`)
    }
  }

  const active = orders
    .filter((o) => o.status !== 'delivered')
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  const completed = orders
    .filter((o) => o.status === 'delivered')
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))

  const newCount = orders.filter((o) => o.status === 'pending' || o.status === 'confirmed').length
  const inProgressCount = orders.filter((o) => o.status === 'preparing').length
  const readyCount = orders.filter((o) => o.status === 'ready').length

  return (
    <div className="min-h-screen bg-sand text-espresso">
      {/* Header */}
      <header className="bg-sand-light border-b border-brown/20 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-forest">☕ Kitchen Display</h1>
          <p className="text-brown text-sm">The Cafecito Club</p>
        </div>

        <div className="flex items-center gap-6 text-center">
          <div>
            <p className="text-brown text-2xl font-bold">{newCount}</p>
            <p className="text-espresso/60 text-xs uppercase tracking-wide">New</p>
          </div>
          <div>
            <p className="text-sage text-2xl font-bold">{inProgressCount}</p>
            <p className="text-espresso/60 text-xs uppercase tracking-wide">In Progress</p>
          </div>
          <div>
            <p className="text-forest text-2xl font-bold">{readyCount}</p>
            <p className="text-espresso/60 text-xs uppercase tracking-wide">Ready</p>
          </div>
        </div>

        <div className="text-right">
          {error ? (
            <p className="text-red-600 text-sm">⚠ {error}</p>
          ) : (
            <p className="text-espresso/50 text-xs">
              Refreshes every 10s
              {lastUpdated && (
                <><br />Last: {lastUpdated.toLocaleTimeString()}</>
              )}
            </p>
          )}
        </div>
      </header>

      <main className="p-6">
        {active.length === 0 && completed.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-espresso/40">
            <p className="text-6xl mb-4">☕</p>
            <p className="text-2xl font-semibold">No active orders</p>
            <p className="text-sm mt-2">New orders will appear automatically</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {active.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onAdvance={handleAdvance}
              />
            ))}
          </div>
        )}

        {completed.length > 0 && (
          <div className="mt-10">
            <h2 className="text-espresso/40 text-sm uppercase tracking-widest font-semibold mb-4">
              Picked Up
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {completed.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onAdvance={handleAdvance}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
