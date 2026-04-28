import type { MDXComponents } from 'mdx/types'
import CodeBlock from './CodeBlock'
import MDXImage from './MDXImage'

export const mdxComponents: MDXComponents = {
  pre: CodeBlock as any,
  img: MDXImage as any,
}
