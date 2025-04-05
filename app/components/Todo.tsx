import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [showDatePicker, setShowDatePicker] = useState(false);

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
    <View className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4">
        <TextInput
          className="p-3 mb-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Task title"
          value={newTask.title}
          onChangeText={(text) => setNewTask({ ...newTask, title: text })}
        />
        <TextInput
          className="p-3 mb-2 border border-gray-300 rounded-lg dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          placeholder="Description"
          value={newTask.description}
          onChangeText={(text) => setNewTask({ ...newTask, description: text })}
          multiline
        />
        
        <TouchableOpacity
          className="flex-row items-center p-3 mb-2 border border-gray-300 rounded-lg dark:border-gray-700"
          onPress={() => setShowDatePicker(true)}
        >
          <Text className="text-gray-700 dark:text-gray-300">
            Due Date: {newTask.dueDate?.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={newTask.dueDate || new Date()}
            mode="date"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setNewTask({ ...newTask, dueDate: date });
              }
            }}
          />
        )}

        <TouchableOpacity
          className="p-3 mb-4 bg-blue-500 rounded-lg"
          onPress={addTask}
        >
          <Text className="text-center text-white font-semibold">Add Task</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        {tasks.map(task => (
          <View
            key={task.id}
            className="flex-row items-center p-4 mb-2 bg-gray-50 rounded-lg dark:bg-gray-800"
          >
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
                Due: {task.dueDate.toLocaleDateString()}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => deleteTask(task.id)}
              className="ml-2"
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
} 