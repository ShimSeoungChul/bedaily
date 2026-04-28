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
    <main className="w-full">
      {/* Hero */}
      <section className="hero-section px-4 pt-14 pb-12 sm:pt-16 sm:pb-14">
        <div className="mx-auto max-w-5xl sm:px-6">
          <h1 className="hero-title mb-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            Backend · AI · Java<br />기술을 매일 정리합니다
          </h1>
          <p className="mb-8 max-w-lg text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Java 생태계, 백엔드 아키텍처, AI 에이전트의 핵심 내용을
            읽기 쉽게 정리합니다. 매주 뉴스레터로도 보내드립니다.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full max-w-sm">
              <NewsletterCTA compact />
            </div>
            <Link
              href="/calendar"
              className="text-sm font-medium hover:underline whitespace-nowrap"
              style={{ color: 'var(--text-muted)' }}
            >
              릴리즈 캘린더 보기 →
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
        {/* Latest Posts */}
        {posts.length > 0 && (
          <section className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>최신 글</h2>
              <Link
                href="/posts"
                className="text-sm font-medium hover:underline"
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
              <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>최신 뉴스</h2>
              <Link
                href="/news"
                className="text-sm font-medium hover:underline"
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
      </div>
    </main>
  )
}
