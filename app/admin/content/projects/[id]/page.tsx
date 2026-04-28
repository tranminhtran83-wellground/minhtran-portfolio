'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Save, Loader2, Eye, ArrowLeft, Plus, X } from 'lucide-react'
import { toast, Toaster } from 'sonner'
import type { Project } from '@/lib/contentManager'
import { generateSlug } from '@/lib/utils'

const emptyProject: Partial<Project> = {
  status: 'draft',
  featured: false,
  en: { title: '', description: '', content: '' },
  vi: { title: '', description: '', content: '' },
  techStack: [],
  learnings: [],
  screenshots: [],
}

export default function ProjectEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNew = params.id === 'new'

  const [activeTab, setActiveTab] = useState<'en' | 'vi'>('en')
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Project>>(emptyProject)
  const [techInput, setTechInput] = useState('')
  const [learningInput, setLearningInput] = useState('')

  useEffect(() => {
    if (!isNew) fetchProject()
  }, [params.id])

  async function fetchProject() {
    try {
      const res = await fetch(`/api/admin/content/projects/${params.id}`)
      if (!res.ok) throw new Error('Not found')
      const data = await res.json()
      setFormData(data.project || data)
    } catch {
      toast.error('Không tìm thấy project')
      router.push('/admin/content/projects')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!formData.en?.title) {
      toast.error('Vui lòng điền tiêu đề tiếng Anh')
      return
    }
    if (!formData.vi?.title) {
      toast.error('Vui lòng điền tiêu đề tiếng Việt')
      return
    }

    setSaving(true)
    try {
      // Auto-generate slug from EN title if new
      const dataToSave = isNew
        ? { ...formData, slug: generateSlug(formData.en?.title || '') }
        : formData

      const url = isNew
        ? '/api/admin/content/projects'
        : `/api/admin/content/projects/${params.id}`

      const response = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `Lỗi ${response.status}`)
      }

      const result = await response.json()
      toast.success('Đã lưu project!')

      if (isNew && result.project?.id) {
        router.push(`/admin/content/projects/${result.project.id}`)
      }
    } catch (err) {
      toast.error('Lưu thất bại: ' + (err instanceof Error ? err.message : 'Unknown'))
    } finally {
      setSaving(false)
    }
  }

  function updateLang(field: 'title' | 'description' | 'content', value: string) {
    setFormData({
      ...formData,
      [activeTab]: { ...formData[activeTab], [field]: value },
    })
  }

  function addTech() {
    if (!techInput.trim()) return
    setFormData({ ...formData, techStack: [...(formData.techStack || []), techInput.trim()] })
    setTechInput('')
  }

  function addLearning() {
    if (!learningInput.trim()) return
    setFormData({ ...formData, learnings: [...(formData.learnings || []), learningInput.trim()] })
    setLearningInput('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm text-left'

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.push('/admin/content/projects')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isNew ? 'Tạo Project mới' : 'Chỉnh sửa Project'}
            </h1>
            <p className="text-slate-600 mt-1">Điền nội dung trực tiếp, nhấn Save khi xong</p>
          </div>
        </div>
        <div className="flex gap-3">
          {formData.slug && formData.status === 'published' && (
            <Button variant="outline" onClick={() => window.open(`/projects/${formData.slug}`, '_blank')}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
          )}
          <Button onClick={handleSave} disabled={saving}>
            {saving
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang lưu...</>
              : <><Save className="mr-2 h-4 w-4" />{formData.status === 'published' ? 'Save & Publish' : 'Save Draft'}</>
            }
          </Button>
        </div>
      </div>

      {/* Status & Featured */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Cài đặt</h2>
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-sm font-medium text-slate-700">Trạng thái</span>
            <select
              value={formData.status || 'draft'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
            >
              <option value="draft">Draft (Nháp)</option>
              <option value="published">Published (Công khai)</option>
            </select>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.featured || false}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300"
            />
            <span className="text-sm font-medium text-slate-700">⭐ Featured (Nổi bật)</span>
          </label>
        </div>
      </div>

      {/* Language Tabs */}
      <div className="border-b mb-6">
        <div className="flex">
          {(['en', 'vi'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveTab(lang)}
              className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                activeTab === lang
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
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
          <label className="text-xs font-medium text-slate-500 uppercase block mb-1">Tiêu đề *</label>
          <input
            type="text"
            value={formData[activeTab]?.title || ''}
            onChange={(e) => updateLang('title', e.target.value)}
            placeholder={activeTab === 'en' ? 'Project title' : 'Tên dự án'}
            className={inputClass}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 uppercase block mb-1">
            Mô tả ngắn *
          </label>
          <textarea
            value={formData[activeTab]?.description || ''}
            onChange={(e) => updateLang('description', e.target.value)}
            rows={3}
            placeholder={activeTab === 'en' ? 'Short project summary...' : 'Tóm tắt ngắn về dự án...'}
            className={inputClass}
            style={{ resize: 'vertical' }}
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-500 uppercase block mb-1">
            Nội dung chi tiết
          </label>
          <p className="text-xs text-slate-400 mb-2">Nhấn Enter để xuống dòng. Nội dung sẽ hiển thị đúng như bạn gõ.</p>
          <textarea
            value={formData[activeTab]?.content || ''}
            onChange={(e) => updateLang('content', e.target.value)}
            rows={12}
            placeholder={activeTab === 'en'
              ? 'Write detailed project description here...\n\nYou can use multiple paragraphs.'
              : 'Viết mô tả chi tiết dự án ở đây...\n\nBạn có thể xuống dòng thoải mái.'}
            className={`${inputClass} font-mono`}
            style={{ resize: 'vertical', whiteSpace: 'pre-wrap' }}
          />
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Tech Stack</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }}
            placeholder="vd: Next.js, TypeScript, Tailwind"
            className={inputClass}
          />
          <Button onClick={addTech} type="button"><Plus className="h-4 w-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.techStack?.map((tech, i) => (
            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2">
              {tech}
              <button onClick={() => setFormData({ ...formData, techStack: formData.techStack?.filter((_, j) => j !== i) })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Key Learnings */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-1">Key Learnings</h2>
        <p className="text-xs text-slate-500 mb-4">Hiển thị cho cả EN và VI</p>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={learningInput}
            onChange={(e) => setLearningInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addLearning() } }}
            placeholder="Thêm bài học / takeaway..."
            className={inputClass}
          />
          <Button onClick={addLearning} type="button"><Plus className="h-4 w-4" /></Button>
        </div>
        <div className="space-y-2">
          {formData.learnings?.map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-700 flex-1">{item}</p>
              <button onClick={() => setFormData({ ...formData, learnings: formData.learnings?.filter((_, j) => j !== i) })}
                className="text-slate-400 hover:text-red-600 ml-2">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900 mb-4">Links (tùy chọn)</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase block mb-1">GitHub URL</label>
            <input type="url" value={formData.githubUrl || ''}
              onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
              placeholder="https://github.com/..." className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase block mb-1">Demo URL</label>
            <input type="url" value={formData.demoUrl || ''}
              onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
              placeholder="https://..." className={inputClass} />
          </div>
        </div>
      </div>

      {/* Save Bottom */}
      <div className="flex justify-end gap-4 pt-4 border-t">
        <Button variant="outline" onClick={() => router.push('/admin/content/projects')}>
          Hủy
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang lưu...</>
            : <><Save className="mr-2 h-4 w-4" />{formData.status === 'published' ? 'Save & Publish' : 'Save Draft'}</>
          }
        </Button>
      </div>
    </div>
  )
}
