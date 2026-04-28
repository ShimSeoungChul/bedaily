import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '@/lib/mdx/posts'
import { extractTOC } from '@/lib/mdx/toc'
import { compileMDXContent } from '@/lib/mdx/compile'
import PostLayout from '@/components/layout/PostLayout'
import LeftSidebar from '@/components/layout/LeftSidebar'
import TableOfContents from '@/components/toc/TableOfContents'
import PostHeader from '@/components/post/PostHeader'
import PostPagination from '@/components/post/PostPagination'
import NewsletterCTA from '@/components/common/NewsletterCTA'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.summary,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.summary,
      type: 'article',
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
    },
  }
}

export default async function PostDetailPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const [{ content }, toc, adjacent] = await Promise.all([
    compileMDXContent(post.content),
    Promise.resolve(extractTOC(post.content)),
    Promise.resolve(getAdjacentPosts(slug)),
  ])

  return (
    <PostLayout
      sidebar={<LeftSidebar activeCategory={post.frontmatter.category} />}
      toc={<TableOfContents items={toc} />}
    >
      <article>
        <PostHeader post={post} />
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {content}
        </div>
        <div className="mt-12">
          <NewsletterCTA />
        </div>
        <PostPagination prev={adjacent.prev} next={adjacent.next} />
      </article>
    </PostLayout>
  )
}
