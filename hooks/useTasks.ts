import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Task } from '../lib/supabase';

/**
 * Custom hook for managing tasks
 * This hook provides all the necessary functions to interact with tasks in our application
 * Returns tasks array, loading state, error state, and CRUD operations
 */
export function useTasks() {
  // State management using React hooks
  const [tasks, setTasks] = useState<Task[]>([]); // Stores all tasks
  const [loading, setLoading] = useState(true);   // Tracks loading state
  const [error, setError] = useState<string | null>(null); // Stores any errors

  // useEffect hook runs when the component mounts
  // It automatically fetches tasks when the component is first loaded
  useEffect(() => {
    fetchTasks();
  }, []);

  /**
   * Fetches all tasks from the database
   * try-catch is used for error handling:
   * - 'try' block: attempts to execute the code
   * - 'catch' block: handles any errors that occur
   * - 'finally' block: runs regardless of success or failure
   */
  const fetchTasks = async () => {
    try {
      // Query the tasks table and order by creation date
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error; // If there's an error, throw it to the catch block
      setTasks(data || []); // Update tasks state with the fetched data
    } catch (e) {
      // Handle any errors that occurred during the fetch
      setError(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      // Always set loading to false when the operation is complete
      setLoading(false);
    }
  };

  /**
   * Adds a new task to the database
   * @param newTask - The task to be added (without id, created_at, updated_at, and user_id)
   * @returns The created task or null if there was an error
   */
  const addTask = async (newTask: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      // Insert the new task and get the user ID from the auth session
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...newTask, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      // Add the new task to the beginning of the tasks array
      setTasks([data, ...tasks]);
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      return null;
    }
  };

  /**
   * Updates an existing task
   * @param id - The ID of the task to update
   * @param updates - The fields to update and their new values
   * @returns The updated task or null if there was an error
   */
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      // Update the task in the database
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      // Update the task in the local state
      setTasks(tasks.map(task => task.id === id ? { ...task, ...data } : task));
      return data;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      return null;
    }
  };

  /**
   * Deletes a task from the database
   * @param id - The ID of the task to delete
   * @returns true if successful, false if there was an error
   */
  const deleteTask = async (id: string) => {
    try {
      // Delete the task from the database
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      // Remove the task from the local state
      setTasks(tasks.filter(task => task.id !== id));
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred');
      return false;
    }
  };

  /**
   * Toggles the completion status of a task
   * @param id - The ID of the task to toggle
   * @returns The updated task or null if there was an error
   */
  const toggleTaskComplete = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return null;
    return updateTask(id, { completed: !task.completed });
  };

  // Return all the necessary functions and state
  return {
    tasks,        // Array of all tasks
    loading,      // Loading state
    error,        // Error state
    addTask,      // Function to add a new task
    updateTask,   // Function to update a task
    deleteTask,   // Function to delete a task
    toggleTaskComplete, // Function to toggle task completion
    refreshTasks: fetchTasks, // Function to refresh all tasks
  };
} 