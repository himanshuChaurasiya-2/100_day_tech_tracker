import { useState, useEffect } from 'react'
import SectionHeader from './SectionHeader.jsx'
import ChallengeCard from './ChallengeCard.jsx'
import {API_BASE_URL} from '../config/api.js'

const TECH_OPTIONS = ['all', 'DSA', 'DevOps', 'AWS']
const DIFF_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Easy', value: 1 },
  { label: 'Medium', value: 2 },
  { label: 'Hard', value: 3 },
]
const TECH_THEME_MAP = {
  all:    { active: 'border-dsa text-dsa bg-dsa/6',       fallback: 'border-border2 text-muted2 hover:border-dsa/50 hover:text-dsa' },
  DSA:    { active: 'border-dsa text-dsa bg-dsa/6',       fallback: 'border-border2 text-muted2 hover:border-dsa/50 hover:text-dsa' },
  DevOps: { active: 'border-devops text-devops bg-devops/6', fallback: 'border-border2 text-muted2 hover:border-devops/50 hover:text-devops' },
  AWS:    { active: 'border-aws text-aws bg-aws/6',       fallback: 'border-border2 text-muted2 hover:border-aws/50 hover:text-aws' },
}

function FilterChip({ active, techType, onClick, children }) {
  const currentTheme = TECH_THEME_MAP[techType] || TECH_THEME_MAP['all']
  
  return (
    <button
      onClick={onClick}
      className={`font-mono-jetbrains text-[0.58rem] !px-3.5 !py-1.5 rounded-full transition-all duration-200 cursor-none border tracking-[0.5px] uppercase whitespace-nowrap ${
        active ? currentTheme.active : currentTheme.fallback
      }`}
    >
      {children}
    </button>
  )
}

export default function Challenges({ onOpenModal }) {
  const [query, setQuery] = useState('')
  const [fTech, setFTech] = useState('all')
  const [fDiff, setFDiff] = useState('all')
  const [shown, setShown] = useState(8)
  
  const [challenges, setChallenges] = useState([])
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  const [fetchingId, setFetchingId] = useState(null)

  useEffect(() => {
    const fetchLiveChallenges = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({
          tech: fTech,
          diff: fDiff,
          query: query,
          limit: shown
        })

        const res = await fetch(`${API_BASE_URL}/challenges?${params.toString()}`)
        const data = await res.json()

        setChallenges(data.challenges || [])
        setHasMore(data.hasMore || false)
      } catch (err) {
        console.error('Failed to resolve live database collections:', err)
      } finally {
        setLoading(false)
      }
    }

    const bounceTimer = setTimeout(() => {
      fetchLiveChallenges()
    }, query ? 300 : 0)

    return () => clearTimeout(bounceTimer)
  }, [query, fTech, fDiff, shown])

  const handleChallengeClick = async (summaryChallenge) => {
    if (fetchingId) return // Guard clause against rapid duplicate double clicks

    setFetchingId(summaryChallenge._id)
    try {
      // Make a high-speed fetch call for the single clicked document ID
      const res = await fetch(`${API_BASE_URL}/challenges/${summaryChallenge._id}`)
      
      if (!res.ok) throw new Error('Failed to download full data')
      const fullChallengeData = await res.json()

      // Send the completed, code-hydrated item directly to your global modal handler
      onOpenModal(fullChallengeData)
    } catch (err) {
      console.error('Error fetching complete challenge details:', err)
      // Safety Fallback: Opens modal with listing card preview fields if backend drops connection
      onOpenModal(summaryChallenge)
    } finally {
      setFetchingId(null)
    }
  }

  function handleTech(t) {
    setFTech(t)
    setShown(8)
  }
  function handleDiff(d) {
    setFDiff(d)
    setShown(8)
  }
  function handleSearch(e) {
    setQuery(e.target.value)
    setShown(8)
  }

  return (
    <>
    <section id="challenges" className="!py-4 !px-14 bg-bg2">
      <SectionHeader
        eyebrow="Browse All"
        title="100 Day Archive"
        subtitle="Search by day number, question title, or filter by tech. Click any card for the full answer + code."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-4 lg:items-start" >
        
        <div className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          
          <div className="relative w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm opacity-35 pointer-events-none select-none">🔍</span>
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search day or question…"
              className="w-full rounded-xl !py-3 !pl-10 !pr-4 text-[0.9rem] outline-none transition-all duration-200 font-outfit border border-border bg-card text-text focus:border-dsa hover:text-dsa"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 w-full">

          <div className="rounded-2xl !p-4 bg-card border border-border">
            <div className="font-mono-jetbrains text-[0.6rem] tracking-[2.5px] uppercase !mb-2 text-muted">
              Tech Track
            </div>
            <div className="flex flex-wrap gap-2">
              {TECH_OPTIONS.map((t) => (
                <FilterChip key={t} active={fTech === t} color={TECH_THEME_MAP[t]} onClick={() => handleTech(t)}>
                  {t === 'all' ? 'All' : t}
                </FilterChip>
              ))}
            </div>
          </div>

          <div className="rounded-2xl !p-4 bg-card border border-border">
            <div className="font-mono-jetbrains text-[0.6rem] tracking-[2.5px] uppercase !mb-2 text-muted">
              Difficulty
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DIFF_OPTIONS.map(({ label, value }) => (
                <FilterChip key={label} active={fDiff === value} techType="all" onClick={() => handleDiff(value)}>
                  {label}
                </FilterChip>
              ))}
            </div>
          </div>
          </div>
        </div>

        <div className='w-full'>
          {challenges.length === 0 && !loading ? (
            <div className="font-mono-jetbrains text-[0.72rem] tracking-[1.5px] text-center !py-16 text-muted">
              No challenges found 🔍
            </div>
          ) : (
            <div 
              className={`grid gap-3 sm:gap-4 transition-opacity duration-200 
              grid-cols-1 
              sm:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] 
              ${loading ? 'opacity-40' : 'opacity-100'}`}
            >
              {challenges.map((c, i) => (
                <ChallengeCard
                  key={c._id || c.day}
                  challenge={c}
                  onClick={() => handleChallengeClick(c)}
                  animDelay={i * 0.05}
                  isFetchingDetails={fetchingId === c._id}
                />
              ))}
            </div>
          )}

          {hasMore && (
            <div className="text-center !mt-9">
              <button
                onClick={() => setShown((s) => s + 8)}
                disabled={loading}
                className="font-mono-jetbrains text-[0.6rem] !px-7 !py-3 rounded-full border border-border2 bg-transparent text-muted uppercase tracking-[2px] transition-all duration-200 disabled:opacity-50 cursor-none hover:border-dsa hover:text-dsa"
              >
                {loading ? 'Syncing...' : 'Load more days ↓'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  )
}
