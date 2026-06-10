import StatusBadge from './StatusBadge.jsx'
import OrderTimer from './OrderTimer.jsx'

const NEXT_STATUS = {
  pending:   'preparing',
  confirmed: 'preparing',
  preparing: 'ready',
  ready:     'delivered',
}

const BORDER_STYLE = {
  pending:   '2px solid #B8975A',
  confirmed: '2px solid #B8975A',
  preparing: '2px solid rgba(240,235,224,0.5)',
  ready:     '2px solid #F0EBE0',
  delivered: '1px solid rgba(240,235,224,0.1)',
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

  const cardStyle = {
    background: '#111111',
    border: overdue ? '2px solid #ef4444' : (BORDER_STYLE[order.status] ?? '1px solid rgba(240,235,224,0.15)'),
    boxShadow: overdue ? '0 0 0 1px #ef4444' : 'none',
  }

  const placedAt = new Date(order.created_at).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div
      style={cardStyle}
      className={`relative p-5 flex flex-col gap-4 transition-all duration-1000 ${fading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className="text-ivory-dim text-xs uppercase"
            style={{ fontFamily: "'EB Garamond', serif", letterSpacing: '0.2em' }}
          >
            Order #{order.id}
          </p>
          <p
            className="text-ivory text-xl font-bold leading-tight mt-1"
            style={{ fontFamily: "'Cinzel Decorative', serif" }}
          >
            {order.customer_name}
          </p>
          <p className="text-ivory-dim text-sm mt-1 italic" style={{ fontFamily: "'EB Garamond', serif" }}>
            {placedAt} · {order.delivery_address ? 'Delivery' : 'Pickup'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <StatusBadge status={order.status} />
          <div
            className={`text-sm ${overdue ? 'text-red-400' : 'text-ivory-dim'}`}
            style={{ fontFamily: "'EB Garamond', serif" }}
          >
            ⏱ <OrderTimer createdAt={order.created_at} />
            {overdue && <span className="ml-1">⚠</span>}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(232,228,220,0.1)' }} />

      {/* Items */}
      <ul className="space-y-2">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-baseline justify-between gap-2">
            <p className="text-ivory text-base" style={{ fontFamily: "'EB Garamond', serif" }}>
              {item.menu_item_name}
            </p>
            <span className="text-gold font-bold shrink-0" style={{ fontFamily: "'EB Garamond', serif" }}>
              ×{item.quantity}
            </span>
          </li>
        ))}
      </ul>

      {/* Special instructions */}
      {order.special_instructions && (
        <p
          className="text-ivory-dim text-sm italic px-3 py-2"
          style={{
            fontFamily: "'EB Garamond', serif",
            border: '1px solid rgba(232,228,220,0.15)',
            background: 'rgba(240,235,224,0.03)',
          }}
        >
          📝 {order.special_instructions}
        </p>
      )}

      {/* Advance button */}
      {nextStatus && order.status !== 'delivered' && (
        <button
          onClick={() => onAdvance(order.id, nextStatus)}
          className="w-full py-3 text-sm font-bold uppercase tracking-widest transition-colors"
          style={{
            fontFamily: "'EB Garamond', serif",
            letterSpacing: '0.2em',
            background: order.status === 'ready' ? '#F0EBE0' : 'transparent',
            color: order.status === 'ready' ? '#0A0A0A' : '#F0EBE0',
            border: order.status === 'ready' ? '1px solid #F0EBE0' : '1px solid rgba(240,235,224,0.35)',
          }}
        >
          {order.status === 'preparing'
            ? '✓ Mark Ready'
            : order.status === 'ready'
            ? '✓ Mark Picked Up'
            : '▶ Start Preparing'}
        </button>
      )}

      {order.status === 'delivered' && (
        <p
          className="text-center text-xs uppercase tracking-widest opacity-30"
          style={{ fontFamily: "'EB Garamond', serif", letterSpacing: '0.2em' }}
        >
          ✓ Picked Up
        </p>
      )}
    </div>
  )
}
