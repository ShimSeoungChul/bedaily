import type { CalendarEvent } from '@/lib/mdx/events'
import { formatDate } from '@/lib/utils'
import CategoryBadge from '@/components/common/CategoryBadge'

const TYPE_ICON: Record<string, string> = {
  release: '🚀',
  conference: '🎤',
  'ai-release': '🤖',
}

const TYPE_LABEL: Record<string, string> = {
  release: '릴리즈',
  conference: '컨퍼런스',
  'ai-release': 'AI 출시',
}

interface Props {
  event: CalendarEvent
  isPast: boolean
}

export default function EventCard({ event, isPast }: Props) {
  const { frontmatter } = event
  const icon = TYPE_ICON[frontmatter.type]
  const typeLabel = TYPE_LABEL[frontmatter.type]

  return (
    <div
      className="flex gap-4 rounded-lg border p-4 transition-opacity"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--bg-subtle)',
        opacity: isPast ? 0.5 : 1,
      }}
    >
      <div className="mt-0.5 text-xl leading-none">{icon}</div>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <CategoryBadge category={frontmatter.category} />
          <span
            className="text-xs"
            style={{ color: 'var(--text-subtle)' }}
          >
            {typeLabel}
          </span>
          <span
            className="text-xs"
            style={{ color: 'var(--text-subtle)' }}
          >
            {formatDate(frontmatter.date)}
          </span>
        </div>

        {frontmatter.link ? (
          <a
            href={frontmatter.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline"
            style={{ color: 'var(--text)' }}
          >
            {frontmatter.title} ↗
          </a>
        ) : (
          <p className="font-medium" style={{ color: 'var(--text)' }}>
            {frontmatter.title}
          </p>
        )}

        {frontmatter.description && (
          <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
            {frontmatter.description}
          </p>
        )}
      </div>
    </div>
  )
}
