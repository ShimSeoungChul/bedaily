import type { Post } from '@/lib/mdx/posts'
import { formatDate } from '@/lib/utils'
import CategoryBadge from '@/components/common/CategoryBadge'
import ReadingTime from '@/components/common/ReadingTime'

export default function PostHeader({ post }: { post: Post }) {
  return (
    <div className="mb-10 border-b pb-8" style={{ borderColor: 'var(--border)' }}>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <CategoryBadge category={post.frontmatter.category} />
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {formatDate(post.frontmatter.date)}
        </span>
        <ReadingTime minutes={post.readingTime} />
      </div>
      <h1 className="mb-4 text-2xl font-bold leading-snug sm:text-3xl" style={{ color: 'var(--text)' }}>
        {post.frontmatter.title}
      </h1>
      <p className="text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {post.frontmatter.summary}
      </p>
      {post.frontmatter.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md px-2 py-0.5 text-xs font-mono"
              style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
