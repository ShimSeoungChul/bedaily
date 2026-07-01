import type { MDXComponents } from 'mdx/types'
import CodeBlock from './CodeBlock'
import MDXImage from './MDXImage'
import Figure from './Figure'
import { TokenDemo, TokenInput, TokenRow, Chip } from './TokenDemo'

export const mdxComponents: MDXComponents = {
  pre: CodeBlock as any,
  img: MDXImage as any,
  Figure: Figure as any,
  TokenDemo: TokenDemo as any,
  TokenInput: TokenInput as any,
  TokenRow: TokenRow as any,
  Chip: Chip as any,
}
