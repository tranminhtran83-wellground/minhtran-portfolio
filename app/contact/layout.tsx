import type { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact',
  description: 'Get in touch with Minh Tran. Connect via email, LinkedIn, or GitHub for collaboration opportunities, project inquiries, or professional networking.',
  path: '/contact',
})

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
