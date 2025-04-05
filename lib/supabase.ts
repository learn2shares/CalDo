import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Supabase client
// Replace these with your Supabase project credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  task_id: string;
  remind_at: string;
  type: 'email' | 'push' | 'whatsapp';
  created_at: string;
}

// CRUD operations
export const taskService = {
  // Create a new task
  async createTask(task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('tasks')
      .insert([task])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all tasks for the current user
  async getTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update a task
  async updateTask(id: string, updates: Partial<Task>) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete a task
  async deleteTask(id: string) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  // Toggle task completion
  async toggleTaskComplete(id: string, completed: boolean) {
    return this.updateTask(id, { completed });
  },

  // Get tasks by category
  async getTasksByCategory(category: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get tasks by date range
  async getTasksByDateRange(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .gte('due_date', startDate)
      .lte('due_date', endDate)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }
}; 