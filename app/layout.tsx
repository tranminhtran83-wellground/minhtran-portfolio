import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from 'sonner'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { VisitorTracker } from '@/components/VisitorTracker'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { BASE_URL, DEFAULT_METADATA } from '@/lib/metadata'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Minh Tran - Head of Digital & Technology | Supply Chain',
    template: '%s | Minh Tran',
  },
  description: '20 years experience in Supply Chain & Digital Transformation at Unilever Greater Asia. Exploring the next chapter — building something new.',
  keywords: ['Supply Chain', 'Digital Transformation', 'Technology', 'COO', 'Unilever', 'FMCG', 'Vietnam', 'Leadership'],
  authors: [{ name: DEFAULT_METADATA.author }],
  creator: DEFAULT_METADATA.author,
  openGraph: {
    type: 'website',
    locale: DEFAULT_METADATA.locale,
    url: BASE_URL,
    siteName: DEFAULT_METADATA.siteName,
    title: 'Minh Tran - Head of Digital & Technology | Supply Chain',
    description: '20 years experience in Supply Chain & Digital Transformation at Unilever Greater Asia. Exploring the next chapter — building something new.',
    images: [
      {
        url: `${BASE_URL}/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: 'Minh Tran - Head of Digital & Technology',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minh Tran - Head of Digital & Technology | Supply Chain',
    description: '20 years in Supply Chain & Digital at Unilever Greater Asia. Exploring the next chapter.',
    images: [`${BASE_URL}/og-default.jpg`],
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
      <body className={inter.className}>
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
