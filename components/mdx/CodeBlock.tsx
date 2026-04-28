import { getHighlighter } from '@/lib/shiki'
import { transformerMetaHighlight } from '@shikijs/transformers'
import CopyButton from './CopyButton'

interface CodeProps {
  children?: string
  className?: string
  'data-meta'?: string
  'data-language'?: string
}

interface CodeBlockProps {
  children?: React.ReactElement<CodeProps>
}

export default async function CodeBlock({ children }: CodeBlockProps) {
  if (!children) return <pre>{children}</pre>

  const codeProps = children.props
  const rawCode = (codeProps.children ?? '').trimEnd()
  const language = codeProps['data-language'] || codeProps.className?.replace('language-', '') || 'text'
  const meta = codeProps['data-meta'] ?? ''

  const filenameMatch = meta.match(/filename="([^"]+)"/)
  const filename = filenameMatch?.[1]

  const highlighter = await getHighlighter()
  const html = highlighter.codeToHtml(rawCode, {
    lang: language,
    themes: { light: 'github-light', dark: 'github-dark' },
    transformers: [transformerMetaHighlight()],
    meta: { __raw: meta },
  })

  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border" style={{ borderColor: 'var(--border)' }}>
      {filename && (
        <div
          className="flex items-center gap-2 border-b px-4 py-2 text-xs font-mono"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-muted)', color: 'var(--text-muted)' }}
        >
          <span className="opacity-60">📄</span>
          {filename}
        </div>
      )}
      <div className="relative overflow-x-auto">
        <div
          className="[&_.shiki]:!bg-transparent [&_.shiki]:p-4 [&_.shiki]:text-sm [&_.shiki]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <CopyButton code={rawCode} />
      </div>
    </div>
  )
}
