import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import {
  getProject,
  saveProject,
  deleteProject,
  generateSlug,
} from '@/lib/contentManager'

// Force Node.js runtime for PUT/DELETE support
export const runtime = 'nodejs'
function fixEncoding(text: string): string {
  if (!text) return text
  try {
    const bytes = new Uint8Array(text.split('').map(c => c.charCodeAt(0)))
    const decoded = new TextDecoder('utf-8').decode(bytes)
    if (/[àáâãèéêìíòóôõùúýăđơưạặậắẵẻẹềếểệỉịọộốổỗớờởợụứựỳỵ]/i.test(decoded)) {
      return decoded
    }
    return text
  } catch {
    return text
  }
}

function fixProjectEncoding(body: any) {
  return {
    ...body,
    en: {
      ...body.en,
      title: fixEncoding(body.en?.title || ''),
      description: fixEncoding(body.en?.description || ''),
      content: fixEncoding(body.en?.content || ''),
    },
    vi: {
      ...body.vi,
      title: fixEncoding(body.vi?.title || ''),
      description: fixEncoding(body.vi?.description || ''),
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
 * GET - Fetch single project by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const project = await getProject(params.id)

  if (!project) {
    return NextResponse.json(
      { error: 'Project not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(project)
}

/**
 * PUT - Update project (Admin only)
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
    const existing = await getProject(params.id)
    if (!existing) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    const rawBody = await req.json()
    const body = fixProjectEncoding(rawBody)

    // Validate required fields
    if (!body.en?.title || !body.en?.description) {
      return NextResponse.json(
        { error: 'Missing required English fields (title, description)' },
        { status: 400 }
      )
    }

    // Update slug if title changed
    const slug = body.slug || (
      body.en.title !== existing.en.title
        ? generateSlug(body.en.title)
        : existing.slug
    )

    const project = {
      ...existing,
      ...body,
      id: params.id, // Ensure ID doesn't change
      slug,
      updatedAt: Date.now(),
    }

    await saveProject(project)

    return NextResponse.json({ success: true, project })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Delete project (Admin only)
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
    await deleteProject(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    )
  }
}
