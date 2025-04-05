/**
 * AuthGuard Component
 * 
 * This component:
 * - Protects routes that require authentication
 * - Redirects unauthenticated users to the auth page
 * - Shows loading state while checking authentication
 */

'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'

const publicPaths = ['/auth']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user && !publicPaths.includes(pathname)) {
      router.push('/auth')
    }
  }, [user, loading, router, pathname])

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show children only if:
  // - User is authenticated, or
  // - Current path is public
  if (user || publicPaths.includes(pathname)) {
    return <>{children}</>
  }

  // Return null while redirecting
  return null
} 