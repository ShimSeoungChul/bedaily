interface SourceCardProps {
  source: string
}

export default function SourceCard({ source }: SourceCardProps) {
  let hostname = source
  try {
    hostname = new URL(source).hostname
  } catch {}

  return (
    <div
      className="my-6 flex items-center justify-between rounded-lg border px-4 py-3"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}
    >
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-subtle)' }}>
          출처
        </p>
        <p className="truncate text-sm" style={{ color: 'var(--text-muted)' }}>
          {hostname}
        </p>
      </div>
      <a
        href={source}
        target="_blank"
        rel="noopener noreferrer"
        className="ml-4 shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-80"
        style={{ backgroundColor: 'var(--accent)', color: '#fff' }}
      >
        원문 보기 ↗
      </a>
    </div>
  )
}
