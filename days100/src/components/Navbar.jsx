const LINKS = [
  { label: 'Tracks', href: '#tracks' },
  { label: 'Browse', href: '#challenges' },
  { label: 'Progress', href: '#progress' },
  { label: 'Today', href: '#featured' },
]

export default function Navbar() {
  return (
    <>
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between !px-12 h-16 bg-bg/78 backdrop-blur-3xl backdrop-saturate-180 border-b border-white/4"
    >

      <a 
        href="#hero" className="font-bebas text-2xl tracking-[3px] flex items-center gap-0.5 no-underline transition-opacity duration-200 active:opacity-70 hover:opacity-90">
        <span className="text-dsa">100</span>
        <span className="text-text">DAYS</span>
        <span className="text-devops">.</span>
      </a>

      <ul className="hidden md:flex gap-6 list-none">
        {LINKS.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              className="font-mono-jetbrains text-xs tracking-[2px] uppercase transition-colors duration-200 text-muted2 no-underline hover:text-text"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div
        className="flex items-center gap-2 font-mono-jetbrains text-xs tracking-[1.5px] rounded-full !px-2 !py-2 border border-dsa/30 text-dsa animate-status-pulse"
      >
        <span
          className="w-1.5 h-1.5 rounded-full bg-dsa animate-blink"
        />
        Live
      </div>
    </nav>
    </>
  )
}
