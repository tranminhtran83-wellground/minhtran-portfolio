'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Save, Loader2, Eye, Trash2, Plus } from 'lucide-react'
import type { AboutContent } from '@/lib/contentManager'
import { generateId } from '@/lib/contentManager'
import { toast, Toaster } from 'sonner'

const emptyAboutData: AboutContent = {
  id: 'about',
  version: '1.0.0',
  updatedAt: Date.now(),
  updatedBy: 'admin',
  cv: undefined,
  hero: {
    en: { name: '', role: '', intro: '', photo: '' },
    vi: { name: '', role: '', intro: '', photo: '' },
  },
  professionalJourney: { en: [], vi: [] },
  educationExpertise: {
    education: { en: [], vi: [] },
    currentFocus: { en: [], vi: [] },
  },
  training: { en: [], vi: [] },
  competencies: { en: [], vi: [] },
  interests: {
    en: { bio: '', hobbies: '' },
    vi: { bio: '', hobbies: '' },
  },
  embeddings: { generated: false },
}

export default function AboutEditorPage() {
  const [activeTab, setActiveTab] = useState<'en' | 'vi'>('en')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState<AboutContent>(emptyAboutData)

  useEffect(() => {
    fetchAboutData()
  }, [])

  async function fetchAboutData() {
    try {
      const res = await fetch('/api/admin/content/about')
      if (res.ok) {
        const data = await res.json()
        // Merge với emptyAboutData để đảm bảo không thiếu field nào
        setFormData({ ...emptyAboutData, ...data })
      }
      // Nếu lỗi (database trống) thì dùng emptyAboutData — không báo lỗi
    } catch {
      // Giữ emptyAboutData
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!formData.hero.en.name) {
      toast.error('Vui lòng điền tên (Name) ở tab English')
      return
    }
    setSaving(true)
    try {
      const response = await fetch('/api/admin/content/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, updatedAt: Date.now() }),
      })
      if (!response.ok) throw new Error(`Lỗi: ${response.status}`)
      toast.success('Đã lưu trang About!')
    } catch (err) {
      toast.error('Lưu thất bại: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
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
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Chỉnh sửa trang About</h1>
          <p className="text-slate-600 mt-1">Điền nội dung trực tiếp, nhấn Save khi xong</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => window.open('/about', '_blank')} variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang lưu...</> : <><Save className="mr-2 h-4 w-4" />Save</>}
          </Button>
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

      <div className="space-y-8">

        {/* Hero Section */}
        <Section title="Giới thiệu (Hero)">
          <Field label="Tên">
            <input type="text" value={formData.hero[activeTab].name}
              onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, [activeTab]: { ...formData.hero[activeTab], name: e.target.value } } })}
              placeholder="Tran Thi Minh Tran" className={inputClass} />
          </Field>
          <Field label="Chức danh (Role)">
            <input type="text" value={formData.hero[activeTab].role}
              onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, [activeTab]: { ...formData.hero[activeTab], role: e.target.value } } })}
              placeholder="Operations & Digital Transformation" className={inputClass} />
          </Field>
          <Field label="Giới thiệu ngắn (Intro)">
            <textarea value={formData.hero[activeTab].intro} rows={8}
              onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, [activeTab]: { ...formData.hero[activeTab], intro: e.target.value } } })}
              placeholder="Viết vài dòng giới thiệu bản thân..." className={inputClass} />
          </Field>
          <Field label="URL ảnh đại diện (Photo URL) — để trống nếu chưa có">
            <input type="text" value={formData.hero[activeTab].photo || ''}
              onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, en: { ...formData.hero.en, photo: e.target.value }, vi: { ...formData.hero.vi, photo: e.target.value } } })}
              placeholder="https://..." className={inputClass} />
          </Field>
        </Section>

        {/* Professional Journey */}
        <Section title={`Hành trình nghề nghiệp (${formData.professionalJourney[activeTab].length} vị trí)`}>
          <div className="space-y-3">
            {formData.professionalJourney[activeTab].map((job, idx) => (
              <div key={job.id} className="bg-slate-50 rounded-lg p-4 relative">
                <button onClick={() => {
                  const newJobs = formData.professionalJourney[activeTab].filter((_, i) => i !== idx)
                  setFormData({ ...formData, professionalJourney: { ...formData.professionalJourney, [activeTab]: newJobs } })
                }} className="absolute top-3 right-3 text-red-500 hover:text-red-700"><Trash2 className="h-4 w-4" /></button>
                <div className="grid grid-cols-3 gap-3 pr-8">
                  <input type="text" value={job.year} placeholder="Năm (vd: 2020-2024)"
                    onChange={(e) => { const j = [...formData.professionalJourney[activeTab]]; j[idx] = { ...j[idx], year: e.target.value }; setFormData({ ...formData, professionalJourney: { ...formData.professionalJourney, [activeTab]: j } }) }}
                    className={inputClass} />
                  <input type="text" value={job.title} placeholder="Chức danh"
                    onChange={(e) => { const j = [...formData.professionalJourney[activeTab]]; j[idx] = { ...j[idx], title: e.target.value }; setFormData({ ...formData, professionalJourney: { ...formData.professionalJourney, [activeTab]: j } }) }}
                    className={inputClass} />
                  <input type="text" value={job.company} placeholder="Công ty"
                    onChange={(e) => { const j = [...formData.professionalJourney[activeTab]]; j[idx] = { ...j[idx], company: e.target.value }; setFormData({ ...formData, professionalJourney: { ...formData.professionalJourney, [activeTab]: j } }) }}
                    className={inputClass} />
                </div>
                <textarea value={job.description} placeholder="Mô tả công việc..." rows={2}
                  onChange={(e) => { const j = [...formData.professionalJourney[activeTab]]; j[idx] = { ...j[idx], description: e.target.value }; setFormData({ ...formData, professionalJourney: { ...formData.professionalJourney, [activeTab]: j } }) }}
                  className={`${inputClass} mt-3`} />
              </div>
            ))}
            <AddButton onClick={() => setFormData({ ...formData, professionalJourney: { ...formData.professionalJourney, [activeTab]: [...formData.professionalJourney[activeTab], { id: generateId(), year: '', title: '', company: '', description: '' }] } })} label="Thêm vị trí" />
          </div>
        </Section>

        {/* Education */}
        <Section title="Học vấn & Định hướng hiện tại">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">Học vấn</p>
              <div className="space-y-2">
                {formData.educationExpertise.education[activeTab].map((edu, idx) => (
                  <div key={edu.id} className="bg-slate-50 rounded p-3 relative">
                    <button onClick={() => { const e2 = formData.educationExpertise.education[activeTab].filter((_, i) => i !== idx); setFormData({ ...formData, educationExpertise: { ...formData.educationExpertise, education: { ...formData.educationExpertise.education, [activeTab]: e2 } } }) }} className="absolute top-2 right-2 text-red-500"><Trash2 className="h-3 w-3" /></button>
                    <input type="text" value={edu.degree} placeholder="Bằng cấp" className={`${inputClass} mb-2`}
                      onChange={(e) => { const e2 = [...formData.educationExpertise.education[activeTab]]; e2[idx] = { ...e2[idx], degree: e.target.value }; setFormData({ ...formData, educationExpertise: { ...formData.educationExpertise, education: { ...formData.educationExpertise.education, [activeTab]: e2 } } }) }} />
                    <input type="text" value={edu.detail} placeholder="Chi tiết (trường, năm...)" className={inputClass}
                      onChange={(e) => { const e2 = [...formData.educationExpertise.education[activeTab]]; e2[idx] = { ...e2[idx], detail: e.target.value }; setFormData({ ...formData, educationExpertise: { ...formData.educationExpertise, education: { ...formData.educationExpertise.education, [activeTab]: e2 } } }) }} />
                  </div>
                ))}
                <AddButton onClick={() => setFormData({ ...formData, educationExpertise: { ...formData.educationExpertise, education: { ...formData.educationExpertise.education, [activeTab]: [...formData.educationExpertise.education[activeTab], { id: generateId(), degree: '', detail: '' }] } } })} label="Thêm học vấn" small />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-2">Định hướng hiện tại</p>
              <div className="space-y-2">
                {formData.educationExpertise.currentFocus[activeTab].map((f, idx) => (
                  <div key={f.id} className="bg-slate-50 rounded p-3 relative">
                    <button onClick={() => { const f2 = formData.educationExpertise.currentFocus[activeTab].filter((_, i) => i !== idx); setFormData({ ...formData, educationExpertise: { ...formData.educationExpertise, currentFocus: { ...formData.educationExpertise.currentFocus, [activeTab]: f2 } } }) }} className="absolute top-2 right-2 text-red-500"><Trash2 className="h-3 w-3" /></button>
                    <input type="text" value={f.focus} placeholder="vd: AI & Machine Learning" className={inputClass}
                      onChange={(e) => { const f2 = [...formData.educationExpertise.currentFocus[activeTab]]; f2[idx] = { ...f2[idx], focus: e.target.value }; setFormData({ ...formData, educationExpertise: { ...formData.educationExpertise, currentFocus: { ...formData.educationExpertise.currentFocus, [activeTab]: f2 } } }) }} />
                  </div>
                ))}
                <AddButton onClick={() => setFormData({ ...formData, educationExpertise: { ...formData.educationExpertise, currentFocus: { ...formData.educationExpertise.currentFocus, [activeTab]: [...formData.educationExpertise.currentFocus[activeTab], { id: generateId(), focus: '' }] } } })} label="Thêm định hướng" small />
              </div>
            </div>
          </div>
        </Section>
        {/* Training & Development */}
        <Section title={`Đào tạo & Phát triển (${formData.training[activeTab].length} khóa)`}>
          <div className="space-y-3">
            {formData.training[activeTab].map((tr, idx) => (
              <div key={tr.id} className="bg-slate-50 rounded-lg p-4 relative">
                <button onClick={() => {
                  const t2 = formData.training[activeTab].filter((_, i) => i !== idx)
                  setFormData({ ...formData, training: { ...formData.training, [activeTab]: t2 } })
                }} className="absolute top-3 right-3 text-red-500 hover:text-red-700">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-3 gap-3 pr-8">
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Tên khóa học</label>
                    <input type="text" value={tr.name} placeholder="vd: SAP SD Module"
                      onChange={(e) => { const t2 = [...formData.training[activeTab]]; t2[idx] = { ...t2[idx], name: e.target.value }; setFormData({ ...formData, training: { ...formData.training, [activeTab]: t2 } }) }}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Tổ chức cấp</label>
                    <input type="text" value={tr.issuer} placeholder="vd: Unilever"
                      onChange={(e) => { const t2 = [...formData.training[activeTab]]; t2[idx] = { ...t2[idx], issuer: e.target.value }; setFormData({ ...formData, training: { ...formData.training, [activeTab]: t2 } }) }}
                      className={inputClass} />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 block mb-1">Năm (tùy chọn)</label>
                    <input type="text" value={tr.year || ''} placeholder="vd: 2023"
                      onChange={(e) => { const t2 = [...formData.training[activeTab]]; t2[idx] = { ...t2[idx], year: e.target.value }; setFormData({ ...formData, training: { ...formData.training, [activeTab]: t2 } }) }}
                      className={inputClass} />
                  </div>
                </div>
              </div>
            ))}
            <AddButton onClick={() => setFormData({ ...formData, training: { ...formData.training, [activeTab]: [...formData.training[activeTab], { id: generateId(), name: '', issuer: '', year: '' }] } })} label="Thêm khóa đào tạo" />
          </div>
        </Section>

        {/* Competencies */}

        {/* Competencies */}
        <Section title={`Năng lực cốt lõi (${formData.competencies[activeTab].length})`}>
          <div className="grid grid-cols-3 gap-2">
            {formData.competencies[activeTab].map((comp, idx) => (
              <div key={comp.id} className="bg-slate-50 rounded p-2 relative flex items-center gap-2">
                <span className="text-green-600 text-sm">✓</span>
                <input type="text" value={comp.competency} placeholder="vd: Leadership" className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded"
                  onChange={(e) => { const c = [...formData.competencies[activeTab]]; c[idx] = { ...c[idx], competency: e.target.value }; setFormData({ ...formData, competencies: { ...formData.competencies, [activeTab]: c } }) }} />
                <button onClick={() => { const c = formData.competencies[activeTab].filter((_, i) => i !== idx); setFormData({ ...formData, competencies: { ...formData.competencies, [activeTab]: c } }) }} className="text-red-500"><Trash2 className="h-3 w-3" /></button>
              </div>
            ))}
          </div>
          <AddButton onClick={() => setFormData({ ...formData, competencies: { ...formData.competencies, [activeTab]: [...formData.competencies[activeTab], { id: generateId(), competency: '' }] } })} label="Thêm năng lực" />
        </Section>

        {/* Interests */}
        <Section title="Ngoài công việc">
          <Field label="Bio ngắn">
            <textarea value={formData.interests[activeTab].bio} rows={3} placeholder="Sinh ngày... Sống tại..."
              onChange={(e) => setFormData({ ...formData, interests: { ...formData.interests, [activeTab]: { ...formData.interests[activeTab], bio: e.target.value } } })}
              className={inputClass} />
          </Field>
          <Field label="Sở thích">
            <textarea value={formData.interests[activeTab].hobbies} rows={2} placeholder="Chạy bộ, du lịch, đọc sách..."
              onChange={(e) => setFormData({ ...formData, interests: { ...formData.interests, [activeTab]: { ...formData.interests[activeTab], hobbies: e.target.value } } })}
              className={inputClass} />
          </Field>
        </Section>

      </div>

      {/* Save Bottom */}
      <div className="flex justify-end gap-4 mt-8 pt-8 border-t">
        <Button onClick={() => window.open('/about', '_blank')} variant="outline">
          <Eye className="mr-2 h-4 w-4" />Preview
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Đang lưu...</> : <><Save className="mr-2 h-4 w-4" />Save About Page</>}
        </Button>
      </div>
    </div>
  )
}

// Helper components
const inputClass = 'w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4 text-slate-900">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-slate-500 uppercase block mb-1">{label}</label>
      {children}
    </div>
  )
}

function AddButton({ onClick, label, small }: { onClick: () => void; label: string; small?: boolean }) {
  return (
    <button onClick={onClick}
      className={`w-full border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-colors flex items-center justify-center gap-2 font-medium ${small ? 'py-2 text-sm' : 'py-3'}`}>
      <Plus className={small ? 'h-3 w-3' : 'h-4 w-4'} />{label}
    </button>
  )
}
