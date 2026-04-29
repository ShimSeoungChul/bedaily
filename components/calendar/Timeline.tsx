import type { CalendarEvent } from '@/lib/mdx/events'
import EventCard from './EventCard'
import PastSection from './PastSection'

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
  const currentMonth = today.slice(0, 7) // "YYYY-MM"

  const grouped = groupByMonth(events)

  // 이번 달 기준으로 과거 / 현재+미래 분리
  const pastGroups: { yearMonth: string; label: string; events: CalendarEvent[] }[] = []
  const upcomingEntries: [string, CalendarEvent[]][] = []

  for (const [yearMonth, monthEvents] of grouped.entries()) {
    if (yearMonth < currentMonth) {
      pastGroups.push({
        yearMonth,
        label: formatMonthHeader(yearMonth),
        events: monthEvents,
      })
    } else {
      upcomingEntries.push([yearMonth, monthEvents])
    }
  }

  return (
    <div>
      {/* 지난 이벤트 — 기본 접힘 */}
      <PastSection pastGroups={pastGroups} />

      {/* 현재 월 + 미래 */}
      {upcomingEntries.length === 0 ? (
        <p className="py-16 text-center text-sm" style={{ color: 'var(--text-subtle)' }}>
          예정된 이벤트가 없습니다.
        </p>
      ) : (
        <div className="space-y-10">
          {upcomingEntries.map(([yearMonth, monthEvents]) => {
            const isCurrentMonth = yearMonth === currentMonth
            return (
              <section key={yearMonth}>
                <h2
                  className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest"
                  style={{ color: 'var(--text-subtle)' }}
                >
                  {formatMonthHeader(yearMonth)}
                  {isCurrentMonth && (
                    <span
                      className="rounded px-1.5 py-0.5 text-xs font-medium normal-case tracking-normal"
                      style={{
                        backgroundColor: 'var(--bg-muted)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      이번 달
                    </span>
                  )}
                </h2>
                <div className="space-y-3">
                  {monthEvents.map((event) => (
                    <EventCard
                      key={event.slug}
                      event={event}
                      isPast={false}
                    />
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
