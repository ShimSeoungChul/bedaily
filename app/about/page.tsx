import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'bedaily.dev 소개 — Backend, AI, Java 기술 블로그',
}

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/bedaily-dev' },
  { label: 'Threads', href: 'https://www.threads.net/@bedaily_dev' },
  { label: 'Instagram', href: 'https://www.instagram.com/bedaily_dev' },
]

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="mb-6 text-2xl font-bold" style={{ color: 'var(--text)' }}>About</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>bedaily.dev</strong>는 Backend · AI · Java 분야의 기술 스택과 뉴스를 정리하는 개인 기술 블로그입니다.
        </p>
        <p>
          Threads와 Instagram에 짧게 공유하는 내용의 심화 버전을 이곳에 아카이빙합니다.
          Java와 Spring 생태계, LLM 기반 AI 서비스, 백엔드 아키텍처 등을 주로 다룹니다.
        </p>
        <h2>운영자</h2>
        <p>
          백엔드 개발자 Seoungchul Shim. Java/Spring 기반 서버 개발과 AI 서비스 통합에 관심이 많습니다.
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            {link.label} ↗
          </a>
        ))}
      </div>
    </main>
  )
}
