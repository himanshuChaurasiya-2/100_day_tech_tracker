import { useState } from 'react'

const TECH_CONFIG = {
  DSA:    { color: '#00e5ff', badgeBg: 'rgba(0,229,255,.1)',    dotClass: 'bg-[#00e5ff]',  hoverBorder: 'rgba(0,229,255,.35)',  hoverShadow: 'rgba(0,229,255,.07)'  },
  DevOps: { color: '#ff3d6b', badgeBg: 'rgba(255,61,107,.1)',   dotClass: 'bg-[#ff3d6b]',  hoverBorder: 'rgba(255,61,107,.35)', hoverShadow: 'rgba(255,61,107,.07)' },
  AWS:    { color: '#ffb800', badgeBg: 'rgba(255,184,0,.1)',    dotClass: 'bg-[#ffb800]',  hoverBorder: 'rgba(255,184,0,.35)',  hoverShadow: 'rgba(255,184,0,.07)'  },
}

export default function ChallengeCard({ challenge, onClick, animDelay, isFetchingDetails }) {
  const [hovered, setHovered] = useState(false)
  const cfg = TECH_CONFIG[challenge.tech]

  return (
    <>
    <div
      className="group rounded-2xl !p-5 transition-all duration-200 relative overflow-hidden bg-card cursor-none hover:-translate-y-1 animate-fade-slide-up"
      style={{
        border: `1px solid ${hovered ? cfg.hoverBorder : '#162035'}`,
        boxShadow: hovered ? `0 14px 40px ${cfg.hoverShadow}` : 'none',
        animationDelay: `${animDelay}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >

      <div className="flex items-center justify-between">
        <span
          className="font-mono-jetbrains text-xs tracking-[2px] uppercase text-muted"
        >
          Day {String(challenge.day).padStart(2, '0')}
        </span>
        <span
          className="font-mono-jetbrains text-xs !px-2 !py-1 rounded tracking-[1px] uppercase"
          style={{ background: cfg.badgeBg, color: cfg.color }}
        >
          {challenge.tech}
        </span>
      </div>

      <div
        className="font-outfit font-bold text-m leading-snug !mb-1 tracking-[1px] text-text"
      >
        {challenge.title}
      </div>

      <p
        className="text-sm leading-relaxed line-clamp-2 text-muted2"
      >
        {challenge.pro_statement}
      </p>

      {challenge.tags && challenge.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 !mt-1">
            {challenge.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono-jetbrains text-xs !px-3 !py-1 rounded-full bg-bg2/40 text-muted2 border border-border whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

      <div
        className="flex items-center justify-between !mt-2 !pt-1 border-t border-border"
      >
        <div className="flex gap-1">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="w-1.5 h-1.5 rounded-full transition-colors duration-200"
              style={{
                background: n <= challenge.diff ? cfg.color : '#1e2e48',
              }}
            />
          ))}
        </div>

        <div
          className="w-7 h-7 text-s rounded-full flex items-center justify-center border border-border2 text-muted "
        >
          →
        </div>
      </div>
    </div>
    </>
  )
}
