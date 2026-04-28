import type { Metadata } from 'next'
import { getAllNews } from '@/lib/mdx/news'
import NewsCard from '@/components/news/NewsCard'

export const metadata: Metadata = {
  title: 'News',
  description: 'Backend · AI · Java · DevOps 기술 뉴스 큐레이션',
}

export default function NewsPage() {
  const news = getAllNews()

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold" style={{ color: 'var(--text)' }}>News</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          총 {news.length}건
        </p>
      </div>

      {news.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          아직 등록된 뉴스가 없습니다.
        </p>
      ) : (
        <div className="space-y-4">
          {news.map((item) => (
            <NewsCard key={item.slug} news={item} />
          ))}
        </div>
      )}
    </main>
  )
}
