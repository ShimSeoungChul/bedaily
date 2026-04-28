'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/posts', label: 'Posts' },
  { href: '/news', label: 'News' },
  { href: '/calendar', label: 'Calendar' },
]

export default function Header() {
  const pathname = usePathname()

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-sm"
      style={{
        backgroundColor: 'color-mix(in srgb, var(--bg) 85%, transparent)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-base font-bold tracking-tight"
          style={{ color: 'var(--text)' }}
        >
          bedaily.me
        </Link>
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
                style={{
                  color: isActive ? 'var(--text)' : 'var(--text-muted)',
                  backgroundColor: isActive ? 'var(--bg-muted)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
