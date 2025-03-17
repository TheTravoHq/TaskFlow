import { Task } from '../tasks/tasks.entity';

export class User {
  id: number;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date | null;
  tasks: Task[];
}
