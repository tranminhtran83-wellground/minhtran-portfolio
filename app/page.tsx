'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import type { Project, BlogPost } from '@/lib/contentManager'
import { Loader2, ArrowRight, Calendar, Clock } from 'lucide-react'
import { FamilyValuesDisplay } from '@/components/FamilyValuesDisplay'
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
  const router = useRouter()
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([])
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch home content from CMS
        const homeRes = await fetch('/api/content/home')
        if (homeRes.ok) {
          const homeData = await homeRes.json()
          if (homeData.content) {
            setHomeContent(homeData.content)
          }
        }

        // Fetch featured projects
        const projectsRes = await fetch('/api/content/projects')
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json()
          const featured = (projectsData.projects || [])
            .filter((p: Project) => p.featured && p.status === 'published')
            .slice(0, 3)
          setFeaturedProjects(featured)
        }

        // Fetch latest blog posts
        const postsRes = await fetch('/api/content/blog')
        if (postsRes.ok) {
          const postsData = await postsRes.json()
          const latest = (postsData.posts || [])
            .filter((p: BlogPost) => p.status === 'published')
            .sort((a: BlogPost, b: BlogPost) => {
              const dateA = a.publishedAt || a.createdAt
              const dateB = b.publishedAt || b.createdAt
              return dateB - dateA
            })
            .slice(0, 3)
          setLatestPosts(latest)
        }
      } catch (error) {
        console.error('Failed to fetch homepage data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const lang = language === 'en' ? 'en' : 'vi'

  // Helper: get content from CMS or fallback to LanguageContext
  const hero = {
    name: homeContent?.hero?.[lang]?.name || t('home.hero.name'),
    tagline: homeContent?.hero?.[lang]?.tagline || t('home.hero.tagline'),
    description: homeContent?.hero?.[lang]?.description || t('home.hero.description'),
  }

  const values = homeContent?.values?.length === 3
    ? homeContent.values.map(v => ({ title: v[lang].title, description: v[lang].description }))
    : [
        { title: t('home.values.title1'), description: t('home.values.desc1') },
        { title: t('home.values.title2'), description: t('home.values.desc2') },
        { title: t('home.values.title3'), description: t('home.values.desc3') },
      ]

  const origin = {
    title: homeContent?.origin?.[lang]?.title || t('home.origin.title'),
    act1: homeContent?.origin?.[lang]?.act1 || t('home.origin.act1'),
    question: homeContent?.origin?.[lang]?.question || t('home.origin.act2.question'),
    act3intro: homeContent?.origin?.[lang]?.act3intro || t('home.origin.act3.intro'),
    closing: homeContent?.origin?.[lang]?.closing || t('home.origin.act3.closing'),
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div>
      {/* Garden Hero Banner */}
      <section className="relative w-full overflow-hidden" style={{ height: 'clamp(280px, 40vw, 480px)' }}>
        <Image
          src="/garden-hero.jpg"
          alt="Khu Vườn — A path through the garden"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-garden-bg via-garden-bg/40 to-transparent" />
        {/* Hero text overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-12 px-4">
          <div className="text-center animate-fadeInUp">
            <h1 className="text-4xl md:text-6xl font-bold text-garden-heading drop-shadow-sm">
              {hero.name}
            </h1>
            <p className="mt-3 text-lg md:text-xl text-garden-text/80 font-lora italic max-w-xl mx-auto">
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
              href="/projects"
              className="inline-flex items-center justify-center rounded-lg border border-garden-muted/50 bg-white/60 px-4 py-2 text-sm font-medium font-inter text-garden-text transition-colors hover:bg-white"
            >
              {t('home.hero.viewProjects')}
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-lg bg-garden-accent px-4 py-2 text-sm font-medium font-inter text-white transition-colors hover:bg-primary-700"
            >
              {t('home.hero.aboutMe')}
            </Link>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-8">
          <div className="grid gap-6 md:grid-cols-3">
            {values.map((value, i) => (
              <div key={i} className="rounded-lg border border-garden-muted/30 bg-white/60 p-6 backdrop-blur-sm transition-shadow hover:shadow-md">
                <h3 className="text-lg font-semibold text-garden-accent">{value.title}</h3>
                <p className="mt-2 text-garden-text/80">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Where It All Began - Origin Story */}
        <section className="py-16">
          <div className="mx-auto max-w-3xl">
            {/* Section Header */}
            <h2 className="mb-12 text-center text-3xl font-bold text-garden-heading">
              {origin.title}
            </h2>

            {/* ACT 1: The Discovery */}
            <div className="mb-8 rounded-lg border-l-4 border-garden-accent bg-white/60 p-6 shadow-sm">
              <p className="text-lg leading-relaxed text-garden-text">
                {origin.act1}
              </p>
            </div>

            {/* ACT 2: The Question - HIGHLIGHTED */}
            <div className="mb-8 rounded-lg border-l-4 border-garden-accent bg-primary-50/60 p-6 shadow-sm">
              <p className="text-lg leading-relaxed text-garden-text">
                {t('home.origin.act2.intro')}
              </p>
              <p className="mt-4 text-xl font-semibold text-garden-accent italic">
                &ldquo;{origin.question}&rdquo;
              </p>
            </div>

            {/* ACT 3: The Answer with Embedded Component */}
            <div className="rounded-lg border-l-4 border-garden-accent bg-white/60 p-6 shadow-sm">
              <p className="mb-8 text-lg leading-relaxed text-garden-text">
                {origin.act3intro}
              </p>

              {/* EMBEDDED: Family Values Visual */}
              <div className="my-8">
                <FamilyValuesDisplay size="medium" showDescription={false} embedded={true} />
              </div>

              <p className="text-lg leading-relaxed text-garden-text">
                {origin.closing}
              </p>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-garden-heading">{t('home.featured.projects')}</h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-garden-accent hover:text-primary-700 font-medium font-inter"
            >
              {lang === 'en' ? 'View all' : 'Xem tất cả'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-garden-accent" />
            </div>
          ) : featuredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => router.push(`/projects/${project.slug}`)}
                  className="group bg-white/60 rounded-lg border border-garden-muted/30 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
                >
                  {project.featuredImage && (
                    <div className="aspect-video overflow-hidden bg-garden-bg">
                      <img
                        src={project.featuredImage}
                        alt={project[lang].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-garden-heading group-hover:text-garden-accent transition-colors mb-2">
                      {project[lang].title}
                    </h3>
                    <p className="text-sm text-garden-text/70 line-clamp-2 mb-4">
                      {project[lang].description}
                    </p>
                    {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded font-inter"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="px-2 py-1 bg-garden-bg text-garden-muted text-xs rounded font-inter">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-garden-text/60 text-center py-8">
              {lang === 'en' ? 'No featured projects yet.' : 'Chưa có dự án nổi bật.'}
            </p>
          )}
        </section>

        {/* Latest Blog Posts */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-garden-heading">{t('home.featured.latestPosts')}</h2>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-garden-accent hover:text-primary-700 font-medium font-inter"
            >
              {lang === 'en' ? 'View all' : 'Xem tất cả'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-garden-accent" />
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {latestPosts.map((post) => {
                const publishDate = post.publishedAt
                  ? formatDate(post.publishedAt)
                  : formatDate(post.createdAt)

                return (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/blog/${post.slug}`)}
                    className="group bg-white/60 rounded-lg border border-garden-muted/30 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden backdrop-blur-sm"
                  >
                    {post.featuredImage && (
                      <div className="aspect-video overflow-hidden bg-garden-bg">
                        <img
                          src={post.featuredImage}
                          alt={post[lang].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      {post.category && (
                        <span className="inline-block px-2 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full mb-2 font-inter">
                          {post.category}
                        </span>
                      )}
                      <h3 className="font-semibold text-lg text-garden-heading group-hover:text-garden-accent transition-colors mb-2 line-clamp-2">
                        {post[lang].title}
                      </h3>
                      <p className="text-sm text-garden-text/70 line-clamp-2 mb-4">
                        {post[lang].excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-garden-muted font-inter">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{publishDate}</span>
                        </div>
                        {post.readTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-garden-text/60 text-center py-8">
              {lang === 'en' ? 'No blog posts yet.' : 'Chưa có bài viết.'}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
