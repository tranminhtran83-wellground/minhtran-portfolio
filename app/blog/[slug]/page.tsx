'use client'

import { useState, useEffect } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import type { BlogPost } from '@/lib/contentManager'
import { Loader2, ArrowLeft, Calendar, Clock, Tag, BookOpen } from 'lucide-react'
import { marked } from 'marked'

// Configure marked for better parsing
marked.setOptions({
  breaks: true,
  gfm: true,
})

// Helper function to convert content to HTML
function contentToHTML(content: string): string {
  if (!content) return ''

  try {
    // Strip any wrapping HTML tags (AI parser sometimes wraps content in <p> tags)
    let cleanContent = content

    // Remove opening and closing <p> tags if they wrap the entire content
    if (cleanContent.startsWith('<p>') && cleanContent.endsWith('</p>')) {
      cleanContent = cleanContent.slice(3, -4)
    }

    // Also remove any stray <p> or </p> tags
    cleanContent = cleanContent.replace(/<\/?p>/g, '')

    // Parse markdown to HTML
    const html = marked.parse(cleanContent) as string

    return html
  } catch (error) {
    console.error('Markdown parsing error:', error)
    return content
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const { language } = useLanguage()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notFoundError, setNotFoundError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch current post
        const postRes = await fetch(`/api/content/blog/${params.slug}`)
        if (!postRes.ok) {
          setNotFoundError(true)
          return
        }
        const postData = await postRes.json()
        setPost(postData)

        // Fetch all posts for related section
        const allPostsRes = await fetch('/api/content/blog')
        if (allPostsRes.ok) {
          const allPostsData = await allPostsRes.json()

          // Find related posts (same category or shared tags, excluding current)
          const related = (allPostsData.posts || [])
            .filter((p: BlogPost) => {
              if (p.slug === params.slug) return false

              // Match by category
              if (p.category && postData.category && p.category === postData.category) {
                return true
              }

              // Match by tags
              if (p.tags && postData.tags) {
                return p.tags.some(tag => postData.tags.includes(tag))
              }

              return false
            })
            .slice(0, 3)

          setRelatedPosts(related)
        }
      } catch (error) {
        console.error('Failed to fetch blog post:', error)
        setNotFoundError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (notFoundError || !post) {
    notFound()
  }

  // Safe content getter — fallback to EN if VI is corrupted
  function getSafeContent(lang: 'en' | 'vi') {
    const content = post![lang]
    if (!content?.title) return post!['en']
    return content
  }

  const lang = language === 'en' ? 'en' : 'vi'
  const publishDate = post.publishedAt
    ? formatDate(new Date(post.publishedAt).toISOString())
    : formatDate(new Date(post.createdAt).toISOString())

  return (
    <article className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-primary-600 transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {lang === 'en' ? 'Back to Blog' : 'Quay lại Blog'}
        </Link>

        {/* Header */}
        <header className="mb-8">
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full">
                {post.category}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {post[lang].title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-slate-600 mb-6">
            {post[lang].excerpt}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 pb-6 border-b">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{publishDate}</span>
            </div>
            {post.readTime && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
            )}
          </div>
        </header>

        {/* Featured image */}
        {post.featuredImage && (
          <div className="mb-12 max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg">
            <img
              src={post.featuredImage}
              alt={post[lang].title}
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-slate prose-lg max-w-none mb-12 text-left"
          dangerouslySetInnerHTML={{
            __html: contentToHTML(post[lang].content || '')
          }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <section className="mb-12 pb-12 border-b">
            <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              {lang === 'en' ? 'Tags' : 'Thẻ'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full hover:bg-slate-200 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </section>
        )}
{/* ── Comment Section ── */}
        <section className="mt-12 pt-12 border-t">
          <CommentSection slug={params.slug} lang={lang} />
        </section>
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary-600" />
              {lang === 'en' ? 'Related Posts' : 'Bài viết liên quan'}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => {
                const relatedPublishDate = relatedPost.publishedAt
                  ? formatDate(new Date(relatedPost.publishedAt).toISOString())
                  : formatDate(new Date(relatedPost.createdAt).toISOString())

                return (
                  <div
                    key={relatedPost.id}
                    onClick={() => router.push(`/blog/${relatedPost.slug}`)}
                    className="group bg-white rounded-lg border shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
                  >
                    {relatedPost.featuredImage && (
                      <div className="aspect-video overflow-hidden bg-slate-100">
                        <img
                          src={relatedPost.featuredImage}
                          alt={relatedPost[lang].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      {relatedPost.category && (
                        <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full mb-2">
                          {relatedPost.category}
                        </span>
                      )}
                      <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                        {relatedPost[lang].title}
                      </h3>
                      <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                        {relatedPost[lang].excerpt}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{relatedPublishDate}</span>
                        </div>
                        {relatedPost.readTime && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{relatedPost.readTime} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </article>
  )
  function CommentSection({ slug, lang }: { slug: string; lang: 'en' | 'vi' }) {
  const [comments, setComments] = useState<any[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/comments/${slug}`)
      .then(r => r.json())
      .then(d => setComments(d.comments || []))
      .catch(() => {})
  }, [slug])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email.trim() || !content.trim()) {
      setError(lang === 'en' ? 'Please fill in all fields' : 'Vui lòng điền đầy đủ thông tin')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/comments/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmitted(true)
      setName(''); setEmail(''); setContent('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-8">
        {lang === 'en' ? `💬 Comments (${comments.length})` : `💬 Bình luận (${comments.length})`}
      </h2>

      {/* Existing comments */}
      {comments.length > 0 && (
        <div className="space-y-6 mb-12">
          {comments.map(c => (
            <div key={c.id} className="bg-slate-50 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                  <p className="text-xs text-slate-400">{new Date(c.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">{c.content}</p>

              {c.reply && (
                <div className="mt-4 ml-4 pl-4 border-l-2 border-primary-300 bg-white rounded-r-lg p-3">
                  <p className="text-xs font-semibold text-primary-600 mb-1">
                    🌿 Minh Tran
                  </p>
                  <p className="text-slate-700 text-sm whitespace-pre-wrap">{c.reply}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Comment form */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {lang === 'en' ? '✍️ Leave a comment' : '✍️ Để lại bình luận'}
        </h3>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 text-center">
            <p className="font-medium">
              {lang === 'en' ? '🎉 Thank you for your comment!' : '🎉 Cảm ơn bạn đã bình luận!'}
            </p>
            <p className="text-sm mt-1">
              {lang === 'en'
                ? 'Your comment is pending approval and will appear shortly.'
                : 'Bình luận của bạn đang chờ duyệt và sẽ hiển thị sớm.'}
            </p>
            <button onClick={() => setSubmitted(false)}
              className="mt-3 text-sm text-green-600 underline hover:text-green-700">
              {lang === 'en' ? 'Write another comment' : 'Viết bình luận khác'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase block mb-1">
                  {lang === 'en' ? 'Name *' : 'Tên *'}
                </label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder={lang === 'en' ? 'Your name' : 'Tên của bạn'}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-500 uppercase block mb-1">
                  Email *
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
                <p className="text-xs text-slate-400 mt-1">
                  {lang === 'en' ? 'Not displayed publicly' : 'Không hiển thị công khai'}
                </p>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase block mb-1">
                {lang === 'en' ? 'Comment *' : 'Bình luận *'}
              </label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={5}
                placeholder={lang === 'en' ? 'Share your thoughts...' : 'Chia sẻ suy nghĩ của bạn...'}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{ resize: 'vertical' }} />
              <p className="text-xs text-slate-400 mt-1">{content.length}/1000</p>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button type="submit" disabled={submitting}
              className="w-full bg-primary-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {submitting
                ? <><Loader2 className="h-4 w-4 animate-spin" />{lang === 'en' ? 'Sending...' : 'Đang gửi...'}</>
                : lang === 'en' ? '📨 Submit Comment' : '📨 Gửi bình luận'}
            </button>
            <p className="text-xs text-slate-400 text-center">
              {lang === 'en'
                ? 'Comments are moderated before appearing.'
                : 'Bình luận sẽ được kiểm duyệt trước khi hiển thị.'}
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
}
