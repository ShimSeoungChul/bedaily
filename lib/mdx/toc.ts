import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import { slugify } from '@/lib/utils'

export interface TocItem {
  id: string
  text: string
  depth: 2 | 3
}

export function extractTOC(source: string): TocItem[] {
  const tree = remark().use(remarkGfm).parse(source)
  const items: TocItem[] = []

  visit(tree, 'heading', (node: any) => {
    if (node.depth === 2 || node.depth === 3) {
      const text = toString(node)
      items.push({ id: slugify(text), text, depth: node.depth as 2 | 3 })
    }
  })

  return items
}
