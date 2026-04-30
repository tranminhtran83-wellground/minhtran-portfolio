import type { Metadata } from 'next'
import { Inter, Lora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'sonner'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { VisitorTracker } from '@/components/VisitorTracker'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { BASE_URL, DEFAULT_METADATA } from '@/lib/metadata'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
})

const lora = Lora({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-lora',
})

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Minh Tran',
    template: '%s | Minh Tran',
  },
  description: '',
  keywords: ['Supply Chain', 'Digital Transformation', 'Technology', 'COO', 'Unilever', 'FMCG', 'Vietnam', 'Leadership'],
  authors: [{ name: DEFAULT_METADATA.author }],
  creator: DEFAULT_METADATA.author,
  openGraph: {
    type: 'website',
    locale: DEFAULT_METADATA.locale,
    url: BASE_URL,
    siteName: DEFAULT_METADATA.siteName,
    title: 'Minh Tran',
    description: '...',
    images: [
      {
        url: `${BASE_URL}/garden-hero.jpg`,
        width: 1200,
        height: 630,
        alt: 'Minh Tran',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minh Tran',
    description: '...',
    images: [`${BASE_URL}/garden-hero.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={`${lora.variable} ${inter.variable} font-lora`}>
        <LanguageProvider>
          <SessionProvider>
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <VisitorTracker />
            </div>
          </SessionProvider>
        </LanguageProvider>
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  )
}
