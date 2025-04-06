'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FiList, FiCalendar, FiBarChart2, FiLogOut } from 'react-icons/fi'
import { useAuth } from '@/contexts/AuthContext'

export default function Navigation() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const navItems = [
    {
      name: 'Tasks',
      href: '/',
      icon: FiList
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: FiCalendar
    },
    {
      name: 'Stats',
      href: '/stats',
      icon: FiBarChart2
    }
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 mb-8">
      <div className="flex justify-between items-center">
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center space-x-2 px-4 py-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </nav>
  )
} 