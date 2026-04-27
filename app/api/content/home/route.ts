import { NextResponse } from 'next/server'
import { getHomeContent } from '@/lib/contentManager'

export async function GET() {
  try {
    const content = await getHomeContent()
    return NextResponse.json({ success: true, content })
  } catch (error) {
    console.error('Error fetching home content:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}
