import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { AuthProvider } from '@/contexts/AuthContext'

// Load Inter font with Latin character subset
const inter = Inter({ subsets: ['latin'] })

// Define metadata for the application (used for SEO)
export const metadata = {
  title: 'CalDo - Smart Task Management & Calendar App',
  description: 'A modern task management application with calendar integration and category organization',
}

/**
 * Root Layout Component
 * 
 * This is the main layout wrapper that:
 * - Applies the Inter font
 * - Sets up the basic page structure
 * - Provides dark mode support
 * - Wraps content in ClientLayout for client-side interactivity
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation />
            <main className="container mx-auto max-w-4xl px-4 py-8">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 