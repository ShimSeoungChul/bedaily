import type { MDXComponents } from 'mdx/types'
import CodeBlock from './CodeBlock'
import MDXImage from './MDXImage'
import Figure from './Figure'

export const mdxComponents: MDXComponents = {
  pre: CodeBlock as any,
  img: MDXImage as any,
  Figure: Figure as any,
}
