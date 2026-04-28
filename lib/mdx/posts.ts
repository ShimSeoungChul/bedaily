import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'
import { calculateReadingTime } from '@/lib/utils'

const POSTS_DIR = path.join(process.cwd(), 'content/posts')

const PostFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  category: z.enum(['Backend', 'AI', 'Java', 'DevOps']),
  tags: z.array(z.string()).default([]),
  summary: z.string(),
  published: z.boolean().default(true),
})

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>

export interface Post {
  slug: string
  frontmatter: PostFrontmatter
  content: string
  readingTime: number
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return []

  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf8')
      const { data, content } = matter(raw)
      const frontmatter = PostFrontmatterSchema.parse(data)
      return { slug, frontmatter, content, readingTime: calculateReadingTime(content) }
    })
    .filter((p) => p.frontmatter.published)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = PostFrontmatterSchema.parse(data)

  if (!frontmatter.published) return null
  return { slug, frontmatter, content, readingTime: calculateReadingTime(content) }
}

export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
  const posts = getAllPosts()
  const index = posts.findIndex((p) => p.slug === slug)
  return {
    prev: index > 0 ? posts[index - 1] : null,
    next: index < posts.length - 1 ? posts[index + 1] : null,
  }
}
