import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Clock, Flag, Check, X, CreditCard as Edit2, Save, Trash2 } from 'lucide-react-native';

interface TaskListProps {
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ALL';
  title?: string;
  date?: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  urgent: boolean;
  category: string;
  completed: boolean;
}

export default function TaskList({ status, title, date }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Write and review the Q1 project proposal',
      dueDate: new Date('2024-02-20'),
      urgent: true,
      category: 'Work',
      completed: false,
    },
    {
      id: '2',
      title: 'Grocery shopping',
      description: 'Buy groceries for the week',
      dueDate: new Date('2024-02-18'),
      urgent: false,
      category: 'Shopping',
      completed: false,
    },
  ]);

  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  const startEditing = (task: Task) => {
    setEditingTask(task.id);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
  };

  const saveTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, title: editedTitle, description: editedDescription }
        : task
    ));
    setEditingTask(null);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (status === 'ALL') return true;
    if (status === 'DONE') return task.completed;
    return !task.completed;
  });

  const renderTaskGroups = () => {
    const pendingTasks = filteredTasks.filter(task => !task.completed);
    const completedTasks = filteredTasks.filter(task => task.completed);

    return (
      <>
        {pendingTasks.length > 0 && (
          <View style={styles.taskGroup}>
            <Text style={styles.groupTitle}>Pending Tasks</Text>
            {pendingTasks.map(task => renderTask(task))}
          </View>
        )}
        
        {completedTasks.length > 0 && (
          <View style={styles.taskGroup}>
            <Text style={styles.groupTitle}>Completed Tasks</Text>
            {completedTasks.map(task => renderTask(task))}
          </View>
        )}
      </>
    );
  };

  const renderTask = (task: Task) => (
    <View key={task.id} style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => toggleTaskCompletion(task.id)}
        >
          {task.completed ? (
            <Check size={16} color="#6366f1" />
          ) : (
            <View style={styles.emptyCheckbox} />
          )}
        </TouchableOpacity>

        <View style={styles.taskContent}>
          {editingTask === task.id ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.editInput}
                value={editedTitle}
                onChangeText={setEditedTitle}
                placeholder="Task title"
              />
              <TextInput
                style={[styles.editInput, styles.editDescription]}
                value={editedDescription}
                onChangeText={setEditedDescription}
                placeholder="Task description"
                multiline
              />
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.saveButton]}
                  onPress={() => saveTask(task.id)}
                >
                  <Save size={16} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.cancelButton]}
                  onPress={() => setEditingTask(null)}
                >
                  <X size={16} color="#ffffff" />
                  <Text style={styles.actionButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text style={[
                styles.taskTitle,
                task.completed && styles.completedText
              ]}>
                {task.title}
              </Text>
              <Text style={[
                styles.taskDescription,
                task.completed && styles.completedText
              ]}>
                {task.description}
              </Text>
            </>
          )}
        </View>

        {!editingTask && (
          <View style={styles.taskActions}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => startEditing(task)}
            >
              <Edit2 size={16} color="#64748b" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => deleteTask(task.id)}
            >
              <Trash2 size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <View style={styles.taskFooter}>
        <View style={styles.taskDueDate}>
          <Clock size={14} color="#64748b" />
          <Text style={styles.taskDueDateText}>
            {task.dueDate.toLocaleDateString()}
          </Text>
        </View>
        <View style={[
          styles.taskCategory,
          { backgroundColor: getCategoryColor(task.category) }
        ]}>
          <Text style={styles.taskCategoryText}>{task.category}</Text>
        </View>
        {task.urgent && (
          <Flag size={16} color="#ef4444" />
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {title && <Text style={styles.listTitle}>{title}</Text>}
      {renderTaskGroups()}
    </View>
  );
}

function getCategoryColor(category: string): string {
  switch (category.toLowerCase()) {
    case 'work':
      return '#818cf8';
    case 'shopping':
      return '#4ade80';
    case 'personal':
      return '#fb923c';
    case 'health':
      return '#f472b6';
    default:
      return '#94a3b8';
  }
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  taskGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2.22,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#6366f1',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCheckbox: {
    width: 16,
    height: 16,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#94a3b8',
  },
  taskActions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  iconButton: {
    padding: 4,
    marginLeft: 8,
  },
  editContainer: {
    flex: 1,
  },
  editInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    fontSize: 16,
    color: '#1e293b',
  },
  editDescription: {
    height: 80,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  saveButton: {
    backgroundColor: '#6366f1',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  taskDueDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDueDateText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },
  taskCategory: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  taskCategoryText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
});