'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import DOMPurify from 'dompurify'

interface PolicyLayoutProps {
  title: string
  children: ReactNode
}

function SafeHTML({ html }: { html: string }) {
  const [sanitizedHtml, setSanitizedHtml] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSanitizedHtml(DOMPurify.sanitize(html))
    }
  }, [html])

  return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}

export function PolicyLayout({ title, children }: PolicyLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="font-semibold text-foreground">{title}</li>
          </ol>
        </nav>
        <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          {title}
        </h1>
        <div className="bg-card/60 backdrop-blur-md rounded-xl p-8 shadow-lg border border-border/50">
          <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground/90 prose-strong:text-foreground prose-li:text-foreground/90 prose-a:text-primary hover:prose-a:text-primary/80">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export { SafeHTML }