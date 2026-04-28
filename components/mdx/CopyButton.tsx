'use client'
import { useState } from 'react'

export default function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      aria-label="코드 복사"
      className="absolute right-3 top-3 rounded-md px-2 py-1 text-xs font-medium transition-colors"
      style={{
        backgroundColor: 'rgba(255,255,255,0.08)',
        color: copied ? '#4ade80' : '#94a3b8',
      }}
    >
      {copied ? '복사됨' : '복사'}
    </button>
  )
}
