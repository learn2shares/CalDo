import React, { useMemo } from 'react';
import { View, Text } from 'react-native';
import { useTasks } from '../../hooks/useTasks';
import type { Task } from '../../lib/supabase';

export default function StatsScreen() {
  const { tasks, loading, error } = useTasks();

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.filter(task => !task.completed).length;
    
    const categoryStats = tasks.reduce((acc: { [key: string]: number }, task: Task) => {
      acc[task.category] = (acc[task.category] || 0) + 1;
      return acc;
    }, {});

    return {
      completed: completedTasks,
      pending: pendingTasks,
      total: tasks.length,
      categories: categoryStats,
    };
  }, [tasks]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <View className="bg-gray-50 p-4 rounded-lg mb-4">
        <Text className="text-xl font-bold mb-4">Task Overview</Text>
        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Completed Tasks</Text>
            <Text className="font-semibold text-green-600">{stats.completed}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Pending Tasks</Text>
            <Text className="font-semibold text-blue-600">{stats.pending}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Total Tasks</Text>
            <Text className="font-semibold">{stats.total}</Text>
          </View>
        </View>
      </View>

      <View className="bg-gray-50 p-4 rounded-lg">
        <Text className="text-xl font-bold mb-4">Category Distribution</Text>
        <View className="space-y-2">
          {Object.entries(stats.categories).map(([category, count]) => (
            <View key={category} className="flex-row justify-between">
              <Text className="text-gray-600">{category}</Text>
              <Text className="font-semibold">{count}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="bg-gray-50 p-4 rounded-lg mt-4">
        <Text className="text-xl font-bold mb-4">Completion Rate</Text>
        <View className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <View 
            className="h-full bg-green-500"
            style={{ 
              width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` 
            }}
          />
        </View>
        <Text className="text-center mt-2 text-gray-600">
          {stats.total > 0 
            ? `${Math.round((stats.completed / stats.total) * 100)}%`
            : '0%'
          }
        </Text>
      </View>
    </View>
  );
}