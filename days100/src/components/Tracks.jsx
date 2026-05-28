import { useState } from 'react'
import SectionHeader from './SectionHeader.jsx'
import { TRACKS } from '../data/challenges.js'

function TrackCard({ track }) {

  return (
    <>
    <div
      className="group rounded-3xl !p-10 relative overflow-hidden bg-card border border-border cursor-none transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_0_80px_var(--track-glow)]" style={{
        '--track-glow': track.glowColor,
        '--track-color': track.color,
      }}
    >

      <div
        className="absolute rounded-full transition-opacity duration-300 opacity-10 group-hover:opacity-20"
        style={{
          top: -70, right: -70,
          width: 220, height: 220,
          background: 'var(--track-color)',
          filter: 'blur(60px)',
        }}
      />

      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl !mb-1 bg-card2 border border-border2"
      >
        {track.icon}
      </div>

      <div
        className="font-bebas text-5xl tracking-wide leading-none "
        style={{ color: 'var(--track-color)' }}
      >
        {track.name}
      </div>

      <div
        className="font-mono-jetbrains text-[0.58rem] tracking-[2px] uppercase !mb-2 text-muted"
      >
        {track.fullName}
      </div>

      <p className="text-[0.88rem] leading-relaxed !mb-4 text-muted2">
        {track.desc}
      </p>

      <div className="flex flex-wrap gap-2">
        {track.pills.map((pill) => (
          <span
            key={pill}
            className="font-mono-jetbrains text-[0.56rem] !px-2.5 !py-1 rounded bg-white/3 text-muted border border-border"
          >
            {pill}
          </span>
        ))}
      </div>

      <div
        className="absolute bottom-5 right-6 font-bebas text-7xl tracking-wide select-none pointer-events-none opacity-8"
      >
        {track.name}
      </div>
    </div>
    </>
  )
}

export default function Tracks() {
  return (
    <>
    <section id="tracks" className="!py-10 !px-14 bg-bg">
      <SectionHeader
        eyebrow="What We Cover"
        title="Three Tracks.<br/>One Journey."
        subtitle="Every day hits one pillar — deep dives only. Real code, real concepts, real interview prep."
      />
      <div className="!pt-5 grid grid-cols-1 md:grid-cols-3 gap-6">
        {TRACKS.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </section>
    </>
  )
}
