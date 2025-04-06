'use client'

import Navigation from '@/components/Navigation'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
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
  )
} 