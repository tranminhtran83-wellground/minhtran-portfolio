'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
//import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { CVDownloadButton } from '@/components/CVDownloadButton'

interface HomeContent {
  hero: {
    en: { name: string; tagline: string; description: string; bannerImage?: string }
    vi: { name: string; tagline: string; description: string; bannerImage?: string }
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/content/home')
        if (res.ok) {
          const data = await res.json()
          if (data.content) setHomeContent(data.content)
        }
      } catch (error) {
        console.error('Failed to fetch homepage data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  //const lang = language === 'en' ? 'en' : 'vi'

  // Dùng data từ database, fallback về translations nếu chưa có
  //const hero = {
  //  name: homeContent?.hero?.[lang]?.name || t('home.hero.name'),
  //  tagline: homeContent?.hero?.[lang]?.tagline || t('home.hero.tagline'),
  //  description: homeContent?.hero?.[lang]?.description || t('home.hero.description'),
  //  bannerImage: homeContent?.hero?.en?.bannerImage || '/garden-hero.jpg',
  //}

  const lang = language === 'en' ? 'en' : 'vi'

  // Tính hero SAU KHI có cả homeContent lẫn language
  const heroDB = homeContent?.hero?.[lang]
  const hero = {
    name: heroDB?.name || t('home.hero.name'),
    tagline: heroDB?.tagline || t('home.hero.tagline'),
    description: heroDB?.description || t('home.hero.description'),
    bannerImage: homeContent?.hero?.en?.bannerImage || '/garden-hero.jpg',
  }

  return (
    // Toàn bộ trang = đúng 1 màn hình (100dvh trừ header ~64px)
    <div className="flex flex-col" style={{ height: 'calc(100dvh - 64px)' }}>

      {/* Banner — chiếm ~60% chiều cao -> Tran modify 28 Apr 2026 */}
      <section className="relative flex-shrink-0" style={{ height: '60%' }}>
<img
  src={hero.bannerImage}
  alt="Khu Vườn"
  className="absolute inset-0 w-full h-full object-cover object-center"
/>
        <div className="absolute inset-0 bg-gradient-to-t from-garden-bg/90 via-garden-bg/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-garden-heading drop-shadow-sm">
              {hero.name}
            </h1>
            <p className="mt-4 text-lg md:text-xl text-garden-text/90 font-lora italic max-w-xl mx-auto drop-shadow-sm">
              {hero.tagline}
            </p>
          </div>
        </div>
      </section>

         {/* Description + CTA — chiếm ~40% còn lại */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center bg-garden-bg">
        <p className="mx-auto max-w-2xl text-lg md:text-xl text-garden-text leading-relaxed">
          {loading ? '...' : hero.description}
        </p>
        
        <div className="mt-6 flex flex-wrap justify-center gap-4">
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
      </section>

    </div>
  )
}
