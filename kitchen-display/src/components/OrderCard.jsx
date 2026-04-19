import StatusBadge from './StatusBadge.jsx'
import OrderTimer from './OrderTimer.jsx'

const NEXT_STATUS = {
  pending:   'preparing',
  confirmed: 'preparing',
  preparing: 'ready',
  ready:     'delivered',
}

const BORDER_COLOR = {
  pending:   'border-brown',
  confirmed: 'border-brown',
  preparing: 'border-sage',
  ready:     'border-forest',
  delivered: 'border-espresso/20',
}

const WARNING_MINUTES = 5

function isOverdue(createdAt, status) {
  if (status !== 'pending' && status !== 'confirmed') return false
  const minutes = (Date.now() - new Date(createdAt)) / 60000
  return minutes >= WARNING_MINUTES
}

export default function OrderCard({ order, onAdvance, fading }) {
  const nextStatus = NEXT_STATUS[order.status]
  const overdue = isOverdue(order.created_at, order.status)
  const borderColor = overdue ? 'border-red-500' : BORDER_COLOR[order.status] ?? 'border-gray-600'

  const placedAt = new Date(order.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      className={`
        relative bg-white rounded-2xl border-4 ${borderColor} p-5 flex flex-col gap-4
        transition-all duration-1000
        ${fading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        ${overdue ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-sand' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-espresso/50 text-sm font-medium uppercase tracking-widest">
            Order #{order.id}
          </p>
          <p className="text-forest text-2xl font-bold leading-tight mt-0.5">
            {order.customer_name}
          </p>
          <p className="text-espresso/60 text-sm mt-1">
            Placed at {placedAt}
            {order.delivery_address ? ' · Delivery' : ' · Pickup'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={order.status} />
          <div className={`text-sm font-semibold ${overdue ? 'text-red-500' : 'text-espresso/50'}`}>
            ⏱ <OrderTimer createdAt={order.created_at} />
            {overdue && <span className="ml-1 text-red-500">⚠</span>}
          </div>
        </div>
      </div>

      {/* Items */}
      <ul className="divide-y divide-sand">
        {order.items.map((item, i) => (
          <li key={i} className="py-2 flex items-start justify-between gap-2">
            <div>
              <p className="text-espresso text-lg font-semibold leading-snug">
                {item.menu_item_name}
              </p>
              <p className="text-espresso/60 text-sm">
                {item.size} · {item.milk} milk
              </p>
            </div>
            <span className="text-brown text-xl font-bold shrink-0">×{item.quantity}</span>
          </li>
        ))}
      </ul>

      {/* Special instructions */}
      {order.special_instructions && (
        <p className="bg-sand-light/60 border border-brown/30 text-brown text-sm rounded-lg px-3 py-2">
          📝 {order.special_instructions}
        </p>
      )}

      {/* Advance button */}
      {nextStatus && order.status !== 'delivered' && (
        <button
          onClick={() => onAdvance(order.id, nextStatus)}
          className={`
            w-full py-3 rounded-xl text-lg font-bold uppercase tracking-wide transition-colors
            ${order.status === 'preparing'
              ? 'bg-forest hover:bg-forest-dark text-white'
              : order.status === 'ready'
              ? 'bg-brown hover:bg-brown-dark text-white'
              : 'bg-sage hover:bg-sage-dark text-white'}
          `}
        >
          {order.status === 'preparing'
            ? '✓ Mark Ready'
            : order.status === 'ready'
            ? '✓ Mark Picked Up'
            : '▶ Start Preparing'}
        </button>
      )}

      {order.status === 'delivered' && (
        <div className="text-center text-espresso/40 font-semibold text-sm py-1">
          ✓ Picked up
        </div>
      )}
    </div>
  )
}
