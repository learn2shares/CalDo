'use client'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

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
 * - Includes the navigation bar
 * - Provides consistent padding and max-width
 * - Supports dark mode
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
              CalDo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple and effective task management
            </p>
          </div>
          <Navigation />
          <main className="mt-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
} 