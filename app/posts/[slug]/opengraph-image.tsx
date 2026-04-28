import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/mdx/posts'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  const title = post?.frontmatter.title ?? 'bedaily.dev'
  const category = post?.frontmatter.category ?? ''

  return new ImageResponse(
    (
      <div
        style={{
          background: '#0f172a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#60a5fa', fontSize: 20, fontWeight: 600 }}>
            bedaily.dev
          </span>
          {category && (
            <span
              style={{
                background: 'rgba(96,165,250,0.15)',
                color: '#60a5fa',
                fontSize: 16,
                padding: '4px 12px',
                borderRadius: 20,
              }}
            >
              {category}
            </span>
          )}
        </div>

        <div
          style={{
            color: '#f8fafc',
            fontSize: title.length > 40 ? 48 : 60,
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </div>

        <div style={{ color: '#64748b', fontSize: 18 }}>
          Backend · AI · Java 기술 블로그
        </div>
      </div>
    ),
    size,
  )
}
