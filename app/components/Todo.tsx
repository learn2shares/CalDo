import React, { useState } from 'react';
import { FiCheck, FiCircle, FiTrash2 } from 'react-icons/fi';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: string;
  subtasks: Task[];
}

export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    dueDate: new Date(),
    priority: 'medium',
    category: 'Personal',
    subtasks: [],
  });

  const addTask = () => {
    if (!newTask.title) return;
    
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      description: newTask.description || '',
      dueDate: newTask.dueDate || new Date(),
      priority: newTask.priority || 'medium',
      completed: false,
      category: newTask.category || 'Personal',
      subtasks: [],
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      dueDate: new Date(),
      priority: 'medium',
      category: 'Personal',
      subtasks: [],
    });
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="flex-1 min-h-screen bg-white dark:bg-gray-900">
      <div className="p-4">
        <input
          type="text"
          className="w-full p-3 mb-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          className="w-full p-3 mb-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
        />
        
        <div className="flex items-center mb-2">
          <input
            type="date"
            className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            value={newTask.dueDate?.toISOString().split('T')[0]}
            onChange={(e) => setNewTask({ ...newTask, dueDate: new Date(e.target.value) })}
          />
        </div>

        <button
          className="w-full p-3 mb-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          onClick={addTask}
        >
          Add Task
        </button>
      </div>

      <div className="flex-1 px-4 overflow-auto">
        {tasks.map(task => (
          <div
            key={task.id}
            className="flex items-center p-4 mb-2 bg-gray-50 rounded-lg dark:bg-gray-800"
          >
            <button
              onClick={() => toggleTaskComplete(task.id)}
              className="mr-3 focus:outline-none"
            >
              {task.completed ? (
                <FiCheck className="w-6 h-6 text-emerald-500" />
              ) : (
                <FiCircle className="w-6 h-6 text-gray-500" />
              )}
            </button>
            
            <div className="flex-1">
              <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {task.description}
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Due: {task.dueDate.toLocaleDateString()}
              </p>
            </div>

            <button
              onClick={() => deleteTask(task.id)}
              className="ml-2 focus:outline-none"
            >
              <FiTrash2 className="w-5 h-5 text-red-500 hover:text-red-600" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 