/**
 * Calendar Page Component
 * 
 * This page will display tasks in a calendar view, allowing users to:
 * - View tasks by day, week, or month
 * - See task distribution across time
 * - Manage task schedules
 * 
 * Currently a placeholder - calendar functionality to be implemented
 */

'use client'

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { tasks } = useTasks()

  // Get all days in the current month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = new Date(task.due_date).toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(task)
    return acc
  }, {} as Record<string, typeof tasks>)

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="p-4">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calendar View
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-lg font-medium">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="bg-gray-50 dark:bg-gray-800 p-4 text-center font-medium"
          >
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          const dayTasks = tasksByDate[day.toDateString()] || []
          return (
            <div
              key={day.toISOString()}
              className="min-h-[120px] bg-white dark:bg-gray-800 p-2"
            >
              <div className="text-sm mb-1 text-gray-500">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1 rounded ${
                      task.completed
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                        : task.priority === 'high'
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200'
                        : 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200'
                    }`}
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 