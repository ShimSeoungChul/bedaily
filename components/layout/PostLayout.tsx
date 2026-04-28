interface PostLayoutProps {
  sidebar: React.ReactNode
  toc: React.ReactNode
  children: React.ReactNode
}

export default function PostLayout({ sidebar, toc, children }: PostLayoutProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex gap-8 lg:gap-12">
        {/* Left sidebar — hidden below lg */}
        <aside className="hidden lg:block w-52 shrink-0">
          <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)]">
            {sidebar}
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          {children}
        </main>

        {/* Right TOC — hidden below xl */}
        <aside className="hidden xl:block w-48 shrink-0">
          <div className="sticky top-20 overflow-y-auto max-h-[calc(100vh-5rem)]">
            {toc}
          </div>
        </aside>
      </div>
    </div>
  )
}
