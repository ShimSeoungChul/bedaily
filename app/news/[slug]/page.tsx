import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllNews, getNewsBySlug } from '@/lib/mdx/news'
import { compileMDXContent } from '@/lib/mdx/compile'
import NewsLayout from '@/components/layout/NewsLayout'
import NewsHeader from '@/components/news/NewsHeader'
import SourceCard from '@/components/news/SourceCard'
import NewsletterCTA from '@/components/common/NewsletterCTA'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllNews().map((item) => ({ slug: item.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const news = getNewsBySlug(slug)
  if (!news) return {}

  return {
    title: news.frontmatter.title,
    description: news.frontmatter.comment,
    openGraph: {
      title: news.frontmatter.title,
      description: news.frontmatter.comment,
      type: 'article',
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params
  const news = getNewsBySlug(slug)
  if (!news) notFound()

  const { content } = await compileMDXContent(news.content)

  return (
    <NewsLayout>
      <article>
        <NewsHeader news={news} />
        <SourceCard source={news.frontmatter.source} />

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {content}
        </div>

        {news.frontmatter.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {news.frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md px-2 py-0.5 text-xs font-mono"
                style={{ backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-12">
          <NewsletterCTA />
        </div>
      </article>
    </NewsLayout>
  )
}
