import { User } from '../users/users.entity';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

export class Task {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
  startTime: Date | null;
  endTime: Date | null;
  pauseStartTime: Date[];
  pauseEndTime: Date[];
  status: TaskStatus;
  user: User;
}
