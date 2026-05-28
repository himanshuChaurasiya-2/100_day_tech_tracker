import React from 'react'
import { Helmet } from 'react-helmet-async'

export default function MetaSEO({ challenge }) {
  const DOMAIN = typeof window !== 'undefined' ? window.location.origin : "https://100days.dev"
  
  const ABSOLUTE_IMAGE = `${DOMAIN}/100.png`
  const ABSOLUTE_ICO = `${DOMAIN}/100.ico`

  // ── 2. DYNAMIC VALUE CONFIGURATION TERNARIES ──
  const title = challenge 
    ? `Day ${String(challenge.day).padStart(2, '0')}: ${challenge.title} | 100 Days of Tech`
    : "100 Days of Tech — DSA · DevOps · AWS Challenge Hub"

  const description = challenge?.pro_statement
    ? challenge.pro_statement.substring(0, 155).trim() + "..."
    : "Master coding with daily interactive 100-day tracking console. Explore comprehensive database solution logs for Data Structures, DevOps pipelines, and AWS architecture."

  const keywords = challenge?.tags?.length > 0
    ? `${challenge.tech.toLowerCase()}, ${challenge.tags.join(', ')}, coding challenge`
    : "100 days of code, DSA challenges, DevOps roadmap, AWS tutorials, coding tracker"

  // ── 3. DYNAMIC GOOGLE STRUCTURED SCHEMA MARKUP ──
  const schemaMarkup = challenge 
    ? {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": challenge.title,
        "alternativeHeadline": `Challenge Day #${challenge.day}`,
        "description": description,
        "image": ABSOLUTE_ICO,
        "articleSection": challenge.tech,
        "keywords": challenge.tags?.join(' ') || challenge.tech,
        "author": { "@type": "Organization", "name": "100Days.dev" }
      }
    : {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "100Days.dev",
        "url": DOMAIN,
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "All",
        "description": description
      }

  return (
    <Helmet>
      
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={DOMAIN} />

      {typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') && (
      <meta name="robots" content="noindex, nofollow, noarchive" />
    )}

      {/* Open Graph & Social Cards */}
      <meta property="og:type" content={challenge ? "article" : "website"} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ABSOLUTE_IMAGE} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={ABSOLUTE_IMAGE} />

      {/* Machine Readable JSON-LD Script */}
      <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
    </Helmet>
  )
}