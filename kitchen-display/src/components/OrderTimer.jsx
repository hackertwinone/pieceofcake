import { useState, useEffect } from 'react'

function elapsed(createdAt) {
  const secs = Math.floor((Date.now() - new Date(createdAt)) / 1000)
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function OrderTimer({ createdAt }) {
  const [display, setDisplay] = useState(elapsed(createdAt))

  useEffect(() => {
    const id = setInterval(() => setDisplay(elapsed(createdAt)), 1000)
    return () => clearInterval(id)
  }, [createdAt])

  return <span className="font-mono text-lg">{display}</span>
}
