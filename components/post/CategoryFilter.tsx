'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { cn, type Category } from '@/lib/utils'

interface Props {
  active?: string
  categories?: string[]
}

export default function CategoryFilter({ active, categories = [] }: Props) {
  const router = useRouter()
  const params = useSearchParams()

  function select(cat: string | null) {
    const next = new URLSearchParams(params)
    if (cat) {
      next.set('category', cat)
    } else {
      next.delete('category')
    }
    router.push(`/posts?${next.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => select(null)}
        className={cn('rounded-full border px-3 py-1 text-sm transition-colors', !active ? 'font-medium' : '')}
        style={{
          borderColor: 'var(--border)',
          backgroundColor: !active ? 'var(--text)' : 'transparent',
          color: !active ? 'var(--bg)' : 'var(--text-muted)',
        }}
      >
        전체
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => select(cat)}
          className={cn('rounded-full border px-3 py-1 text-sm transition-colors', active === cat ? 'font-medium' : '')}
          style={{
            borderColor: 'var(--border)',
            backgroundColor: active === cat ? 'var(--text)' : 'transparent',
            color: active === cat ? 'var(--bg)' : 'var(--text-muted)',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
