import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Load Inter font with Latin character subset
const inter = Inter({ subsets: ['latin'] })

// Define metadata for the application (used for SEO)
export const metadata: Metadata = {
  title: 'CalDo - Task Management',
  description: 'A simple and effective task management application',
}

// Root layout component that wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 dark:bg-gray-900`}>
        {/* Main container with responsive padding and max width */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </body>
    </html>
  )
} 