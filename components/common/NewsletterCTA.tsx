'use client'
import { useState } from 'react'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.status === 409) {
        setStatus('duplicate')
      } else if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className="rounded-xl border p-6 sm:p-8"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-subtle)' }}
    >
      <h3 className="mb-1 text-base font-semibold" style={{ color: 'var(--text)' }}>
        주간 기술 뉴스레터
      </h3>
      <p className="mb-4 text-sm" style={{ color: 'var(--text-muted)' }}>
        Backend · AI · Java 핵심 내용을 매주 이메일로 보내드립니다.
      </p>

      {status === 'success' ? (
        <p className="text-sm font-medium" style={{ color: '#16a34a' }}>
          구독해 주셔서 감사합니다!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--bg)',
              color: 'var(--text)',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: 'var(--accent)' }}
          >
            {status === 'loading' ? '처리 중...' : '구독하기'}
          </button>
        </form>
      )}
      {status === 'duplicate' && (
        <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>이미 구독 중인 이메일입니다.</p>
      )}
      {status === 'error' && (
        <p className="mt-2 text-xs" style={{ color: '#dc2626' }}>오류가 발생했습니다. 다시 시도해 주세요.</p>
      )}
    </div>
  )
}
