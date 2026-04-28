import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx/posts'
import { getAllNews } from '@/lib/mdx/news'
import PostCard from '@/components/post/PostCard'
import NewsCard from '@/components/news/NewsCard'
import NewsletterCTA from '@/components/common/NewsletterCTA'

export default async function HomePage() {
  const [posts, news] = await Promise.all([
    Promise.resolve(getAllPosts().slice(0, 6)),
    Promise.resolve(getAllNews().slice(0, 4)),
  ])

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="mb-3 text-3xl font-bold sm:text-4xl" style={{ color: 'var(--text)' }}>
          bedaily.dev
        </h1>
        <p className="mb-8 text-lg" style={{ color: 'var(--text-muted)' }}>
          Backend · AI · Java 기술 스택과 뉴스를 매일 정리합니다.
        </p>
        <NewsletterCTA />
      </section>

      {/* Latest Posts */}
      {posts.length > 0 && (
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>최신 글</h2>
            <Link
              href="/posts"
              className="text-sm hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              전체 보기 →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Latest News */}
      {news.length > 0 && (
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>최신 뉴스</h2>
            <Link
              href="/news"
              className="text-sm hover:underline"
              style={{ color: 'var(--accent)' }}
            >
              전체 보기 →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {news.map((item) => (
              <NewsCard key={item.slug} news={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
