import { NextResponse } from 'next/server'
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

export async function GET() {
  const session = await auth()
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const keys = await kv.keys('comment:*')
    const comments = await Promise.all(keys.map(k => kv.get<Comment>(k)))
    const valid = (comments.filter(Boolean) as Comment[])
      .sort((a, b) => b.createdAt - a.createdAt)
    return NextResponse.json({ comments: valid })
  } catch {
    return NextResponse.json({ comments: [] })
  }
}
