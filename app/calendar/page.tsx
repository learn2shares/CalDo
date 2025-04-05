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
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth } from 'date-fns'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function CalendarPage() {
  const { tasks } = useTasks()
  const [currentDate, setCurrentDate] = useState(new Date())

  // Get all days in the current month
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = format(new Date(task.due_date), 'yyyy-MM-dd')
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(task)
    return acc
  }, {} as Record<string, typeof tasks>)

  // Navigation functions
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Calendar View
        </h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="text-center font-medium text-gray-500 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {days.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd')
          const dayTasks = tasksByDate[dateKey] || []
          
          return (
            <div
              key={dateKey}
              className={`min-h-[100px] p-2 border border-gray-200 dark:border-gray-700 rounded-lg ${
                isToday(day)
                  ? 'bg-blue-50 dark:bg-blue-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <div className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs p-1 rounded ${
                      task.completed
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : task.priority === 'high'
                        ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                        : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
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