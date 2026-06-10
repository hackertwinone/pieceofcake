const STATUS_CONFIG = {
  pending:   { label: 'New',         style: { border: '1px solid #B8975A', color: '#B8975A', background: 'transparent' } },
  confirmed: { label: 'New',         style: { border: '1px solid #B8975A', color: '#B8975A', background: 'transparent' } },
  preparing: { label: 'In Progress', style: { border: '1px solid #F0EBE0', color: '#F0EBE0', background: 'transparent' } },
  ready:     { label: 'Ready',       style: { border: '1px solid #F0EBE0', color: '#F0EBE0', background: 'rgba(240,235,224,0.1)' } },
  delivered: { label: 'Picked Up',   style: { border: '1px solid rgba(240,235,224,0.2)', color: 'rgba(240,235,224,0.35)', background: 'transparent' } },
}

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, style: { border: '1px solid #555', color: '#aaa', background: 'transparent' } }
  return (
    <span
      style={{ ...cfg.style, fontFamily: "'EB Garamond', serif", letterSpacing: '0.15em' }}
      className="px-3 py-1 text-xs font-bold uppercase tracking-wide"
    >
      {cfg.label}
    </span>
  )
}
