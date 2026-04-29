'use client'

import { useState } from 'react'
import type { CalendarEvent } from '@/lib/mdx/events'
import EventCard from './EventCard'

interface Props {
  pastGroups: { yearMonth: string; label: string; events: CalendarEvent[] }[]
}

export default function PastSection({ pastGroups }: Props) {
  const [open, setOpen] = useState(false)

  const total = pastGroups.reduce((n, g) => n + g.events.length, 0)
  if (total === 0) return null

  return (
    <div className="mb-10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs font-medium transition-colors"
        style={{ color: 'var(--text-subtle)' }}
      >
        <span
          className="inline-block transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▶
        </span>
        지난 이벤트 {total}개
      </button>

      {open && (
        <div className="mt-6 space-y-10">
          {pastGroups.map(({ yearMonth, label, events }) => (
            <section key={yearMonth}>
              <h2
                className="mb-4 text-sm font-semibold uppercase tracking-widest"
                style={{ color: 'var(--text-subtle)' }}
              >
                {label}
              </h2>
              <div className="space-y-3">
                {events.map((event) => (
                  <EventCard
                    key={event.slug}
                    event={event}
                    isPast={true}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
