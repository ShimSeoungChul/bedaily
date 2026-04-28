import type { CalendarEvent } from '@/lib/mdx/events'
import EventCard from './EventCard'

interface Props {
  events: CalendarEvent[]
}

function groupByMonth(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>()
  for (const event of events) {
    const key = event.frontmatter.date.slice(0, 7) // "YYYY-MM"
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(event)
  }
  return map
}

function formatMonthHeader(yearMonth: string): string {
  const [year, month] = yearMonth.split('-')
  return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  })
}

export default function Timeline({ events }: Props) {
  if (events.length === 0) {
    return (
      <p className="py-16 text-center text-sm" style={{ color: 'var(--text-subtle)' }}>
        표시할 이벤트가 없습니다.
      </p>
    )
  }

  const today = new Date().toISOString().slice(0, 10)
  const grouped = groupByMonth(events)

  return (
    <div className="space-y-10">
      {Array.from(grouped.entries()).map(([yearMonth, monthEvents]) => (
        <section key={yearMonth}>
          <h2
            className="mb-4 text-sm font-semibold uppercase tracking-widest"
            style={{ color: 'var(--text-subtle)' }}
          >
            {formatMonthHeader(yearMonth)}
          </h2>
          <div className="space-y-3">
            {monthEvents.map((event) => (
              <EventCard
                key={event.slug}
                event={event}
                isPast={event.frontmatter.date < today}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
