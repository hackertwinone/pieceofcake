const STATUS_CONFIG = {
  pending:   { label: 'New',         classes: 'bg-brown text-white' },
  confirmed: { label: 'New',         classes: 'bg-brown text-white' },
  preparing: { label: 'In Progress', classes: 'bg-sage text-white' },
  ready:     { label: 'Ready',       classes: 'bg-forest text-white' },
  delivered: { label: 'Picked Up',   classes: 'bg-espresso/20 text-espresso' },
}

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, classes: 'bg-gray-500 text-white' }
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${cfg.classes}`}>
      {cfg.label}
    </span>
  )
}
