'use client'

import Link from 'next/link'
import { Navigation } from './Navigation'
import { MobileNav } from './MobileNav'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-garden-muted/30 bg-garden-bg/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-garden-accent font-lora">
          Minh Tran
        </Link>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Navigation />
          <LanguageSwitcher />
        </div>
        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
