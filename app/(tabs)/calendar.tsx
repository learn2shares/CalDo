import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { useTasks } from '../../hooks/useTasks';
import type { Task } from '../../lib/supabase';

export default function CalendarScreen() {
  const { tasks, loading, error } = useTasks();

  const markedDates = useMemo(() => {
    const dates: { [key: string]: { marked: boolean; dotColor: string } } = {};
    
    tasks.forEach((task: Task) => {
      const date = task.due_date.split('T')[0];
      dates[date] = {
        marked: true,
        dotColor: task.completed ? '#10B981' : '#3B82F6',
      };
    });

    return dates;
  }, [tasks]);

  const tasksByDate = useMemo(() => {
    const grouped: { [key: string]: Task[] } = {};
    
    tasks.forEach((task: Task) => {
      const date = task.due_date.split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });

    return grouped;
  }, [tasks]);

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <RNCalendar
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#3B82F6',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#3B82F6',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#3B82F6',
          selectedDotColor: '#ffffff',
          arrowColor: '#3B82F6',
          monthTextColor: '#2d4150',
          indicatorColor: '#3B82F6',
        }}
        markedDates={markedDates}
        onDayPress={(day) => {
          console.log('selected day', day);
        }}
      />

      <ScrollView className="flex-1 p-4">
        {Object.entries(tasksByDate).map(([date, dateTasks]) => (
          <View key={date} className="mb-4">
            <Text className="text-lg font-semibold mb-2">
              {new Date(date).toLocaleDateString()}
            </Text>
            {dateTasks.map((task) => (
              <View
                key={task.id}
                className="p-3 mb-2 bg-gray-50 rounded-lg border border-gray-200"
              >
                <Text className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {task.title}
                </Text>
                {task.description ? (
                  <Text className="text-gray-600 mt-1 text-sm">
                    {task.description}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}