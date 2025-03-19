export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'paused' | 'completed';
  startTime: Date | null;
  endTime: Date | null;
  pauseStartTime: Date[];
  pauseEndTime: Date[];
  endedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskDto = Pick<Task, 'title' | 'description'>;
