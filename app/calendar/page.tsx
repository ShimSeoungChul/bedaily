import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getAllEvents } from '@/lib/mdx/events'
import Timeline from '@/components/calendar/Timeline'
import CategoryFilter from '@/components/post/CategoryFilter'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Java · Backend · AI 기술 생태계 주요 릴리즈, 컨퍼런스, AI 모델 출시 일정',
}

interface Props {
  searchParams: Promise<{ category?: string }>
}

export default async function CalendarPage({ searchParams }: Props) {
  const { category } = await searchParams
  const allEvents = getAllEvents()

  const events = category
    ? allEvents.filter((e) => e.frontmatter.category === category)
    : allEvents

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold" style={{ color: 'var(--text)' }}>
          Calendar
        </h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          기술 생태계 주요 릴리즈 · 컨퍼런스 · AI 출시 일정
        </p>
      </div>

      <div className="mb-8">
        <Suspense>
          <CategoryFilter active={category} />
        </Suspense>
      </div>

      <Timeline events={events} />
    </main>
  )
}
