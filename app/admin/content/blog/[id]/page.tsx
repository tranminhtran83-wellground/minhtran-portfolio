'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Save, Loader2, Sparkles, X, Plus, Clock, ExternalLink, RotateCcw } from 'lucide-react'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'
import { StatusToggle } from '@/components/admin/StatusToggle'

interface BlogPostData {
  id?: string
  slug: string
  status: 'draft' | 'published'
  en: { title: string; excerpt: string; content: string }
  vi: { title: string; excerpt: string; content: string }
  category: string
  tags: string[]
  featuredImage?: string
  readTime?: number
  featured: boolean
  source?: { rawDraft: string; detectedLanguage: 'en' | 'vi' }
}

const emptyPost: BlogPostData = {
  slug: '',
  status: 'draft',
  featured: false,
  en: { title: '', excerpt: '', content: '' },
  vi: { title: '', excerpt: '', content: '' },
  category: 'Uncategorized',
  tags: [],
}

const inputClass = 'w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm text-left'

export default function BlogEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNew = params.id === 'new'

  const [activeTab, setActiveTab] = useState<'en' | 'vi'>('en')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [showPolishFlow, setShowPolishFlow] = useState(isNew)
  const [rawDraft, setRawDraft] = useState('')
  const [polishing, setPolishing] = useState(false)
  const [formData, setFormData] = useState<BlogPostData>(emptyPost)
  const [sourceInfo, setSourceInfo] = useState<{ rawDraft: string; detectedLanguage: 'en' | 'vi' } | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [categories, setCategories] = useState<string[]>([])
  const [newCategoryInput, setNewCategoryInput] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)

  useEffect(() => {
    if (!isNew) fetchPost()
    fetchCategories()
  }, [params.id])

  async function fetchPost() {
    try {
      const res = await fetch(`/api/admin/content/blog/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setFormData(data)
      setSourceInfo(data.source || null)
      setShowPolishFlow(false)
    } catch {
      toast.error('Không tìm thấy bài viết')
      router.push('/admin/content/blog')
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/admin/content/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || [])
      }
    } catch {}
  }

  async function handlePolishDraft() {
    if (!rawDraft.trim()) { toast.error('Vui lòng nhập nội dung draft'); return }
    setPolishing(true)
    try {
      const res = await fetch('/api/admin/content/blog/polish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawDraft: rawDraft.trim() }),
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.message || 'Failed') }
      const result = await res.json()
      setFormData({
        slug: '', status: 'draft', featured: false,
        en: { title: result.polishedData.en.title, excerpt: result.polishedData.en.excerpt, content: result.polishedData.en.content },
        vi: { title: result.polishedData.vi.title, excerpt: result.polishedData.vi.excerpt, content: result.polishedData.vi.content },
        category: result.polishedData.en.category || 'Uncategorized',
        tags: result.polishedData.en.tags || [],
        source: result.source,
      })
      setSourceInfo(result.source)
      setShowPolishFlow(false)
      toast.success('Draft đã được polish!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to polish')
    } finally {
      setPolishing(false)
    }
  }

  async function handleRegenerate() {
    if (!sourceInfo?.rawDraft) { toast.error('Không có source content'); return }
    setPolishing(true)
    try {
      const res = await fetch('/api/admin/content/blog/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawDraft: sourceInfo.rawDraft }),
      })
      if (!res.ok) throw new Error('Failed')
      const result = await res.json()
      setFormData(prev => ({
        ...prev,
        en: { title: result.polishedData.en.title, excerpt: result.polishedData.en.excerpt, content: result.polishedData.en.content },
        vi: { title: result.polishedData.vi.title, excerpt: result.polishedData.vi.excerpt, content: result.polishedData.vi.content },
        category: result.polishedData.en.category || prev.category,
        tags: result.polishedData.en.tags || prev.tags,
      }))
      toast.success('Đã regenerate!')
    } catch {
      toast.error('Failed to regenerate')
    } finally {
      setPolishing(false)
    }
  }

  async function handleAddCategory() {
    const newCat = newCategoryInput.trim()
    if (!newCat) return
    try {
      const res = await fetch('/api/admin/content/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: newCat }),
      })
      if (!res.ok) throw new Error()
      setCategories(prev => [...prev, newCat])
      setFormData(prev => ({ ...prev, category: newCat }))
      setNewCategoryInput('')
      setShowNewCategory(false)
      toast.success('Đã thêm category!')
    } catch {
      toast.error('Failed to add category')
    }
  }

  function addTag() {
    if (!tagInput.trim()) return
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-')
    if (formData.tags.includes(tag)) { toast.error('Tag đã tồn tại'); return }
    setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }))
    setTagInput('')
  }

  async function handleSave() {
    if (!formData.en?.title || !formData.en?.excerpt) {
      toast.error('Vui lòng điền tiêu đề và tóm tắt tiếng Anh')
      return
    }
    setSaving(true)
    try {
      const url = isNew ? '/api/admin/content/blog' : `/api/admin/content/blog/${params.id}`
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const e = await res.json().catch(() => ({}))
        throw new Error(e.error || `Lỗi ${res.status}`)
      }
      const result = await res.json()
      toast.success('Đã lưu bài viết!')
      if (isNew && result.post?.id) router.push(`/admin/content/blog/${result.post.id}`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>

  // ── Polish Flow ──────────────────────────────────────────
  if (showPolishFlow && isNew) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Toaster position="top-right" richColors />
        <div className="mb-8 flex items-center gap-4">
          <Link href="/admin/content/blog"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tạo bài viết mới</h1>
            <p className="text-sm text-slate-600 mt-1">Polish draft với AI hoặc tạo thủ công</p>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="h-6 w-6 text-primary-600" />
            <h2 className="text-xl font-semibold">AI Blog Polisher</h2>
          </div>
          <p className="text-slate-600 mb-6">
            Paste nội dung draft của bạn vào đây. AI sẽ polish, tạo tiêu đề, tóm tắt, tags và dịch sang cả 2 ngôn ngữ.
          </p>
          <textarea
            value={rawDraft}
            onChange={(e) => setRawDraft(e.target.value)}
            placeholder="Paste nội dung draft ở đây (tiếng Anh hoặc tiếng Việt)..."
            rows={15}
            className="w-full border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-6"
          />
          <div className="flex gap-3">
            <Button onClick={handlePolishDraft} disabled={polishing || !rawDraft.trim()} className="flex-1">
              {polishing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Đang polish...</> : <><Sparkles className="mr-2 h-5 w-5" />Polish with AI</>}
            </Button>
            <Button variant="outline" onClick={() => { setShowPolishFlow(false); setFormData(emptyPost) }}>
              Skip & Tạo thủ công
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // ── Editor ───────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/content/blog"><Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <h1 className="text-3xl font-bold text-slate-900">{isNew ? 'Tạo bài viết' : 'Chỉnh sửa bài viết'}</h1>
        </div>
        <div className="flex gap-3">
          {formData.slug && formData.status === 'published' && (
            <Button variant="outline" asChild>
              <Link href={`/blog/${formData.slug}`} target="_blank"><ExternalLink className="mr-2 h-4 w-4" />Preview</Link>
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang lưu...</> : <><Save className="mr-2 h-4 w-4" />Save</>}
          </Button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Cài đặt</h2>
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">Trạng thái</span>
            <select value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value as 'draft' | 'published' }))}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm">
              <option value="draft">Draft (Nháp)</option>
              <option value="published">Published (Công khai)</option>
            </select>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData(p => ({ ...p, featured: e.target.checked }))} className="w-4 h-4 rounded" />
            <span className="text-sm font-medium text-slate-700">⭐ Featured</span>
          </label>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="border-b mb-6">
        <div className="flex">
          {(['en', 'vi'] as const).map((lang) => (
            <button key={lang} onClick={() => setActiveTab(lang)}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === lang ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}>
              {lang === 'en' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}
            </button>
          ))}
        </div>
      </div>

      {/* Bilingual Content */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm space-y-5">
        <h2 className="text-base font-semibold text-slate-900">
          Nội dung — {activeTab === 'en' ? 'English' : 'Tiếng Việt'}
        </h2>

        <div>
          <label className="text-xs font-medium text-slate-500 uppercase block mb-1">
            {activeTab === 'en' ? 'Title *' : 'Tiêu đề'}
          </label>
          <input type="text"
            value={formData[activeTab]?.title || ''}
            onChange={(e) => setFormData(p => ({ ...p, [activeTab]: { ...p[activeTab], title: e.target.value } }))}
            placeholder={activeTab === 'en' ? 'Blog post title' : 'Tiêu đề bài viết'}
            className={inputClass} />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 uppercase block mb-1">
            {activeTab === 'en' ? 'Excerpt * (short summary)' : 'Tóm tắt ngắn'}
          </label>
          <textarea
            value={formData[activeTab]?.excerpt || ''}
            onChange={(e) => setFormData(p => ({ ...p, [activeTab]: { ...p[activeTab], excerpt: e.target.value } }))}
            rows={3} placeholder={activeTab === 'en' ? 'A short summary (2-3 sentences)' : 'Tóm tắt ngắn (2-3 câu)'}
            className={inputClass} style={{ resize: 'vertical' }} />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 uppercase block mb-1">
            {activeTab === 'en' ? 'Content' : 'Nội dung chi tiết'}
          </label>
          <p className="text-xs text-slate-400 mb-2">Nhấn Enter để xuống dòng. Nội dung hiển thị đúng như bạn gõ.</p>
          <textarea
            value={formData[activeTab]?.content || ''}
            onChange={(e) => setFormData(p => ({ ...p, [activeTab]: { ...p[activeTab], content: e.target.value } }))}
            rows={16} placeholder={activeTab === 'en' ? 'Write your blog content here...' : 'Viết nội dung bài viết ở đây...'}
            className={`${inputClass} font-mono`} style={{ resize: 'vertical', whiteSpace: 'pre-wrap' }} />
        </div>
      </div>

      {/* Category & Tags */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Category & Tags</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase block mb-2">Category</label>
            {showNewCategory ? (
              <div className="space-y-2">
                <input type="text" value={newCategoryInput} onChange={(e) => setNewCategoryInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder="Tên category mới" className={inputClass} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleAddCategory} className="flex-1">Thêm</Button>
                  <Button size="sm" variant="outline" onClick={() => { setShowNewCategory(false); setNewCategoryInput('') }}>Hủy</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))}
                  className={inputClass}>
                  <option value="">Chọn category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <Button size="sm" variant="outline" onClick={() => setShowNewCategory(true)} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />Tạo category mới
                </Button>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 uppercase block mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Thêm tag, nhấn Enter" className={inputClass} />
              <Button size="sm" onClick={addTag}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  #{tag}
                  <button onClick={() => setFormData(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }))}><X className="h-3 w-3" /></button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Regenerate (nếu có source) */}
      {sourceInfo && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <h3 className="text-base font-semibold mb-2">AI Content</h3>
          <p className="text-sm text-slate-600 mb-4">Bài viết này được tạo từ AI. Bạn có thể regenerate bất cứ lúc nào.</p>
          <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={polishing}>
            {polishing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang regenerate...</> : <><RotateCcw className="mr-2 h-4 w-4" />Regenerate với AI</>}
          </Button>
        </div>
      )}

      {/* Save Bottom */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={() => router.push('/admin/content/blog')}>Hủy</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang lưu...</> : <><Save className="mr-2 h-4 w-4" />{formData.status === 'published' ? 'Save & Publish' : 'Save Draft'}</>}
        </Button>
      </div>
    </div>
  )
}
