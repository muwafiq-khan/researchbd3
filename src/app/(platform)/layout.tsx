import Link from 'next/link'
import { ReactNode } from 'react'

type PlatformLayoutProps = {
  children: ReactNode
}

export default function PlatformLayout({ children }: PlatformLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-row">

      <aside className="hidden md:flex flex-col items-start px-4 py-4 w-64 fixed h-full border-r border-zinc-800">
        <Link href="/feed" className="text-white font-black text-3xl tracking-tighter mb-8 mt-2 px-3">
          RB
        </Link>
        <nav className="flex flex-col gap-1 w-full flex-1">
          <Link href="/feed" className="flex items-center gap-4 px-3 py-3 rounded-full hover:bg-zinc-900 transition-colors text-lg font-medium">
            <span>🏠</span> <span>Feed</span>
          </Link>
          <Link href="/search" className="flex items-center gap-4 px-3 py-3 rounded-full hover:bg-zinc-900 transition-colors text-lg font-medium">
            <span>🔍</span> <span>Search</span>
          </Link>
          <Link href="/messaging" className="flex items-center gap-4 px-3 py-3 rounded-full hover:bg-zinc-900 transition-colors text-lg font-medium">
            <span>✉️</span> <span>Inbox</span>
          </Link>
          <Link href="/notifications" className="flex items-center gap-4 px-3 py-3 rounded-full hover:bg-zinc-900 transition-colors text-lg font-medium">
            <span>🔔</span> <span>Notifications</span>
          </Link>
          <Link href="/profile" className="flex items-center gap-4 px-3 py-3 rounded-full hover:bg-zinc-900 transition-colors text-lg font-medium">
            <span>👤</span> <span>Profile</span>
          </Link>
        </nav>
        <div className="flex flex-col gap-1 w-full mb-4">
          <button className="flex items-center gap-4 px-3 py-3 rounded-full hover:bg-zinc-900 transition-colors text-lg font-medium w-full text-left">
            <span>⚙️</span> <span>Settings</span>
          </button>
          <button className="flex items-center gap-4 px-3 py-3 rounded-full hover:bg-zinc-900 transition-colors text-lg font-medium w-full text-left">
            <span>🔧</span> <span>Filter</span>
          </button>
        </div>
        <Link href="/posts/create" className="w-full bg-white text-black font-bold py-3 rounded-full text-center text-lg hover:bg-zinc-200 transition-colors mb-2">
          + Post
        </Link>
      </aside>

      <main className="flex-1 md:ml-64 md:mr-auto md:max-w-2xl w-full min-h-screen border-x border-zinc-800 pb-20 md:pb-0">
        <div className="sticky top-0 z-40 bg-black border-b border-zinc-800">
          <div className="flex items-center justify-between px-4 py-3 md:hidden">
            <span className="text-white font-black text-2xl tracking-tighter">RB</span>
            <button className="text-white text-xl">•••</button>
          </div>
          <div className="flex">
            <Link href="/feed" className="flex-1 text-center py-3 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors border-b-2 border-transparent hover:border-white">
              Feed
            </Link>
            <Link href="/problems" className="flex-1 text-center py-3 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors border-b-2 border-transparent hover:border-white">
              Problems
            </Link>
          </div>
        </div>
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-zinc-800 flex justify-around items-center py-3 md:hidden z-50">
        <Link href="/feed" className="flex flex-col items-center text-white text-xl">🏠</Link>
        <Link href="/search" className="flex flex-col items-center text-white text-xl">🔍</Link>
        <Link href="/messaging" className="flex flex-col items-center text-white text-xl">✉️</Link>
        <Link href="/notifications" className="flex flex-col items-center text-white text-xl">🔔</Link>
        <Link href="/profile" className="flex flex-col items-center text-white text-xl">👤</Link>
      </nav>

      <Link
        href="/posts/create"
        className="fixed bottom-20 right-5 bg-white text-black font-bold w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg md:hidden z-50"
      >
        +
      </Link>

    </div>
  )
}