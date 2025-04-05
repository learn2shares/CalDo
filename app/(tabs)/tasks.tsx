import React from 'react';
import { View } from 'react-native';
import Todo from '../../components/Todo';

export default function TasksScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Todo />
    </View>
  );
} 