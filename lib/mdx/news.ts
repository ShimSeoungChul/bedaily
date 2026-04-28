import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

const NEWS_DIR = path.join(process.cwd(), 'content/news')

const NewsFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  category: z.enum(['Backend', 'AI', 'Java', 'DevOps']),
  tags: z.array(z.string()).default([]),
  source: z.string().url(),
  comment: z.string(),
  published: z.boolean().default(true),
})

export type NewsFrontmatter = z.infer<typeof NewsFrontmatterSchema>

export interface NewsItem {
  slug: string
  frontmatter: NewsFrontmatter
  content: string
}

export function getAllNews(): NewsItem[] {
  if (!fs.existsSync(NEWS_DIR)) return []

  return fs
    .readdirSync(NEWS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(NEWS_DIR, filename), 'utf8')
      const { data, content } = matter(raw)
      const frontmatter = NewsFrontmatterSchema.parse(data)
      return { slug, frontmatter, content }
    })
    .filter((n) => n.frontmatter.published)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
}

export function getNewsBySlug(slug: string): NewsItem | null {
  const filePath = path.join(NEWS_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = NewsFrontmatterSchema.parse(data)

  if (!frontmatter.published) return null
  return { slug, frontmatter, content }
}
