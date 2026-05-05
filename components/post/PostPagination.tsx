import Link from 'next/link'
import type { Post } from '@/lib/mdx/posts'

interface PostPaginationProps {
  prev: Post | null
  next: Post | null
}

export default function PostPagination({ prev, next }: PostPaginationProps) {
  if (!prev && !next) return null

  return (
    <nav
      className="mt-12 grid grid-cols-1 gap-4 border-t pt-8 sm:grid-cols-2"
      style={{ borderColor: 'var(--border)' }}
    >
      {prev ? (
        <Link
          href={`/posts/${prev.slug}`}
          className="card-hover group flex flex-col gap-1 rounded-xl border p-4 transition-all duration-200"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}
        >
          <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>← 이전 글</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            {prev.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/posts/${next.slug}`}
          className="card-hover group flex flex-col items-end gap-1 rounded-xl border p-4 transition-all duration-200"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}
        >
          <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>다음 글 →</span>
          <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>
            {next.frontmatter.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
