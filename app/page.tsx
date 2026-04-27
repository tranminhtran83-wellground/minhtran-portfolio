'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { CVDownloadButton } from '@/components/CVDownloadButton'

interface HomeContent {
  hero: {
    en: { name: string; tagline: string; description: string }
    vi: { name: string; tagline: string; description: string }
  }
  values: Array<{
    en: { title: string; description: string }
    vi: { title: string; description: string }
  }>
  origin: {
    en: { title: string; act1: string; question: string; act3intro: string; closing: string }
    vi: { title: string; act1: string; question: string; act3intro: string; closing: string }
  }
}

export default function HomePage() {
  const { t, language } = useLanguage()
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const homeRes = await fetch('/api/content/home')
        if (homeRes.ok) {
          const homeData = await homeRes.json()
          if (homeData.content) {
            setHomeContent(homeData.content)
          }
        }
      } catch (error) {
        console.error('Failed to fetch homepage data:', error)
      }
    }
    fetchData()
  }, [])

  const lang = language === 'en' ? 'en' : 'vi'

  const hero = {
    name: homeContent?.hero?.[lang]?.name || t('home.hero.name'),
    tagline: homeContent?.hero?.[lang]?.tagline || t('home.hero.tagline'),
    description: homeContent?.hero?.[lang]?.description || t('home.hero.description'),
  }



  return (
    <div>
      {/* Garden Hero Banner — full-width, no gap with header */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: 'clamp(320px, 45vw, 520px)' }}
      >
        <Image
          src="/garden-hero.jpg"
          alt="Khu Vườn — A path through the garden"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient overlay — bottom to top */}
        <div className="absolute inset-0 bg-gradient-to-t from-garden-bg/90 via-garden-bg/30 to-transparent" />
        {/* Hero text — centered vertically and horizontally */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold text-garden-heading drop-shadow-sm">
              {hero.name}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-garden-text/90 font-lora italic max-w-xl mx-auto drop-shadow-sm">
              {hero.tagline}
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4">
        {/* Description + CTA */}
        <section className="py-12 text-center animate-fadeIn">
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-garden-text leading-relaxed">
            {hero.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <CVDownloadButton />
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg bg-garden-accent px-5 py-2.5 text-sm font-medium font-inter text-white transition-colors hover:bg-primary-700"
            >
              {t('home.hero.aboutMe')}
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded-lg border border-garden-muted/50 bg-white/60 px-5 py-2.5 text-sm font-medium font-inter text-garden-text transition-colors hover:bg-white"
            >
              {t('home.hero.viewProjects')}
            </Link>
          </div>
      </div>
    </div>
  )
}
