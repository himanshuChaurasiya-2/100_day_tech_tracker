import { useEffect } from 'react'

const TECH_CONFIG = {
  DSA:    { color: '#00e5ff', bg: 'rgba(0,229,255,.1)'   },
  DevOps: { color: '#ff3d6b', bg: 'rgba(255,61,107,.1)'  },
  AWS:    { color: '#ffb800', bg: 'rgba(255,184,0,.1)'   },
}

export default function Modal({ challenge, onClose }) {
  const isOpen = !!challenge

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!challenge) return null

  const cfg = TECH_CONFIG[challenge.tech] || TECH_CONFIG.DSA

  return (
    <>
    <div
      className="fixed inset-0 z-[800] flex items-center justify-center transition-opacity duration-300 bg-bg/90 backdrop-blur-xl"
      style={{
        opacity: isOpen ? 1 : 0,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="modal-box relative !p-6 rounded-3xl max-w-2xl w-full overflow-y-auto bg-card border border-border2 max-h-[84vh] transition-transform duration-300 translate-y-0"
      >

        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl bg-gradient-to-r from-dsa to-[#a855f7]" 
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200 border border-border2 bg-transparent text-muted cursor-none hover:border-muted2 hover:text-text"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 !mb-1">
          <span
            className="font-mono-jetbrains text-[0.6rem] tracking-[2px] text-muted"
          >
            Day {String(challenge.day).padStart(2, '0')}
          </span>
          <span
            className="font-mono-jetbrains text-[0.5rem] !px-2 !py-0.5 rounded uppercase tracking-wide"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {challenge.tech}
          </span>
        </div>

        <h2 className="font-bebas text-3xl tracking-wide leading-none !mb-4 text-[#e8f0fe]">
          {challenge.title}
        </h2>

        <div className="text-[0.9rem] leading-loose text-muted2 modal-answer">
          
          {challenge.pro_statement && (
            <div className="!mb-4">
              <h4>Probelm Statement</h4>
              <p className="whitespace-pre-line">{challenge.pro_statement}</p>
            </div>
          )}

          {challenge.code && (
            <div>
              <h4>Solution</h4>
              <pre className="m-code">
                <code>{challenge.code}</code>
              </pre>
            </div>
          )}
        </div>

        {challenge.tags && challenge.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 !mt-4">
            {challenge.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono-jetbrains text-[0.68rem] !px-3 !py-1 rounded-full bg-white/3 text-muted2 border border-border whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .modal-answer h4 {
          font-family: 'Outfit', sans-serif;
          font-weight: 800;
          color: #e8f0fe;
          margin: 24px 0 8px;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .modal-answer pre.m-code {
          background: #050810;
          border: 1px solid #162035;
          border-radius: 12px;
          padding: 22px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
          line-height: 1.85;
          margin: 12px 0;
          overflow-x: auto;
          color: #e8f0fe;
          white-space: pre;
        }
        .modal-answer strong { color: #e8f0fe; }
        .modal-answer p { margin-bottom: 8px; }
        .modal-answer code {
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.72rem;
        }
      `}</style>
    </div>
    </>
  )
}
