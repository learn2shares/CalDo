/**
 * Main page component for the CalDo application
 * This is the entry point of our application that users see when they visit the root URL
 */

'use client'

import TaskList from '@/components/TaskList'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 font-sans">
            CalDo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Simple and effective task management
          </p>
        </div>
        
        <TaskList />
      </div>
    </main>
  )
} 