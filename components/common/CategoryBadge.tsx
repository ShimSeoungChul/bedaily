import type { Category } from '@/lib/utils'

const BADGE_STYLES: Record<Category, { bg: string; text: string }> = {
  Backend: { bg: 'rgba(37,99,235,0.1)', text: '#2563eb' },
  AI:      { bg: 'rgba(124,58,237,0.1)', text: '#7c3aed' },
  Java:    { bg: 'rgba(234,88,12,0.1)', text: '#ea580c' },
  DevOps:  { bg: 'rgba(22,163,74,0.1)', text: '#16a34a' },
}

export default function CategoryBadge({ category }: { category: Category }) {
  const style = BADGE_STYLES[category] ?? { bg: 'rgba(100,116,139,0.1)', text: '#64748b' }

  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {category}
    </span>
  )
}
