import Link from 'next/link'
import { CATEGORIES, cn, type Category } from '@/lib/utils'

interface LeftSidebarProps {
  activeCategory?: string
}

export default function LeftSidebar({ activeCategory }: LeftSidebarProps) {
  return (
    <nav className="space-y-6">
      <div>
        <p
          className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider"
          style={{ color: 'var(--text-subtle)' }}
        >
          카테고리
        </p>
        <ul className="space-y-0.5">
          <li>
            <Link
              href="/posts"
              className={cn(
                'block rounded-md px-2 py-1.5 text-sm transition-colors',
                !activeCategory
                  ? 'font-medium'
                  : 'hover:opacity-80'
              )}
              style={{
                backgroundColor: !activeCategory ? 'var(--bg-muted)' : 'transparent',
                color: !activeCategory ? 'var(--text)' : 'var(--text-muted)',
              }}
            >
              전체
            </Link>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <Link
                href={`/posts?category=${cat}`}
                className={cn(
                  'block rounded-md px-2 py-1.5 text-sm transition-colors',
                  activeCategory === cat
                    ? 'font-medium'
                    : 'hover:opacity-80'
                )}
                style={{
                  backgroundColor: activeCategory === cat ? 'var(--bg-muted)' : 'transparent',
                  color: activeCategory === cat ? 'var(--text)' : 'var(--text-muted)',
                }}
              >
                {cat}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
