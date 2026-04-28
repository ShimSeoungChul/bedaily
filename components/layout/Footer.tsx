import Link from 'next/link'

const SOCIAL_LINKS = [
  { href: 'https://www.threads.net/@bedaily_dev', label: 'Threads' },
  { href: 'https://www.instagram.com/bedaily_dev', label: 'Instagram' },
  { href: 'https://github.com/bedaily-dev', label: 'GitHub' },
]

export default function Footer() {
  return (
    <footer
      className="mt-auto border-t py-8"
      style={{ borderColor: 'var(--border)' }}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} bedaily.me
        </p>
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors hover:underline"
              style={{ color: 'var(--text-muted)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
