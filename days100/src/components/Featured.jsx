import { useState, useEffect } from 'react'
import SectionHeader from './SectionHeader.jsx'
import {API_BASE_URL} from '../config/api'

function CodeWindow({ code }) {
  if (!code) return null;

  return (
    <div
      className="rounded-2xl !p-6 overflow-x-auto bg-[#050810] border border-border"
    >
      <div className="flex items-center gap-2 !mb-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"/>
        <div className="w-3 h-3 rounded-full bg-[#febc2e]"/>
        <div className="w-3 h-3 rounded-full bg-[#28c840]"/>
        <span
          className="font-mono-jetbrains text-[0.56rem] tracking-[1.5px] ml-auto text-muted"
        >
          Source Code
        </span>
      </div>

      <pre
        className="font-mono-jetbrains text-[0.74rem] leading-loose whitespace-pre-wrap text-text"
      >
        {code.split('\n').map((line, i) => {
          const highlighted = line
            .replace(/(import|def|for|in|if|else|return|const|let|function|async|await)/g, '<span style="color:#c792ea">$1</span>')
            .replace(/\b(\d+)\b/g, '<span style="color:#ffb800">$1</span>')
            .replace(/(\/\/.*$|#.*$)/g, '<span style="color:#3d5266">$1</span>')
            .replace(/\b(bisect_left|bisect|append|print|range|len|log|map|filter|reduce)\b/g, '<span style="color:#82aaff">$1</span>')
          return (
            <span
              key={i}
              dangerouslySetInnerHTML={{ __html: highlighted + '\n' }}
            />
          )
        })}
      </pre>
    </div>
  )
}

export default function Featured() {
  const [featured, setFeatured] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestSpotlight = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/challenges/featured`)
        if (!res.ok) throw new Error('No data available')
        const data = await res.json()
        setFeatured(data)
      } catch (err) {
        console.error('Failed parsing spotlight data loop:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchLatestSpotlight()
  }, [])

  if (loading) {
    return (
      <section id="featured" className="!py-10 !px-14 bg-bg2">
        <SectionHeader eyebrow="Spotlight" title="Today's Challenge" />
        <div className="w-full h-64 rounded-3xl animate-pulse flex items-center justify-center text-xs font-mono-jetbrains text-[#4a5a78] text-muted bg-card border border-border">
          SYNCING TODAY'S CHALLENGE NODE...
        </div>
      </section>
    )
  }

  if (!featured) return null

  return (
    <>
    <section id="featured" className="!py-10 !px-14 bg-bg2">
      <SectionHeader eyebrow="Spotlight" title="Today's Challenge" />

      <div
        className="rounded-2xl !p-14 grid grid-cols-1 md:grid-cols-2 gap-14 items-center relative overflow-hidden border-grad-top border border-border bg-card border-grad-top mt-0"
      >
        <div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-dsa via-devops to-aws animate-tech-grad bg-[length:300%_100%]"
        />

        <div className="w-full">
          <span
            className="font-mono-jetbrains text-[0.6rem] tracking-[2.5px] uppercase block !mb-2 text-dsa"
          >
            Day {featured.day} · {featured.tech}
          </span>
          <h3 className="font-bebas text-5xl tracking-wide leading-none !mb-3 text-text">
            {featured.title}
          </h3>
          <p
            className="text-[0.9rem] leading-loose !mb-4 whitespace-pre-wrap text-muted2"
          >
            {featured.pro_statement}
          </p>
          
          {featured.tags && featured.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {featured.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono-jetbrains text-[0.56rem] !px-3 !py-1 rounded-full bg-white/3 text-muted border border-border whitespace-nowrap uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="w-full">
        <CodeWindow code={featured.code} />
        </div>
        
      </div>
    </section>
    </>
  )
}
