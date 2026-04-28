import Link from 'next/link'

const NAV_LINKS = [
  { href: '/posts', label: 'Posts' },
  { href: '/news', label: 'News' },
  { href: '/about', label: 'About' },
]

export default function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-base font-bold tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          bedaily.dev
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
              style={{ color: 'var(--text-muted)' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
