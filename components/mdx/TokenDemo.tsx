import type { ReactNode, CSSProperties } from 'react'

// 애널라이저/토큰 변환 데모용 칩 카드. 색은 테두리·배경이 담당하고
// 텍스트는 var(--text) 계열이라 라이트/다크 모두에서 또렷하다.
const mono = 'var(--font-mono), ui-monospace, monospace'

export function TokenDemo({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--bg-subtle)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '4px 20px',
        margin: '24px 0',
        overflowX: 'auto',
      }}
    >
      {children}
    </div>
  )
}

export function TokenInput({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: mono,
        fontSize: '12.5px',
        color: 'var(--text-muted)',
        padding: '12px 0 13px',
        borderBottom: '1px solid var(--border)',
      }}
    >
      입력&nbsp;&nbsp;<span style={{ color: '#e8a85c' }}>{children}</span>
    </div>
  )
}

export function TokenRow({
  name,
  first,
  children,
}: {
  name: ReactNode
  first?: boolean
  children: ReactNode
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '150px 1fr',
        gap: '14px',
        alignItems: 'center',
        padding: '11px 0',
        borderTop: first ? undefined : '1px solid var(--border)',
      }}
    >
      <span style={{ fontFamily: mono, fontSize: '12.5px', color: '#56c7d6', overflowWrap: 'anywhere' }}>
        {name}
      </span>
      <span
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '7px',
          alignItems: 'center',
          color: 'var(--text-subtle)',
          fontFamily: mono,
          fontSize: '13px',
        }}
      >
        {children}
      </span>
    </div>
  )
}

const chipBase: CSSProperties = {
  fontFamily: mono,
  fontSize: '12.5px',
  padding: '3px 10px',
  borderRadius: '6px',
  whiteSpace: 'nowrap',
}

const chipKinds: Record<string, CSSProperties> = {
  raw: { background: 'var(--bg-muted)', border: '1px solid var(--border)', color: 'var(--text-muted)' },
  out: { background: '#56c7d61f', border: '1px solid #56c7d6', color: 'var(--text)' },
  whole: { background: '#e8a85c1f', border: '1px solid #e8a85c', color: 'var(--text)' },
  drop: {
    background: 'var(--bg-muted)',
    border: '1px dashed var(--border)',
    color: 'var(--text-subtle)',
    textDecoration: 'line-through',
  },
  add: { background: '#e07a6b1f', border: '1px solid #e07a6b', color: 'var(--text)' },
}

export function Chip({ k = 'out', children }: { k?: string; children: ReactNode }) {
  return <span style={{ ...chipBase, ...(chipKinds[k] ?? chipKinds.out) }}>{children}</span>
}
