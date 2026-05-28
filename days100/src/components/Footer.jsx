export default function Footer() {
  return (
    <>
    <footer
      className="!px-12 !py-4 flex items-center justify-between flex-wrap gap-5 border-t border-border bg-bg"
    >
      <div className="font-bebas text-2xl tracking-[3px] select-none pointer-events-none">
        <span className="text-dsa">100</span>
        <span className="text-text">DAYS.DEV</span>
      </div>

      <div
        className="font-mono-jetbrains text-[0.56rem] tracking-wide text-muted"
      >
        © 2025 · Built in public 🚀
      </div>
    </footer>
    </>
  )
}
