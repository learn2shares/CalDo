import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientLayout from './components/ClientLayout'

// Load Inter font with Latin character subset
const inter = Inter({ subsets: ['latin'] })

// Define metadata for the application (used for SEO)
export const metadata: Metadata = {
  title: 'CalDo - Task Management',
  description: 'A simple and effective task management application',
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
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
} 