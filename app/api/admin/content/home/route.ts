import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getHomeContent, saveHomeContent } from '@/lib/contentManager'
import type { HomeContent } from '@/lib/contentManager'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const content = await getHomeContent()
    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Error fetching home content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const content: HomeContent = {
      hero: body.hero,
      values: body.values,
      origin: body.origin,
      updatedAt: Date.now(),
    }

    await saveHomeContent(content)
    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Error saving home content:', error)
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 })
  }
}
