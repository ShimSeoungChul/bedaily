import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx/posts'
import PostCard from '@/components/post/PostCard'
import CategoryFilter from '@/components/post/CategoryFilter'

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Backend · AI · Java · DevOps 기술 블로그 글 목록',
}

interface PostsPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const { category } = await searchParams
  const allPosts = getAllPosts()
  const posts = category ? allPosts.filter((p) => p.frontmatter.category === category) : allPosts
  const usedCategories = [...new Set(allPosts.map((p) => p.frontmatter.category))]

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="mb-2 text-2xl font-bold" style={{ color: 'var(--text)' }}>Posts</h1>
        <p className="mb-6 text-sm" style={{ color: 'var(--text-muted)' }}>
          총 {allPosts.length}편
        </p>
        <Suspense>
          <CategoryFilter active={category} categories={usedCategories} />
        </Suspense>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          해당 카테고리의 글이 없습니다.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </main>
  )
}
