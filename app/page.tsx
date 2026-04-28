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
      <section className="hero-section relative overflow-hidden px-4 pt-16 pb-12 sm:pt-20 sm:pb-14">
        {/* 배경 글로우 */}
        <div className="hero-glow" aria-hidden="true" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
            Backend · AI · Java · DevOps
          </p>
          <h1 className="hero-title mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
            기술을 매일<br />정리합니다
          </h1>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            백엔드 개발, AI 에이전트, Java 생태계의 핵심 내용을<br className="hidden sm:block" />
            읽기 쉽게 정리해 매주 뉴스레터로 보내드립니다.
          </p>

          {/* CTA 버튼 그룹 */}
          <div className="mb-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/posts"
              className="inline-flex h-11 items-center rounded-lg px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              글 읽기
            </Link>
            <Link
              href="/calendar"
              className="inline-flex h-11 items-center rounded-lg border px-6 text-sm font-semibold transition-colors hover:bg-[var(--bg-muted)]"
              style={{ borderColor: 'var(--border)', color: 'var(--text)' }}
            >
              릴리즈 캘린더 →
            </Link>
          </div>

          {/* 뉴스레터 */}
          <div className="mx-auto max-w-md">
            <NewsletterCTA compact />
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
