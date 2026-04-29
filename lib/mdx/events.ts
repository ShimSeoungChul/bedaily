import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { z } from 'zod'

const EVENTS_DIR = path.join(process.cwd(), 'content/events')
const AUTO_JSON = path.join(process.cwd(), 'data/events-auto.json')

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

const AutoEventSchema = z.object({
  slug: z.string(),
  title: z.string(),
  date: z.string(),
  category: z.enum(['Backend', 'AI', 'Java', 'DevOps']),
  type: z.enum(['release', 'conference', 'ai-release']),
  link: z.string().url().optional(),
  description: z.string().optional(),
})

/** 수동 MDX 이벤트 읽기 */
function getMDXEvents(): CalendarEvent[] {
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
}

/** 자동 fetch JSON 이벤트 읽기 */
function getAutoEvents(): CalendarEvent[] {
  if (!fs.existsSync(AUTO_JSON)) return []

  try {
    const raw = JSON.parse(fs.readFileSync(AUTO_JSON, 'utf8'))
    if (!Array.isArray(raw)) return []

    return raw
      .map((item) => {
        const parsed = AutoEventSchema.safeParse(item)
        if (!parsed.success) return null
        const d = parsed.data
        return {
          slug: d.slug,
          frontmatter: {
            title: d.title,
            date: d.date,
            category: d.category,
            type: d.type,
            link: d.link,
            description: d.description,
            published: true,
          } satisfies EventFrontmatter,
        }
      })
      .filter((e): e is NonNullable<typeof e> => e !== null)
  } catch {
    return []
  }
}

/** MDX(수동) + JSON(자동) 병합. slug 중복 시 MDX 우선. 날짜순 정렬. */
export function getAllEvents(): CalendarEvent[] {
  const manual = getMDXEvents()
  const auto = getAutoEvents()

  const manualSlugs = new Set(manual.map((e) => e.slug))
  const merged = [...manual, ...auto.filter((e) => !manualSlugs.has(e.slug))]

  return merged.sort((a, b) => a.frontmatter.date.localeCompare(b.frontmatter.date))
}
