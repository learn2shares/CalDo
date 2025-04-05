import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '../hooks/useTasks';
import ReminderModal from './ReminderModal';
import type { Task } from '../lib/supabase';
import { registerForPushNotificationsAsync } from '../lib/notifications';

/**
 * Todo Component
 * Main component for task management that handles:
 * - Displaying the list of tasks
 * - Adding new tasks
 * - Completing tasks
 * - Deleting tasks
 * - Setting reminders
 */
export default function Todo() {
  // Get task management functions from our custom hook
  const { tasks, loading, error, addTask, toggleTaskComplete, deleteTask } = useTasks();

  // State for managing new task input
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    due_date: new Date().toISOString(),
    priority: 'medium',
    category: 'Personal',
  });

  // States for UI management
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Register for push notifications when component mounts
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  /**
   * Handles adding a new task
   * Validates that title exists, then creates the task and resets the form
   */
  const handleAddTask = async () => {
    if (!newTask.title) return; // Don't add task if title is empty
    
    // Add the task to the database
    await addTask({
      title: newTask.title,
      description: newTask.description || '',
      due_date: newTask.due_date || new Date().toISOString(),
      priority: newTask.priority || 'medium',
      category: newTask.category || 'Personal',
      completed: false,
    });

    // Reset the form after adding task
    setNewTask({
      title: '',
      description: '',
      due_date: new Date().toISOString(),
      priority: 'medium',
      category: 'Personal',
    });
  };

  /**
   * Opens the reminder modal for a specific task
   * @param task - The task to set a reminder for
   */
  const handleSetReminder = (task: Task) => {
    setSelectedTask(task);
    setShowReminderModal(true);
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  // Show error message if there's an error
  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* New Task Input Section */}
      <View className="p-4">
        {/* Task Title Input */}
        <TextInput
          className="p-3 mb-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Task title"
          value={newTask.title}
          onChangeText={(text) => setNewTask({ ...newTask, title: text })}
        />

        {/* Task Description Input */}
        <TextInput
          className="p-3 mb-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Description"
          value={newTask.description}
          onChangeText={(text) => setNewTask({ ...newTask, description: text })}
          multiline
        />
        
        {/* Due Date Picker */}
        <TouchableOpacity
          className="flex-row items-center p-3 mb-2 border border-gray-300 rounded-lg dark:border-gray-700"
          onPress={() => setShowDatePicker(true)}
        >
          <Text className="text-gray-700 dark:text-gray-300">
            Due Date: {new Date(newTask.due_date || Date.now()).toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date(newTask.due_date || Date.now())}
            mode="date"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setNewTask({ ...newTask, due_date: date.toISOString() });
              }
            }}
          />
        )}

        {/* Add Task Button */}
        <TouchableOpacity
          className="p-3 mb-4 bg-blue-500 rounded-lg"
          onPress={handleAddTask}
        >
          <Text className="text-center text-white font-semibold">Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Task List Section */}
      <ScrollView className="flex-1 px-4">
        {tasks.map(task => (
          <View
            key={task.id}
            className="flex-row items-center p-4 mb-2 bg-gray-50 rounded-lg dark:bg-gray-800"
          >
            {/* Task Completion Toggle */}
            <TouchableOpacity
              onPress={() => toggleTaskComplete(task.id)}
              className="mr-3"
            >
              <Ionicons
                name={task.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={task.completed ? '#10B981' : '#6B7280'}
              />
            </TouchableOpacity>
            
            {/* Task Details */}
            <View className="flex-1">
              <Text className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                {task.title}
              </Text>
              {task.description ? (
                <Text className="text-gray-600 dark:text-gray-400 mt-1">
                  {task.description}
                </Text>
              ) : null}
              <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </Text>
            </View>

            {/* Reminder Button */}
            <TouchableOpacity
              onPress={() => handleSetReminder(task)}
              className="mr-2"
            >
              <Ionicons name="alarm-outline" size={20} color="#3B82F6" />
            </TouchableOpacity>

            {/* Delete Button */}
            <TouchableOpacity
              onPress={() => deleteTask(task.id)}
              className="ml-2"
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Reminder Modal */}
      {selectedTask && (
        <ReminderModal
          visible={showReminderModal}
          onClose={() => {
            setShowReminderModal(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
        />
      )}
    </View>
  );
} 