interface FigureProps {
  children: React.ReactNode
  caption?: string
}

export default function Figure({ children, caption }: FigureProps) {
  return (
    <figure className="my-8">
      <div
        className="overflow-x-auto rounded-xl border p-4"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-subtle)' }}
      >
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
