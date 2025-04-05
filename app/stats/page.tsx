/**
 * Stats Page Component
 * 
 * This page will display task statistics and analytics, including:
 * - Task completion rates
 * - Task distribution by priority
 * - Task trends over time
 * - Productivity metrics
 * 
 * Currently a placeholder - statistics functionality to be implemented
 */

'use client'

import { useTasks } from '@/hooks/useTasks'
import { FiCheckCircle, FiClock, FiFlag, FiCalendar } from 'react-icons/fi'

export default function StatsPage() {
  const { tasks } = useTasks()

  // Calculate statistics
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(task => task.completed).length
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0

  const tasksByPriority = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const tasksByCategory = tasks.reduce((acc, task) => {
    const category = task.category || 'Uncategorized'
    acc[category] = (acc[category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Tasks Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Tasks
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {totalTasks}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <FiClock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Completion Rate Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completion Rate
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {completionRate}%
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <FiCheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Priority Distribution
        </h3>
        <div className="space-y-3">
          {Object.entries(tasksByPriority).map(([priority, count]) => (
            <div key={priority} className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                priority === 'high' 
                  ? 'bg-red-500' 
                  : priority === 'medium'
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`} />
              <span className="flex-1 text-sm text-gray-600 dark:text-gray-400 capitalize">
                {priority}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {count} tasks
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Category Distribution
        </h3>
        <div className="space-y-3">
          {Object.entries(tasksByCategory).map(([category, count]) => (
            <div key={category} className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-primary mr-2" />
              <span className="flex-1 text-sm text-gray-600 dark:text-gray-400">
                {category}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {count} tasks
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 