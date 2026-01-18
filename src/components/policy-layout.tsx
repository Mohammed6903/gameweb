import { ReactNode } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import DOMPurify from "isomorphic-dompurify";

interface PolicyLayoutProps {
  title: string
  children: ReactNode
}

function SafeHTML({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
}

export function PolicyLayout({ title, children }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="hover:text-purple-300 transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="font-semibold">{title}</li>
          </ol>
        </nav>
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          {title}
        </h1>
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-lg">
          {children}
        </div>
      </div>
    </div>
  )
}

export { SafeHTML }