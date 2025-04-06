'use client'

/**
 * TaskList Component
 * 
 * This is the main component for task management functionality.
 * It provides interfaces for:
 * - Adding new tasks with title, description, due date, priority, and category
 * - Displaying existing tasks in a list format
 * - Toggling task completion status
 * - Deleting tasks
 * 
 * The component uses the useTasks hook for state management and
 * database operations through Supabase.
 */

import { useState } from 'react'
import { useTasks } from '@/hooks/useTasks'
import { type Task } from '@/lib/supabase'
import { format } from 'date-fns'
import { FiCheck, FiTrash2, FiCalendar, FiFlag, FiTag } from 'react-icons/fi'

// Predefined categories
const CATEGORIES = ['Personal', 'Learning', 'Work', 'Shopping', 'Health', 'Others'] as const;

export default function TaskList() {
  // Get task management functions and state from custom hook
  const { tasks, loading, error, addTask, updateTask, deleteTask, toggleTaskComplete } = useTasks()

  // State for managing new task form
  const [newTask, setNewTask] = useState<Partial<Task> & { customCategory?: string }>({
    title: '',
    description: '',
    due_date: new Date().toISOString(),
    priority: 'medium',
    category: 'Personal',
    customCategory: '',
  })

  /**
   * Handles the submission of new tasks
   * Validates the form and creates a new task in the database
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title) return

    const category = newTask.category === 'Others' ? newTask.customCategory : newTask.category;

    await addTask({
      title: newTask.title,
      description: newTask.description ?? '',
      due_date: newTask.due_date || new Date().toISOString(),
      priority: newTask.priority || 'medium',
      category: category || 'Personal',
      completed: false,
    })

    // Reset form after successful submission
    setNewTask({
      title: '',
      description: '',
      due_date: new Date().toISOString(),
      priority: 'medium',
      category: 'Personal',
      customCategory: '',
    })
  }

  // Show loading spinner while fetching tasks
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show error message if something goes wrong
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-error bg-error/10 px-4 py-2 rounded-md">{error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Task Creation Form */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Add New Task
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>

          <div>
            <textarea
              placeholder="Description (optional)"
              value={newTask.description || ''}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                value={format(new Date(newTask.due_date || new Date()), 'yyyy-MM-dd')}
                onChange={(e) => setNewTask({ ...newTask, due_date: new Date(e.target.value).toISOString() })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            <select
              value={newTask.category}
              onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {newTask.category === 'Others' && (
              <input
                type="text"
                placeholder="Enter custom category"
                value={newTask.customCategory}
                onChange={(e) => setNewTask({ ...newTask, customCategory: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all ${
              task.completed ? 'opacity-75' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <button
                onClick={() => toggleTaskComplete(task.id)}
                className={`mt-1 p-2 rounded-full transition-colors ${
                  task.completed 
                    ? 'text-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                }`}
              >
                <FiCheck className="w-5 h-5" />
              </button>

              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-medium truncate ${
                  task.completed 
                    ? 'line-through text-gray-500 dark:text-gray-400' 
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                    {task.description}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <FiCalendar className="w-4 h-4" />
                    {format(new Date(task.due_date), 'MMM d, yyyy')}
                  </span>
                  
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
                    task.priority === 'high' 
                      ? 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
                      : 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  }`}>
                    <FiFlag className="w-4 h-4" />
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                    <FiTag className="w-4 h-4" />
                    {task.category}
                  </span>
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No tasks yet. Add your first task above!</p>
          </div>
        )}
      </div>
    </div>
  )
}