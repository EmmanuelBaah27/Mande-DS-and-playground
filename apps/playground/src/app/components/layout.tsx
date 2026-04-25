import Link from "next/link"
import { SidebarNav } from "./_shared/sidebar-nav"

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-neutral-50">
      <aside className="w-52 shrink-0 border-r border-neutral-200 bg-neutral-white overflow-y-auto flex flex-col">
        <div className="px-5 pt-5 pb-3 border-b border-neutral-100">
          <Link
            href="/"
            className="text-small-medium text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            ← Playground
          </Link>
          <p className="mt-1.5 text-base-semibold text-neutral-900">Components</p>
        </div>
        <SidebarNav />
      </aside>
      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  )
}
