import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx/posts'
import { getAllNews } from '@/lib/mdx/news'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bedaily.me'
  const posts = getAllPosts()
  const news = getAllNews()

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/posts`, lastModified: new Date() },
    { url: `${base}/news`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    ...posts.map((p) => ({
      url: `${base}/posts/${p.slug}`,
      lastModified: new Date(p.frontmatter.date),
    })),
    ...news.map((n) => ({
      url: `${base}/news/${n.slug}`,
      lastModified: new Date(n.frontmatter.date),
    })),
  ]
}
