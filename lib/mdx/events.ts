import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

const EVENTS_DIR = path.join(process.cwd(), 'content/events')

const EventFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  category: z.enum(['Backend', 'AI', 'Java', 'DevOps']),
  type: z.enum(['release', 'conference', 'ai-release']),
  link: z.string().url().optional(),
  description: z.string().optional(),
  published: z.boolean().default(true),
})

export type EventFrontmatter = z.infer<typeof EventFrontmatterSchema>

export interface CalendarEvent {
  slug: string
  frontmatter: EventFrontmatter
}

export function getAllEvents(): CalendarEvent[] {
  if (!fs.existsSync(EVENTS_DIR)) return []

  return fs
    .readdirSync(EVENTS_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(EVENTS_DIR, filename), 'utf8')
      const { data } = matter(raw)
      const frontmatter = EventFrontmatterSchema.parse(data)
      return { slug, frontmatter }
    })
    .filter((e) => e.frontmatter.published)
    .sort((a, b) => a.frontmatter.date.localeCompare(b.frontmatter.date))
}
