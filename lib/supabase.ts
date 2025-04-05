/**
 * Supabase Configuration and Service Layer
 * 
 * This file sets up the Supabase client and provides typed interfaces and
 * service functions for interacting with the database.
 */

import { createClient } from '@supabase/supabase-js'

// Get environment variables for Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validate required environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * Initialize Supabase client with authentication configuration
 * Uses browser's localStorage for session persistence
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

/**
 * Task Interface
 * Represents the structure of a task in the database
 */
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

/**
 * Subtask Interface
 * Represents a subtask that belongs to a main task
 */
export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Reminder Interface
 * Represents a reminder associated with a task
 */
export interface Reminder {
  id: string;
  task_id: string;
  remind_at: string;
  type: 'email' | 'push' | 'whatsapp';
  created_at: string;
}

/**
 * Task Service
 * Provides CRUD operations and additional functionality for managing tasks
 */
export const taskService = {
  /**
   * Creates a new task in the database
   * @param task - The task data to create (without system-managed fields)
   * @returns The created task
   */
  async createTask(task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...task, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Retrieves all tasks for the current user
   * @returns Array of tasks sorted by creation date
   */
  async getTasks() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Updates an existing task
   * @param id - The ID of the task to update
   * @param updates - Partial task data to update
   * @returns The updated task
   */
  async updateTask(id: string, updates: Partial<Task>) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Deletes a task from the database
   * @param id - The ID of the task to delete
   * @returns true if successful
   */
  async deleteTask(id: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  },

  /**
   * Toggles the completion status of a task
   * @param id - The ID of the task to toggle
   * @param completed - The new completion status
   * @returns The updated task
   */
  async toggleTaskComplete(id: string, completed: boolean) {
    return this.updateTask(id, { completed });
  },

  /**
   * Retrieves tasks filtered by category
   * @param category - The category to filter by
   * @returns Array of tasks in the specified category
   */
  async getTasksByCategory(category: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('category', category)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Retrieves tasks within a date range
   * @param startDate - Start of the date range
   * @param endDate - End of the date range
   * @returns Array of tasks due within the specified range
   */
  async getTasksByDateRange(startDate: string, endDate: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .gte('due_date', startDate)
      .lte('due_date', endDate)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  }
}; 