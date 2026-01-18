import React from 'react'
import Link from 'next/link'
import { Home, Info, Phone, Shield, FileText, Settings } from 'lucide-react'

interface footerProps {
  siteName: string
}

export default function Footer({siteName}: footerProps) {
  return (
    <footer className="bg-card/95 border-t border-primary/20 w-full py-6 md:py-8 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className='flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8'>
          <div className='text-foreground'>
            <Link href="/">
              <h1 className='text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors'>
                {siteName ?? "Game"} • Browse all games
              </h1>
            </Link>
          </div>

          <nav className='text-muted-foreground flex flex-wrap justify-center gap-6 md:gap-8 text-sm'>
            <FooterLink href="/" icon={Home} text="Home" />
            <FooterLink href="/pages/about" icon={Info} text="About Us" />
            <FooterLink href="/pages/contacts" icon={Phone} text="Contact" />
            <FooterLink href="/pages/dmca" icon={Shield} text="DMCA" />
            <FooterLink href="/pages/privacy-policy" icon={FileText} text="Privacy Policy" />
            <FooterLink href="/pages/terms" icon={FileText} text="Terms of Service" />
            <FooterLink href="#" icon={Settings} text={`Powered by ${siteName ?? "Games"}`} />
          </nav>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, icon: Icon, text }: { href: string, icon: React.ElementType, text: string }) {
  return (
    <Link href={href} className='flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'>
      <Icon className='w-4 h-4' />
      <span className='font-medium'>{text}</span>
    </Link>
  )
}
