'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Check, Trash2, Loader2, MessageCircle, Reply } from 'lucide-react'
import Link from 'next/link'
import { toast, Toaster } from 'sonner'

interface Comment {
  id: string
  slug: string
  name: string
  email: string
  content: string
  status: 'pending' | 'approved'
  createdAt: number
  reply?: string
  repliedAt?: number
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending')
  const [replyText, setReplyText] = useState<Record<string, string>>({})
  const [showReply, setShowReply] = useState<Record<string, boolean>>({})
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => { fetchComments() }, [])

  async function fetchComments() {
    try {
      const res = await fetch('/api/admin/comments')
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch { toast.error('Không tải được comments') }
    finally { setLoading(false) }
  }

  async function handleApprove(comment: Comment) {
    setProcessing(comment.id)
    try {
      const res = await fetch(`/api/admin/comments/${comment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve', slug: comment.slug }),
      })
      if (!res.ok) throw new Error()
      setComments(prev => prev.map(c => c.id === comment.id ? { ...c, status: 'approved' } : c))
      toast.success('Đã duyệt comment!')
    } catch { toast.error('Có lỗi xảy ra') }
    finally { setProcessing(null) }
  }

  async function handleReply(comment: Comment) {
    const reply = replyText[comment.id]?.trim()
    if (!reply) { toast.error('Vui lòng nhập nội dung reply'); return }
    setProcessing(comment.id)
    try {
      const res = await fetch(`/api/admin/comments/${comment.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', reply, slug: comment.slug }),
      })
      if (!res.ok) throw new Error()
      setComments(prev => prev.map(c => c.id === comment.id
        ? { ...c, status: 'approved', reply, repliedAt: Date.now() } : c))
      setShowReply(prev => ({ ...prev, [comment.id]: false }))
      setReplyText(prev => ({ ...prev, [comment.id]: '' }))
      toast.success('Đã reply và gửi email cho người đọc!')
    } catch { toast.error('Có lỗi xảy ra') }
    finally { setProcessing(null) }
  }

  async function handleDelete(comment: Comment) {
    if (!confirm(`Xóa comment của ${comment.name}?`)) return
    setProcessing(comment.id)
    try {
      const res = await fetch(`/api/admin/comments/${comment.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: comment.slug }),
      })
      if (!res.ok) throw new Error()
      setComments(prev => prev.filter(c => c.id !== comment.id))
      toast.success('Đã xóa comment!')
    } catch { toast.error('Có lỗi xảy ra') }
    finally { setProcessing(null) }
  }

  const filtered = comments.filter(c => filter === 'all' ? true : c.status === filter)
  const pendingCount = comments.filter(c => c.status === 'pending').length

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Toaster position="top-right" richColors />

      <div className="mb-6">
        <Link href="/admin/dashboard">
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-primary-600" />
            Quản lý Comments
          </h1>
          {pendingCount > 0 && (
            <p className="text-amber-600 font-medium mt-1">⚠️ {pendingCount} comment đang chờ duyệt</p>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(['pending', 'approved', 'all'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}>
            {f === 'pending' ? `⏳ Chờ duyệt (${pendingCount})`
              : f === 'approved' ? `✅ Đã duyệt (${comments.filter(c => c.status === 'approved').length})`
              : `📋 Tất cả (${comments.length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-lg">
          <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Không có comment nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(comment => (
            <div key={comment.id} className={`bg-white border rounded-lg p-6 shadow-sm ${
              comment.status === 'pending' ? 'border-amber-200 bg-amber-50/30' : ''
            }`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="font-semibold text-slate-900">{comment.name}</span>
                  <span className="text-slate-500 text-sm ml-2">{comment.email}</span>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleString('vi-VN')}
                    </span>
                    <Link href={`/blog/${comment.slug}`} target="_blank"
                      className="text-xs text-primary-600 hover:underline">
                      📄 {comment.slug}
                    </Link>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      comment.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {comment.status === 'pending' ? '⏳ Chờ duyệt' : '✅ Đã duyệt'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {comment.status === 'pending' && (
                    <Button size="sm" onClick={() => handleApprove(comment)}
                      disabled={processing === comment.id}>
                      {processing === comment.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <><Check className="h-4 w-4 mr-1" />Duyệt</>}
                    </Button>
                  )}
                  <Button size="sm" variant="outline"
                    onClick={() => setShowReply(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}>
                    <Reply className="h-4 w-4 mr-1" />Reply
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(comment)}
                    disabled={processing === comment.id}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <p className="text-slate-700 whitespace-pre-wrap bg-slate-50 rounded-lg p-4">
                {comment.content}
              </p>

              {/* Existing reply */}
              {comment.reply && (
                <div className="mt-3 ml-4 pl-4 border-l-2 border-primary-300">
                  <p className="text-xs font-medium text-primary-600 mb-1">
                    Reply của Minh Tran • {comment.repliedAt ? new Date(comment.repliedAt).toLocaleString('vi-VN') : ''}
                  </p>
                  <p className="text-slate-700 whitespace-pre-wrap text-sm">{comment.reply}</p>
                </div>
              )}

              {/* Reply form */}
              {showReply[comment.id] && (
                <div className="mt-4 space-y-3">
                  <textarea
                    value={replyText[comment.id] || ''}
                    onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                    rows={4}
                    placeholder="Viết reply của bạn..."
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ resize: 'vertical' }}
                  />
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline"
                      onClick={() => setShowReply(prev => ({ ...prev, [comment.id]: false }))}>
                      Hủy
                    </Button>
                    <Button size="sm" onClick={() => handleReply(comment)}
                      disabled={processing === comment.id}>
                      {processing === comment.id
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : '📧 Gửi reply & email'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
