'use client'
import { useState, useEffect } from 'react'
import type { TocItem } from '@/lib/mdx/toc'

export default function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '0% 0% -70% 0%', threshold: 0 }
    )

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  if (items.length === 0) return null

  return (
    <nav aria-label="목차">
      <p
        className="mb-3 text-xs font-semibold uppercase tracking-wider"
        style={{ color: 'var(--text-subtle)' }}
      >
        On this page
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.depth === 3 ? '12px' : '0' }}>
            <a
              href={`#${item.id}`}
              className="block truncate py-0.5 text-sm transition-colors"
              style={{
                color: activeId === item.id ? 'var(--accent)' : 'var(--text-muted)',
                fontWeight: activeId === item.id ? 500 : 400,
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
