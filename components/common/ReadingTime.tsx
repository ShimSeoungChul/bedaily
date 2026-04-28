export default function ReadingTime({ minutes }: { minutes: number }) {
  return (
    <span className="text-sm" style={{ color: 'var(--text-subtle)' }}>
      {minutes}분 읽기
    </span>
  )
}
