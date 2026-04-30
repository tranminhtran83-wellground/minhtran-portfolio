import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getBlogPost,
  saveBlogPost,
  deleteBlogPost,
  generateSlug,
  calculateReadingTime,
} from '@/lib/contentManager'

// Force Node.js runtime for PUT/DELETE support
export const runtime = 'nodejs'
/**
 * Fix mojibake encoding (Gemini/Word copy-paste issue)
 * Converts incorrectly encoded Latin-1 sequences back to proper UTF-8 Vietnamese
 */
function fixEncoding(text: string): string {
  if (!text) return text
  try {
    // If text contains mojibake patterns (Latin-1 interpreted as UTF-8)
    // encode back to bytes then decode as UTF-8
    const bytes = new Uint8Array(text.split('').map(c => c.charCodeAt(0)))
    const decoded = new TextDecoder('utf-8').decode(bytes)
    // Only use decoded version if it contains valid Vietnamese chars
    if (/[àáâãèéêìíòóôõùúýăđơưạặậắẵẻẹềếểệỉịọộốổỗớờởợụứựỳỵ]/i.test(decoded)) {
      return decoded
    }
    return text
  } catch {
    return text
  }
}

function fixPostEncoding(body: any) {
  return {
    ...body,
    en: {
      ...body.en,
      title: fixEncoding(body.en?.title || ''),
      excerpt: fixEncoding(body.en?.excerpt || ''),
      content: fixEncoding(body.en?.content || ''),
    },
    vi: {
      ...body.vi,
      title: fixEncoding(body.vi?.title || ''),
      excerpt: fixEncoding(body.vi?.excerpt || ''),
      content: fixEncoding(body.vi?.content || ''),
    },
  }
}

/**
 * OPTIONS - Handle CORS preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

/**
 * GET - Fetch single blog post by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await getBlogPost(params.id)

  if (!post) {
    return NextResponse.json(
      { error: 'Blog post not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(post)
}

/**
 * PUT - Update blog post (Admin only)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const existing = await getBlogPost(params.id)
    if (!existing) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    const rawBody = await req.json()
      const body = fixPostEncoding(rawBody)

    // Validate required fields
    if (!body.en?.title || !body.en?.excerpt) {
      return NextResponse.json(
        { error: 'Missing required English fields (title, excerpt)' },
        { status: 400 }
      )
    }

    // Update slug if title changed
    const slug = body.slug || (
      body.en.title !== existing.en.title
        ? generateSlug(body.en.title)
        : existing.slug
    )

    // Calculate reading time from updated content
    const content = body.en.content || ''
    const readingTime = calculateReadingTime(content)

    // Update publishedAt if status changes to published
    const publishedAt =
      body.status === 'published' && existing.status === 'draft'
        ? Date.now()
        : existing.publishedAt

    const post = {
      ...existing,
      ...body,
      id: params.id, // Ensure ID doesn't change
      slug,
      updatedAt: Date.now(),
      publishedAt,
      readingTime,
    }

    await saveBlogPost(post)

    return NextResponse.json({ success: true, post })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Delete blog post (Admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    await deleteBlogPost(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    )
  }
}
