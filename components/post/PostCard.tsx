import Link from 'next/link'
import type { Post } from '@/lib/mdx/posts'
import { formatDate } from '@/lib/utils'
import CategoryBadge from '@/components/common/CategoryBadge'
import ReadingTime from '@/components/common/ReadingTime'

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="card-hover group block rounded-xl border p-5 transition-all duration-200"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CategoryBadge category={post.frontmatter.category} />
        <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
          {formatDate(post.frontmatter.date)}
        </span>
        <ReadingTime minutes={post.readingTime} />
      </div>
      <h2
        className="mb-2 text-base font-semibold leading-snug"
        style={{ color: 'var(--text)' }}
      >
        {post.frontmatter.title}
      </h2>
      <p className="line-clamp-2 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {post.frontmatter.summary}
      </p>
      <p className="mt-3 text-xs font-medium" style={{ color: 'var(--accent)' }}>
        읽기 →
      </p>
    </Link>
  )
}
