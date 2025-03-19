import { useState, useCallback } from 'react';
import axios from '../lib/axios';
import { Task, CreateTaskDto } from '../types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`/tasks/${userId}`);
      console.log(response.data, 'response.data');
      setTasks(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData: CreateTaskDto) => {
    try {
      const response = await axios.post('/tasks', taskData);
      setTasks(response.data.allTasks);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateTaskStatus = async (
    taskId: string,
    status: 'start' | 'end' | 'pause' | 'resume',
  ) => {
    try {
      const response = await axios.patch(`/tasks/${taskId}/${status}`);
      setTasks(response.data?.allTasks || []);
      return response.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTaskStatus,
  };
}
