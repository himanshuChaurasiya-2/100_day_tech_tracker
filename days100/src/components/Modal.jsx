import { useEffect } from 'react'

const TECH_CONFIG = {
  DSA:    { color: '#00e5ff', bg: 'rgba(0,229,255,.1)'   },
  DevOps: { color: '#ff3d6b', bg: 'rgba(255,61,107,.1)'  },
  AWS:    { color: '#ffb800', bg: 'rgba(255,184,0,.1)'   },
}

export default function Modal({ challenge, onClose, isFetchingDetails }) {
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
      className="fixed inset-0 z-[800] flex items-center justify-center transition-opacity duration-300 bg-bg/60 backdrop-blur-xl !p-4 "
      style={{
        opacity: isOpen ? 1 : 0,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-sm sm:max-w-xl md:max-w-2xl overflow-y-auto bg-card border border-border2 max-h-[90vh] rounded-3xl !p-5 sm:p-6 shadow-2xl block"
      >

        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-3xl bg-gradient-to-r from-devops to-dsa" 
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-200 border border-border2 bg-transparent text-muted cursor-none hover:border-muted2 hover:text-text"
        >
          ✕
        </button>

        <div className="flex items-center gap-1 !mb-1">
          <span
            className="font-mono-jetbrains text-[0.7rem] tracking-[1px] text-muted"
          >
            Day {String(challenge.day).padStart(2, '0')}
          </span>
          <span
            className="font-mono-jetbrains text-[0.6rem] !px-2 !py-0.5 rounded uppercase tracking-wide"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {challenge.tech}
          </span>
        </div>

        <h2 className="font-bebas text-3xl tracking-wide leading-none text-text">
          {challenge.title}
        </h2>

        {isFetchingDetails && !challenge.code ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 w-full">
            <div 
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" 
              style={{ borderColor: `${cfg.color} ` }}
            />
            <span className="font-mono-jetbrains text-[0.58rem] text-muted tracking-[2px] uppercase animate-pulse">
              Hydrating Solution...
            </span>
          </div>
        ) : (
          <div className="text-[0.85rem] sm:text-[0.9rem] leading-loose text-muted2 modal-answer flex-1 animate-fade-slide-up">
            
            {/* Problem Statement Block */}
            {challenge.pro_statement && (
              <div >
                <h4>Problem Statement</h4>
                <p className="whitespace-pre-line text-muted2 font-mono sm:text-sm bg-bg2/20 rounded-xl !p-2 border border-border leading-relaxed">
                  {challenge.pro_statement}
                </p>
              </div>
            )}

            {/* Source Solution Syntax Container */}
            {challenge.code && (
              <div className="flex flex-col w-full">
                <h4>Solution</h4>
                <div className="rounded-2xl border border-border overflow-hidden bg-bg/20 w-full">
                  {/* Pseudo code console task header line accent block */}
                  <div className="flex items-center justify-between !px-2 !py-2 bg-bg/30 border-b border-border  select-none">
                    <span className='font-mono-jetbrains '>solution.{challenge.tech === 'DSA' ? 'js' : 'sh'}</span>
                    <span className="text-dsa opacity-90 font-mono-jetbrains uppercase tracking-[1px] text-[0.7rem]">
                      Active Sync
                    </span>
                  </div>
                    
                    <pre
                      className="font-mono-jetbrains text-sm leading-loose whitespace-pre-wrap text-text/70 !px-2"
                    >
                      {challenge.code.split('\n').map((line, i) => {

                        const escapedLine = line
                          .replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;');
                          
                        const highlighted = escapedLine.replace(
                          /(import|def|for|in|if|else|return|const|let|function|async|await)\b|\b(\d+)\b|(\/\/.*$|#.*$)/g,
                          (match, keyword, number, comment) => {
                            if (keyword) return `<span style="color:#c792ea">${keyword}</span>`;
                            if (number)  return `<span style="color:#ffb800">${number}</span>`;
                            if (comment) return `<span style="color:#3d5266">${comment}</span>`;
                            return match;
                          } )
                        return (
                          <span
                            key={i}
                            dangerouslySetInnerHTML={{ __html: highlighted + '\n' }}
                          />
                        )
                      })}
                    </pre>
                </div>
              </div>
            )}
          </div>
        )}

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
