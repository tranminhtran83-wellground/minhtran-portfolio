'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

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

const defaultContent: HomeContent = {
  hero: {
    en: { name: 'Minh Tran', tagline: 'Head of Digital & Technology | Supply Chain', description: 'Welcome to my little garden — a quiet space where 20 years of supply chain experience meets curiosity about what comes next.' },
    vi: { name: 'Minh Tran', tagline: 'Trưởng phòng Công nghệ & Chuyển đổi số | Supply Chain', description: 'Chào mừng bạn đến khu vườn nhỏ — nơi 20 năm kinh nghiệm chuỗi cung ứng gặp gỡ sự tò mò về chương tiếp theo.' },
  },
  values: [
    {
      en: { title: 'Người giữ lửa bếp', description: 'Family is the center. Every career decision is filtered through one question: does this make our family stronger?' },
      vi: { title: 'Người giữ lửa bếp', description: 'Gia đình là trung tâm. Mọi quyết định nghề nghiệp đều qua một câu hỏi: điều này có giúp gia đình mình mạnh hơn?' },
    },
    {
      en: { title: 'Người dọn nhà', description: 'Order creates space for growth. Whether in supply chains or life, structure enables creativity.' },
      vi: { title: 'Người dọn nhà', description: 'Trật tự tạo không gian phát triển. Dù trong chuỗi cung ứng hay cuộc sống, cấu trúc nuôi dưỡng sáng tạo.' },
    },
    {
      en: { title: 'Người hay nghĩ', description: 'Reflection turns experience into wisdom. 20 years taught me that the best solutions come from deep thinking, not fast action.' },
      vi: { title: 'Người hay nghĩ', description: 'Suy ngẫm biến kinh nghiệm thành trí tuệ. 20 năm dạy tôi rằng giải pháp tốt nhất đến từ suy nghĩ sâu, không phải hành động nhanh.' },
    },
  ],
  origin: {
    en: { title: 'Where It All Began', act1: '', question: '', act3intro: '', closing: '' },
    vi: { title: 'Khởi Nguồn', act1: '', question: '', act3intro: '', closing: '' },
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
            setContent(data.content)
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

      setMessage({ type: 'success', text: 'Home page content saved successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  // Helper to update nested content
  const updateHero = (lang: 'en' | 'vi', field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        [lang]: { ...prev.hero[lang], [field]: value },
      },
    }))
  }

  const updateValue = (index: number, lang: 'en' | 'vi', field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      values: prev.values.map((v, i) =>
        i === index ? { ...v, [lang]: { ...v[lang], [field]: value } } : v
      ),
    }))
  }

  const updateOrigin = (lang: 'en' | 'vi', field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      origin: {
        ...prev.origin,
        [lang]: { ...prev.origin[lang], [field]: value },
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/dashboard">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Home Page</h1>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Status message */}
      {message && (
        <div className={`mb-6 rounded-lg p-4 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Language Tabs */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab('en')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'en' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🇺🇸 English
        </button>
        <button
          onClick={() => setActiveTab('vi')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'vi' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          🇻🇳 Tiếng Việt
        </button>
      </div>

      <div className="space-y-8">
        {/* ===== HERO SECTION ===== */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            🏠 Hero Section
          </h2>
// Tran them vao
{/* Banner Image */}
<div>
  <label className="block text-sm font-medium text-slate-700 mb-1">
    Hình Banner
  </label>
  {content.hero.en.bannerImage && (
    <img
      src={content.hero.en.bannerImage}
      alt="Banner preview"
      className="w-full h-32 object-cover rounded-lg mb-2"
    />
  )}
  <input
    type="text"
    value={content.hero.en.bannerImage || ''}
    onChange={(e) => setContent(prev => ({
      ...prev,
      hero: {
        ...prev.hero,
        en: { ...prev.hero.en, bannerImage: e.target.value },
        vi: { ...prev.hero.vi, bannerImage: e.target.value },
      }
    }))}
    placeholder="URL hình banner (https://...) hoặc /garden-hero.jpg"
    className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
  />
  <p className="text-xs text-slate-500 mt-1">
    Paste URL ảnh từ internet, hoặc để trống để dùng ảnh mặc định
  </p>
</div>
//End Tran them vao          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
              <input
                type="text"
                value={content.hero[activeTab].name}
                onChange={(e) => updateHero(activeTab, 'name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={content.hero[activeTab].tagline}
                onChange={(e) => updateHero(activeTab, 'tagline', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                value={content.hero[activeTab].description}
                onChange={(e) => updateHero(activeTab, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </section>

        {/* ===== VALUES SECTION ===== */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            💎 Core Values (3 Cards)
          </h2>
          <div className="space-y-6">
            {content.values.map((value, index) => (
              <div key={index} className="border rounded-lg p-4 bg-slate-50">
                <h3 className="text-sm font-medium text-slate-500 mb-3">Value {index + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={value[activeTab].title}
                      onChange={(e) => updateValue(index, activeTab, 'title', e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                    <textarea
                      value={value[activeTab].description}
                      onChange={(e) => updateValue(index, activeTab, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== ORIGIN STORY SECTION ===== */}
        <section className="bg-white rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            📖 Origin Story
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Section Title</label>
              <input
                type="text"
                value={content.origin[activeTab].title}
                onChange={(e) => updateOrigin(activeTab, 'title', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Act 1 — The Discovery</label>
              <textarea
                value={content.origin[activeTab].act1}
                onChange={(e) => updateOrigin(activeTab, 'act1', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="The opening story paragraph..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">The Big Question</label>
              <input
                type="text"
                value={content.origin[activeTab].question}
                onChange={(e) => updateOrigin(activeTab, 'question', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="The highlighted question..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Act 3 — Intro (before Family Values visual)</label>
              <textarea
                value={content.origin[activeTab].act3intro}
                onChange={(e) => updateOrigin(activeTab, 'act3intro', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="The answer paragraph before the values visual..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Closing</label>
              <textarea
                value={content.origin[activeTab].closing}
                onChange={(e) => updateOrigin(activeTab, 'closing', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="The closing paragraph after the values visual..."
              />
            </div>
          </div>
        </section>
      </div>

      {/* Floating Save Button (mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <Button onClick={handleSave} disabled={saving} className="gap-2 shadow-lg">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save
        </Button>
      </div>
    </div>
  )
}
