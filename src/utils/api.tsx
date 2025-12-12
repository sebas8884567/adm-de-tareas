import { projectId, publicAnonKey } from './supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-58e5341d`;

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

export const api = {
  signup: async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign up');
    }

    return data;
  },

  getTasks: async (accessToken: string): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error fetching tasks:', data.error);
      throw new Error(data.error || 'Failed to fetch tasks');
    }

    console.log('✅ Tasks loaded:', data.tasks?.length || 0);
    return data.tasks || [];
  },

  createTask: async (accessToken: string, taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error creating task:', data.error);
      console.error('Response status:', response.status);
      console.error('Response data:', data);
      throw new Error(data.error || 'Failed to create task');
    }

    return data.task;
  },

  updateTask: async (accessToken: string, taskId: string, taskData: Partial<Task>) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(taskData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error updating task:', data.error);
      throw new Error(data.error || 'Failed to update task');
    }

    return data.task;
  },

  deleteTask: async (accessToken: string, taskId: string) => {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error deleting task:', data.error);
      throw new Error(data.error || 'Failed to delete task');
    }

    return data;
  },
};