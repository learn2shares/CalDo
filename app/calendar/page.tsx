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

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-semibold py-2">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const dayTasks = tasksByDate[dateStr] || []
          
          return (
            <div
              key={dateStr}
              className={`min-h-[100px] p-2 border rounded-lg ${
                isToday(day)
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="text-right mb-1">
                {format(day, 'd')}
              </div>
              <div className="space-y-1">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`text-sm p-1 rounded ${
                      task.completed
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : task.priority === 'high'
                        ? 'bg-red-100 dark:bg-red-900/20'
                        : task.priority === 'medium'
                        ? 'bg-yellow-100 dark:bg-yellow-900/20'
                        : 'bg-green-100 dark:bg-green-900/20'
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