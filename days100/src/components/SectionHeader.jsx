export default function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <>
    <div className="mb-0">
      <div
        className="font-mono-jetbrains text-[0.6rem] tracking-[3.5px] uppercase flex items-center gap-3 !mb-2 text-muted"
      >
        <span className="w-5 h-px inline-block bg-muted"/>
        {eyebrow}
      </div>
      <h2
        className="font-bebas tracking-wide leading-[.95] !mb-2"
        style={{ fontSize: 'clamp(2.8rem,5.5vw,5.5rem)' }}
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {subtitle && (
        <p className="text-base leading-relaxed max-w-md !mb-2 text-muted2">
          {subtitle}
        </p>
      )}
    </div>
    </>
  )
}
