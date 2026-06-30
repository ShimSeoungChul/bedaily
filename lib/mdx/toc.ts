import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import GithubSlugger from 'github-slugger'

export interface TocItem {
  id: string
  text: string
  depth: 2 | 3
}

export function extractTOC(source: string): TocItem[] {
  const tree = remark().use(remarkGfm).parse(source)
  const items: TocItem[] = []
  // Use the same slugger as rehype-slug (github-slugger) so the TOC anchors
  // match the heading ids in the rendered HTML. Slug every heading in
  // document order so the duplicate-suffix counter stays in sync.
  const slugger = new GithubSlugger()

  visit(tree, 'heading', (node: any) => {
    const text = toString(node)
    if (node.depth === 2 || node.depth === 3) {
      items.push({ id: slugger.slug(text), text, depth: node.depth as 2 | 3 })
    } else {
      // Advance the slugger for other heading depths too, mirroring
      // rehype-slug which assigns ids to every heading in the document.
      slugger.slug(text)
    }
  })

  return items
}
