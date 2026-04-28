import { createHighlighter, type Highlighter } from 'shiki'

let highlighterPromise: Promise<Highlighter> | null = null

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: [
        'typescript', 'javascript', 'java', 'kotlin',
        'bash', 'shell', 'yaml', 'json', 'dockerfile',
        'sql', 'python', 'go', 'xml', 'html', 'css',
        'markdown', 'mdx', 'properties',
      ],
    })
  }
  return highlighterPromise
}
