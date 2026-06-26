'use client'

import { useState, useEffect } from 'react'

const tabs = [
  { label: 'Fiyatlar', anchor: 'hizmetler' },
  { label: 'Adres', anchor: 'adres' },
  { label: 'Yorumlar', anchor: 'yorumlar' },
]

export default function NavTabs() {
  const [active, setActive] = useState('hizmetler')

  function scrollTo(anchor: string) {
    setActive(anchor)
    const el = document.getElementById(anchor)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { threshold: 0.4 }
    )
    tabs.forEach(({ anchor }) => {
      const el = document.getElementById(anchor)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.anchor}
            onClick={() => scrollTo(tab.anchor)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              active === tab.anchor
                ? 'text-brand-green border-b-2 border-brand-green'
                : 'text-gray-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
