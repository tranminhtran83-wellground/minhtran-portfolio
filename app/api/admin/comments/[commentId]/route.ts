import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'
import { auth } from '@/lib/auth'
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

export async function PUT(req: NextRequest, { params }: { params: { commentId: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { action, reply, slug } = body

    const key = `comment:${slug}:${params.commentId}`
    const comment = await kv.get<Comment>(key)
    if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (action === 'approve') {
      comment.status = 'approved'
    } else if (action === 'reply' && reply?.trim()) {
      comment.status = 'approved'
      comment.reply = reply.trim()
      comment.repliedAt = Date.now()

      if (process.env.RESEND_API_KEY) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Minh Tran <onboarding@resend.dev>',
            to: comment.email,
            subject: 'Minh Tran đã reply comment của bạn 🌿',
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2d6a4f;">🌿 Minh Tran đã reply comment của bạn!</h2>
                <p>Xin chào <strong>${comment.name}</strong>,</p>
                <div style="background:#f5f5f5; border-left:4px solid #aaa; padding:12px; margin:16px 0; border-radius:4px;">
                  <p style="color:#666; font-size:13px; margin:0 0 4px;">Comment của bạn:</p>
                  <p style="margin:0;">${comment.content.replace(/\n/g, '<br>')}</p>
                </div>
                <div style="background:#f0f7f4; border-left:4px solid #2d6a4f; padding:12px; margin:16px 0; border-radius:4px;">
                  <p style="color:#2d6a4f; font-size:13px; font-weight:bold; margin:0 0 4px;">Minh Tran trả lời:</p>
                  <p style="margin:0;">${reply.trim().replace(/\n/g, '<br>')}</p>
                </div>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://tmhgarden.vercel.app'}/blog/${slug}"
                   style="background:#2d6a4f; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; display:inline-block; margin-top:8px;">
                  Xem bài viết
                </a>
              </div>
            `,
          }),
        })
      }
    }

    await kv.set(key, comment)
    return NextResponse.json({ success: true, comment })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { commentId: string } }) {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { slug } = body
    await kv.del(`comment:${slug}:${params.commentId}`)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
