import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export interface Comment {
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

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const keys = await kv.keys(`comment:${params.slug}:*`)
    const comments = await Promise.all(keys.map(k => kv.get<Comment>(k)))
    const approved = (comments.filter(Boolean) as Comment[])
      .filter(c => c.status === 'approved')
      .sort((a, b) => a.createdAt - b.createdAt)
    return NextResponse.json({ comments: approved })
  } catch {
    return NextResponse.json({ comments: [] })
  }
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const body = await req.json()
    const { name, email, content } = body

    if (!name?.trim() || !email?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 })
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
    }

    if (content.length > 1000) {
      return NextResponse.json({ error: 'Comment tối đa 1000 ký tự' }, { status: 400 })
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const comment: Comment = {
      id,
      slug: params.slug,
      name: name.trim(),
      email: email.trim(),
      content: content.trim(),
      status: 'pending',
      createdAt: Date.now(),
    }

    await kv.set(`comment:${params.slug}:${id}`, comment)

    // Send email notification
    if (process.env.RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'TMH Garden <onboarding@resend.dev>',
          to: 'tranminhtran83@gmail.com',
          subject: `💬 Comment mới từ ${name} — cần duyệt`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2d6a4f;">💬 Comment mới cần duyệt</h2>
              <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
                <tr><td style="padding:8px; font-weight:bold; color:#555;">Người gửi:</td><td style="padding:8px;">${name}</td></tr>
                <tr style="background:#f9f9f9;"><td style="padding:8px; font-weight:bold; color:#555;">Email:</td><td style="padding:8px;">${email}</td></tr>
                <tr><td style="padding:8px; font-weight:bold; color:#555;">Bài viết:</td><td style="padding:8px;">${params.slug}</td></tr>
              </table>
              <div style="background:#f0f7f4; border-left:4px solid #2d6a4f; padding:16px; border-radius:4px; margin-bottom:24px;">
                <p style="margin:0; color:#333;">${content.replace(/\n/g, '<br>')}</p>
              </div>
              <div style="text-align:center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://tmhgarden.vercel.app'}/admin/comments"
                   style="background:#2d6a4f; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:bold;">
                  ✅ Vào Admin để duyệt
                </a>
              </div>
              <p style="color:#999; font-size:12px; margin-top:24px; text-align:center;">
                TMH Garden — Comment Notification
              </p>
            </div>
          `,
        }),
      })
    }

    return NextResponse.json({ success: true, message: 'Comment đã gửi, đang chờ duyệt!' })
  } catch (err) {
    console.error('Comment error:', err)
    return NextResponse.json({ error: 'Có lỗi xảy ra, thử lại sau' }, { status: 500 })
  }
}
