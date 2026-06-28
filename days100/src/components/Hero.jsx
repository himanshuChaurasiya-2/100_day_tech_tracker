import { useState, useEffect, useMemo  } from 'react'
import {API_BASE_URL} from '../config/api.js'
import { useCountUp } from '../hooks/useCountUp.jsx'

const BADGES = [
  { label: 'DSA',    colorClass: 'text-dsa',    bgClass: 'bg-dsa/8',    borderClass: 'border-dsa/30' },
  { label: 'DevOps', colorClass: 'text-devops', bgClass: 'bg-devops/8', borderClass: 'border-devops/30' },
  { label: 'AWS',    colorClass: 'text-aws',    bgClass: 'bg-aws/8',    borderClass: 'border-aws/30' },
]


function StatItem({ value, label, textColorClass }) {
  return (
    <>
    <div className="text-center">
      <span
        className={`font-bebas text-6xl tracking-widest leading-none block ${textColorClass}`}
      >
        {value}
      </span>
      <span
        className="font-mono-jetbrains text-[0.56rem] tracking-[1px] uppercase block text-muted"
      >
        {label}
      </span>
    </div>
    </>
  )
}

export default function Hero({ metrics }) {

  const liveStats = useMemo(() => {
    
    if (!metrics) {
      return { uniqueDays: 0, totalQuestions: 0, remainingDays: 100 };
    }

    const totalQ = metrics.miniCards?.reduce((acc, curr) => acc + (curr.value || 0), 0) || 0;
    const completed = metrics.daysDone || 0;
    const totalTarget = metrics.total || 100;

    return {
      uniqueDays: completed,
      totalQuestions: totalQ,
      remainingDays: Math.max(0, totalTarget - completed),
    };
  }, [metrics]);

  const daysDone = useCountUp(liveStats.uniqueDays, 1600, 300)
  const questions = useCountUp(liveStats.totalQuestions, 1600, 300)
  const daysLeft = useCountUp(liveStats.remainingDays, 1600, 300)

  return (
    <>
    <section
      id="hero"
      className="relative overflow-hidden flex flex-col items-center justify-center text-center"
      style={{ padding: '90px 52px 60px' }}
    >

      <div className="absolute inset-0 z-0 bg-grid-pattern animate-grid-drift" />

      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full animate-orb-pulse"
          style={{
            width: 550, height: 550,
            background: 'radial-gradient(circle,var(--color-dsa),transparent 70%)',
            filter: 'blur(90px)', opacity: 0.2,
            top: -180, left: -120,
          }}
        />
        <div
          className="absolute rounded-full animate-orb-pulse"
          style={{
            width: 480, height: 480,
            background: 'radial-gradient(circle,var(--color-devops),transparent 70%)',
            filter: 'blur(90px)', opacity: 0.2,
            bottom: -160, right: -80, animationDelay: '-5s',
          }}
        />
        <div
          className="absolute rounded-full animate-orb-pulse"
          style={{
            width: 320, height: 320,
            background: 'radial-gradient(circle,var(--color-aws),transparent 70%)',
            filter: 'blur(90px)', opacity: 0.2,
            top: '35%', right: '8%', animationDelay: '-2.5s',
          }}
        />
        <div
          className="absolute rounded-full animate-orb-pulse"
          style={{
            width: 260, height: 260,
            background: 'radial-gradient(circle,var(--color-purple),transparent 70%)',
            filter: 'blur(90px)', opacity: 0.2,
            bottom: '20%', left: '10%', animationDelay: '-7s',
          }}
        />
      </div>

      <div className="relative z-10">

        <div
          className="inline-flex items-center gap-3 font-mono-jetbrains text-[0.65rem] tracking-[3.5px] uppercase animate-fade-slide-up text-dsa"
        >
          <div 
          className="font-bebas text-[18rem] leading-none tracking-1 text-transparent absolute top-0 left-1/2 -translate-x-1/2 -translate-y-10 select-none pointer-events-none whitespace-nowrap animate-fade-slide-up"
          style={{ WebkitTextStroke: '2px rgba(0,229,255,.15)' }}
          >
          100
          </div>
          <span className="w-7 h-px inline-block bg-dsa"/>
          <p>The 100-Day Tech Grind is Real</p>
          <span className="w-7 h-px inline-block bg-dsa"/>
        </div>

        <h1
          className="font-bebas leading-none tracking-[3px] !m-2 relative animate-fade-slide-up"
          style={{ fontSize: 'clamp(4.5rem,11vw,10rem)', lineHeight: '.92' }}
        >
          <span className="block text-text">100</span>
          <span className="block text-dsa">DAYS</span>
          <span className="block text-transparent bg-clip-text bg-[length:200%_auto] bg-gradient-to-r from-devops via-purple to-aws animate-tech-grad">OF TECH</span>
        </h1>

        {/* Tech badges */}
        <div className="flex items-center justify-center gap-2 !my-2 animate-fade-slide-up delay-200 pointer-events-none select-none">
          {BADGES.map(({ label, colorClass, bgClass, borderClass }, i) => (
            <span key={i}>
              <span
                className={`font-mono-jetbrains text-[0.72rem] tracking-[1.5px] uppercase font-bold !px-4 !py-2 rounded-lg inline-block transition-all duration-200 hover:-translate-y-1 hover:scale-105 ${colorClass} ${bgClass} ${borderClass}`}
              >
                {label}
              </span>
            </span>
          ))}
        </div>

        {/* Description */}
        <p
          className="max-w-lg !mx-auto !m-4 text-base leading-relaxed animate-fade-slide-up delay-300 text-muted2 pointer-events-none select-none"
        >
          One challenge every single day. No skipping, no cap — raw algorithms, real pipelines,
          and cloud infra. All documented and searchable.
        </p>

        {/* CTAs */}
        <div className="flex gap-4 justify-center flex-wrap animate-fade-slide-up delay-400">
          <a
            href="#challenges"
            className="inline-block text-center !px-9 !py-4 rounded-xl font-outfit font-extrabold text-base tracking-tight bg-dsa text-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(0,229,255,0.45)] relative overflow-hidden whitespace-nowrap"
          >
            Browse Challenges →
          </a>
          <a
            href="#progress"
            className="inline-block text-center !px-9 !py-4 rounded-xl font-outfit font-bold text-base text-muted2 border-[1.5px] border-border2 transition-all duration-200 hover:-translate-y-0.5 hover:border-muted2 hover:text-text"
          >
            See Progress
          </a>
        </div>

        {/* Live Counter Dashboard Sub-panel */}
        <div
          className="flex items-center justify-center gap-14 !mt-6 !pt-4 flex-wrap animate-fade-slide-up delay-500 border-t border-border pointer-events-none select-none"
        >
          <StatItem value={daysDone} label="Days Done" textColorClass="text-dsa" />
          <div className="w-px h-13 bg-border" />
          <StatItem value={questions} label="Questions" textColorClass="text-text" />
          <div className="w-px h-13 bg-border"/>
          <StatItem value={3} label="Tech Tracks" textColorClass="text-devops" />
          <div className="w-px h-13 bg-border"/>
          <StatItem value={daysLeft} label="Days Left" textColorClass="text-aws" />
        </div>
      </div>
      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-fade-slide-up delay-700 pointer-events-none select-none">
        <div className="w-6 h-9 rounded-xl relative border-[1.5px] border-border2">
          <span
            className="absolute top-1.5 left-1/2 w-0.5 h-1.5 rounded-sm animate-scroll-bob -translate-x-1/2 bg-dsa"
          />
        </div>
        <span
          className="font-mono-jetbrains text-[0.52rem] tracking-[2.5px] uppercase text-muted"
        >
          Scroll
        </span>
      </div>

    </section>
    </>
  )
}
