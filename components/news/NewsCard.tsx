import Link from 'next/link'
import type { NewsItem } from '@/lib/mdx/news'
import { formatDate } from '@/lib/utils'
import CategoryBadge from '@/components/common/CategoryBadge'

export default function NewsCard({ news }: { news: NewsItem }) {
  let hostname = ''
  try {
    hostname = new URL(news.frontmatter.source).hostname
  } catch {}

  return (
    <article
      className="card-hover group rounded-xl border p-5 transition-all duration-200"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}
    >
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <CategoryBadge category={news.frontmatter.category} />
        <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
          {formatDate(news.frontmatter.date)}
        </span>
      </div>
      <h2 className="mb-2 text-base font-semibold leading-snug" style={{ color: 'var(--text)' }}>
        <Link href={`/news/${news.slug}`} className="hover:underline">
          {news.frontmatter.title}
        </Link>
      </h2>
      <p className="mb-3 line-clamp-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {news.frontmatter.comment}
      </p>
      {hostname && (
        <a
          href={news.frontmatter.source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs transition-colors hover:underline"
          style={{ color: 'var(--accent)' }}
        >
          {hostname} ↗
        </a>
      )}
    </article>
  )
}
