import { useState, useEffect } from 'react'
import SectionHeader from './SectionHeader.jsx'
import {API_BASE_URL} from '../config/api'

function CodeWindow({ code }) {
  if (!code) return null;

  return (
    <div
      className="rounded-2xl !p-3 overflow-x-auto bg-bg/60 border border-border2"
    >
      <div className="flex items-center gap-1 !mb-2">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]"/>
        <div className="w-3 h-3 rounded-full bg-[#febc2e]"/>
        <div className="w-3 h-3 rounded-full bg-[#28c840]"/>
        <span
          className="font-mono-jetbrains text-xs tracking-[1px] ml-auto text-muted"
        >
          Source Code
        </span>
      </div>

      <pre
        className="font-mono-jetbrains text-sm  whitespace-pre-line text-text/70"
      >
        {code.split('\n').map((line, i) => {

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
        <div className="w-full h-64 rounded-3xl animate-pulse flex items-center justify-center text-xs font-mono-jetbrains text-muted bg-card border border-border">
          SYNCING TODAY'S CHALLENGE NODE...
        </div>
      </section>
    )
  }

  if (!featured) return null

  return (
    <>
    <section id="featured" className="!py-4 !px-14 bg-bg2">
      <SectionHeader eyebrow="Spotlight" title="Today's Challenge" />

      <div
        className="rounded-2xl !p-4 grid grid-cols-1 md:grid-cols-2 gap-2 items-center relative overflow-hidden border-grad-top border border-border bg-card border-grad-top"
      >
        <div
          className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-dsa via-devops to-aws animate-tech-grad bg-[length:300%_100%]"
        />

        <div className="w-full">
          <span
            className="font-mono-jetbrains text-xs tracking-[1.5px] uppercase block !mb-1 text-dsa"
          >
            Day {featured.day}·{featured.tech}
          </span>
          <span className="font-bebas text-3xl leading-none text-text">
            {featured.title}
          </span>
          <p
            className="text-s leading-loose !mb-2 whitespace-pre-wrap text-muted2"
          >
            {featured.pro_statement}
          </p>
          
          {featured.tags && featured.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {featured.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono-jetbrains text-xs !px-3 !py-1 rounded-full bg-bg2/3 text-muted2 border border-border whitespace-nowrap uppercase tracking-wider"
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
