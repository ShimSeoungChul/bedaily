import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import { visit } from 'unist-util-visit'
import { mdxComponents } from '@/components/mdx/mdx-components'

// Preserves code block `meta` string as data-meta HTML attribute
// (remark-rehype drops it by default)
function remarkPreserveMeta() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      if (!node.data) node.data = {}
      if (!node.data.hProperties) node.data.hProperties = {}
      node.data.hProperties['data-meta'] = node.meta ?? ''
      node.data.hProperties['data-language'] = node.lang ?? 'text'
    })
  }
}

export async function compileMDXContent(source: string) {
  return compileMDX({
    source,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkPreserveMeta],
        rehypePlugins: [rehypeSlug],
      },
    },
  })
}
