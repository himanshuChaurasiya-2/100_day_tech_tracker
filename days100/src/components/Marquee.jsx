import { MARQUEE_ITEMS } from '../data/challenges.js'

const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

export default function Marquee() {
  return (
    <>
    <div
      className="overflow-hidden !py-3 bg-bg2 border-y border-border pointer-events-none select-none"
    >
      <div className="flex gap-14 w-max animate-marq">
        {doubled.map(({ text, color }, i) => (
          <div
            key={i}
            className="flex items-center gap-2 font-mono-jetbrains text-[0.78rem] whitespace-nowrap text-muted"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: color }}
            />
            {text}
          </div>
        ))}
      </div>
    </div>
    </>
  )
}
