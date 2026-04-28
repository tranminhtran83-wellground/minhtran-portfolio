'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

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

const DEFAULT_BANNER = 'https://poai0ayjizimpaux.public.blob.vercel-storage.com/Banner3.jpg'

const defaultContent: HomeContent = {
  hero: {
    en: { name: '', tagline: '', description: '', bannerImage: DEFAULT_BANNER },
    vi: { name: '', tagline: '', description: '', bannerImage: DEFAULT_BANNER },
  },
  values: [],
  origin: {
    en: { title: '', act1: '', question: '', act3intro: '', closing: '' },
    vi: { title: '', act1: '', question: '', act3intro: '', closing: '' },
  },
}

export default function AdminHomePage() {
  const [content, setContent] = useState<HomeContent>(defaultContent)
  const [activeTab, setActiveTab] = useState<'en' | 'vi'>('en')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function fetchContent() {
      try {
        const res = await fetch('/api/admin/content/home')
        if (res.ok) {
          const data = await res.json()
          if (data.content) {
            // Đảm bảo bannerImage có fallback
            const fetched = data.content
            if (!fetched.hero?.en?.bannerImage) {
              fetched.hero.en.bannerImage = DEFAULT_BANNER
              fetched.hero.vi.bannerImage = DEFAULT_BANNER
            }
            setContent(fetched)
          }
        }
      } catch (error) {
        console.error('Failed to fetch home content:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/content/home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      if (!res.ok) throw new Error('Failed to save')
      setMessage({ type: 'success', text: '✅ Đã lưu thành công!' })
    } catch {
      setMessage({ type: 'error', text: '❌ Lưu thất bại. Thử lại nhé.' })
    } finally {
      setSaving(false)
    }
  }

  const updateHero = (lang: 'en' | 'vi', field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [lang]: { ...prev.hero[lang], [field]: value },
      },
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const bannerUrl = content.hero.en.bannerImage || DEFAULT_BANNER

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Chỉnh sửa Trang Chủ</h1>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Đang lưu...' : 'Save'}
        </Button>
      </div>

      {/* Status message */}
      {message && (
        <div className={`mb-6 rounded-lg p-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <div className="space-y-6">

        {/* ===== BANNER IMAGE ===== */}
        <section className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">🖼️ Hình Banner</h2>

          {/* Preview */}
          <img
            src={bannerUrl}
            alt="Banner preview"
            className="w-full h-48 object-cover rounded-lg mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_BANNER
            }}
          />

          <label className="block text-sm font-medium text-slate-700 mb-1">
            URL hình banner
          </label>
          <input
            type="text"
            value={bannerUrl}
            onChange={(e) => {
              const url = e.target.value
              setContent(prev => ({
                ...prev,
                hero: {
                  ...prev.hero,
                  en: { ...prev.hero.en, bannerImage: url },
                  vi: { ...prev.hero.vi, bannerImage: url },
                }
              }))
            }}
            placeholder="https://..."
            className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
          />
          <p className="text-xs text-slate-500 mt-1">
            Paste URL ảnh từ internet. Để trống sẽ dùng ảnh mặc định.
          </p>
        </section>

        {/* ===== LANGUAGE TABS ===== */}
        <div className="flex gap-2">
          {(['en', 'vi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === lang
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {lang === 'en' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}
            </button>
          ))}
        </div>

        {/* ===== HERO CONTENT ===== */}
        <section className="bg-white rounded-lg border p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            🏠 Nội dung — {activeTab === 'en' ? 'English' : 'Tiếng Việt'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tên (Name)</label>
              <input
                type="text"
                value={content.hero[activeTab].name}
                onChange={(e) => updateHero(activeTab, 'name', e.target.value)}
                placeholder="Trần Thị Minh Trân"
                className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={content.hero[activeTab].tagline}
                onChange={(e) => updateHero(activeTab, 'tagline', e.target.value)}
                placeholder="Operations & Digital Transformation..."
                className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả (Description)</label>
              <textarea
                value={content.hero[activeTab].description}
                onChange={(e) => updateHero(activeTab, 'description', e.target.value)}
                rows={4}
                placeholder="Viết vài dòng giới thiệu..."
                className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        </section>

      </div>

      {/* Save Bottom */}
      <div className="flex justify-end mt-8 pt-6 border-t">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Đang lưu...' : 'Save'}
        </Button>
      </div>

    </div>
  )
}
