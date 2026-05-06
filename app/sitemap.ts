import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx/posts'
import { getAllNews } from '@/lib/mdx/news'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bedaily.me'
  const posts = getAllPosts()
  const news = getAllNews()

  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${base}/posts`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/calendar`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    ...posts.map((p) => ({
      url: `${base}/posts/${p.slug}`,
      lastModified: new Date(p.frontmatter.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...news.map((n) => ({
      url: `${base}/news/${n.slug}`,
      lastModified: new Date(n.frontmatter.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
