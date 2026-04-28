interface NewsLayoutProps {
  children: React.ReactNode
}

export default function NewsLayout({ children }: NewsLayoutProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {children}
    </div>
  )
}
