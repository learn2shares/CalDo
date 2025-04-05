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

import { useMemo } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { FiCheckCircle, FiClock, FiPieChart, FiTag } from 'react-icons/fi'

export default function StatsPage() {
  const { tasks } = useTasks()

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed).length
    const totalTasks = tasks.length
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    const tasksByPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const tasksByCategory = tasks.reduce((acc, task) => {
      const category = task.category || 'Uncategorized'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      completed: completedTasks,
      total: totalTasks,
      completionRate,
      byPriority: tasksByPriority,
      byCategory: tasksByCategory,
    }
  }, [tasks])

  return (
    <div className="p-4 space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <FiCheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Tasks</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <FiClock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Completion Rate</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.completionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
            <FiPieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Priority Distribution</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(stats.byPriority).map(([priority, count]) => (
            <div key={priority} className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${
                priority === 'high' ? 'bg-red-500' :
                priority === 'medium' ? 'bg-yellow-500' :
                'bg-green-500'
              }`} />
              <span className="flex-1 text-gray-700 dark:text-gray-300 capitalize">{priority}</span>
              <span className="font-medium text-gray-900 dark:text-white">{count} tasks</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Distribution */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
            <FiTag className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Category Distribution</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div key={category} className="flex items-center gap-4">
              <span className="flex-1 text-gray-700 dark:text-gray-300">{category}</span>
              <span className="font-medium text-gray-900 dark:text-white">{count} tasks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 