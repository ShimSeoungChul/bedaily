import type { NewsItem } from '@/lib/mdx/news'
import { formatDate } from '@/lib/utils'
import CategoryBadge from '@/components/common/CategoryBadge'

export default function NewsHeader({ news }: { news: NewsItem }) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CategoryBadge category={news.frontmatter.category} />
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {formatDate(news.frontmatter.date)}
        </span>
      </div>
      <h1 className="text-xl font-bold leading-snug sm:text-2xl" style={{ color: 'var(--text)' }}>
        {news.frontmatter.title}
      </h1>
    </div>
  )
}
