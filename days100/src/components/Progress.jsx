import { useEffect, useRef, useState } from 'react'
import SectionHeader from './SectionHeader.jsx'
import {API_BASE_URL} from '../config/api.js'

const CIRC = 2 * Math.PI * 130;
const LEVEL_COLORS = ['#162035', 'rgba(0,229,255,.18)', 'rgba(0,229,255,.42)', 'rgba(0,229,255,.68)', '#00e5ff']

function RingChart({ daysDone, total }) {
  const arcRef = useRef(null)
  const percentage = total > 0 ? Math.round((daysDone / total) * 100) : 0

  useEffect(() => {
    if (arcRef.current && total > 0) {
      // Smooth dynamic offset slide effect based on unique days done
      arcRef.current.style.strokeDashoffset = CIRC * (1 - daysDone / total)
    }
  }, [daysDone, total])

  return (
    <>
    <div className="relative w-72 h-72">
      <svg width="280" height="280" viewBox="0 0 280 280" style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id="ringG" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00e5ff" />
            <stop offset="50%" stopColor="#ff3d6b" />
            <stop offset="100%" stopColor="#ffb800" />
          </linearGradient>
        </defs>
        <circle fill="none" stroke="#162035" strokeWidth="20" cx="140" cy="140" r="130" />
        <circle
          ref={arcRef}
          fill="none"
          stroke="url(#ringG)"
          strokeWidth="20"
          strokeLinecap="round"
          cx="140" cy="140" r="130"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC}
          style={{ transition: 'stroke-dashoffset 2.2s cubic-bezier(.25,.1,.25,1)' }}
        />
      </svg>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
        <span
          className="font-bebas text-7xl leading-none block"
          style={{ color: '#00e5ff', letterSpacing: '-1px' }}
        >
          {percentage}%
        </span>
        <span
          className="font-mono-jetbrains text-[0.54rem] tracking-[3px] uppercase"
          style={{ color: '#4a5a78' }}
        >
          Complete
        </span>
      </div>
    </div>
    </>
  )
}

function MiniCards({ items }) {
  return (
    <>
    <div className="grid grid-cols-3 gap-3 w-full">
      {items?.map(({ value, label, color }) => (
        <div
          key={label}
          className="rounded-2xl !py-4 !px-3 text-center"
          style={{ background: '#0c1120', border: '1px solid #162035' }}
        >
          <span className="font-bebas text-4xl tracking-wide block" style={{ color }}>
            {value}
          </span>
          <span
            className="font-mono-jetbrains text-[0.5rem] tracking-[1.5px] uppercase block mt-1"
            style={{ color: '#4a5a78' }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
    </>
  )
}

function Heatmap({ cells }) {
  return (
    <>
    <div className="rounded-3xl !p-6" style={{ background: '#0c1120', border: '1px solid #162035' }}>
      <div className="font-outfit font-extrabold text-lg !mb-1">Activity Heatmap</div>
      <span
        className="font-mono-jetbrains text-[0.56rem] tracking-[2px] uppercase block !mb-4"
        style={{ color: '#4a5a78' }}
      >
        100-Day Challenge Overview
      </span>

      <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(20, 1fr)' }}>
        {cells?.map(({ day, level }) => (
          <div
            key={day}
            title={`Day ${day} — ${level > 0 ? 'Difficulty Tier ' + level : 'Upcoming'}`}
            className="aspect-square rounded-sm transition-transform duration-100 hover:scale-150"
            style={{ background: LEVEL_COLORS[level] }}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5 justify-end !mt-2">
        <span className="font-mono-jetbrains text-[0.54rem]" style={{ color: '#4a5a78' }}>Less</span>
        {LEVEL_COLORS.map((c, i) => (
          <div key={i} className="w-3 h-3 rounded-sm" style={{ background: c }} />
        ))}
        <span className="font-mono-jetbrains text-[0.54rem]" style={{ color: '#4a5a78' }}>More</span>
      </div>
    </div>
    </>
  )
}

export default function Progress() {
  const [metrics, setMetrics] = useState({
    daysDone: 0,
    total: 100,
    miniCards: [],
    heatmap: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProgressBoard = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/progress`)
        const data = await res.json()
        setMetrics(data)
      } catch (err) {
        console.error('Failed to parse stats payload:', err)
      } finally {
        setLoading(false)
      }
    }
    loadProgressBoard()
  }, [])

  if (loading) {
    return (
      <>
      <section id="progress" className="!py-10 !px-14 flex items-center justify-center min-h-[440px]" style={{ background: '#03040a' }}>
        <div className="font-mono-jetbrains text-xs tracking-[2px] text-[#4a5a78]">
          CALCULATING DASHBOARD ANALYTICS...
        </div>
      </section>
      </>
    )
  }

  return (
    <>
    <section id="progress" className="!py-10 !px-14" style={{ background: '#03040a' }}>
      <SectionHeader
        eyebrow="Stats"
        title="Progress Board"
        subtitle={`${metrics.daysDone} days deep. The grind is visible — every day tracked, every topic covered.`}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        {/* Ring + Mini cards */}
        <div className="flex flex-col items-center gap-8">
          <RingChart daysDone={metrics.daysDone} total={metrics.total} />
          <MiniCards items={metrics.miniCards} />
        </div>

        {/* Heatmap */}
        <Heatmap cells={metrics.heatmap} />
      </div>
    </section>
    </>
  )
}
