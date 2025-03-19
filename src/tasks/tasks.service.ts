import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Task } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  private async updateTaskAndGetAll(
    taskId: number,
    updateData: any,
  ): Promise<{ task: Task; allTasks: Task[] }> {
    const task = await this.prismaService.task.update({
      where: { id: taskId },
      data: updateData,
    });
    const allTasks = await this.getTasksByUserId(task.userId);
    return { task, allTasks };
  }

  private async pauseOtherRunningTasks(userId: number, currentTaskId: number) {
    await this.prismaService.task.updateMany({
      where: {
        userId,
        id: { not: currentTaskId },
        status: 'in_progress',
      },
      data: {
        status: 'paused',
        pauseStartTime: {
          push: new Date(),
        },
      },
    });
  }

  async createTask(
    userId: number,
    title: string,
    description: string,
  ): Promise<{ task: Task; allTasks: Task[] }> {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    }); // Check if user exists in the database
    if (!user) {
      throw new BadRequestException('Wrong user Id');
    }
    const task = await this.prismaService.task.create({
      data: {
        userId,
        title,
        description,
        status: 'pending',
      },
    });
    const allTasks = await this.getTasksByUserId(userId);
    return { task, allTasks };
  }

  async getTasksByUserId(userId: number): Promise<Task[]> {
    return this.prismaService.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateTaskStatus(
    taskId: number,
    status: string,
  ): Promise<{ task: Task; allTasks: Task[] }> {
    return this.updateTaskAndGetAll(taskId, { status });
  }

  async startTask(taskId: number): Promise<{ task: Task; allTasks: Task[] }> {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    if (task.status === 'in_progress' || task.status === 'completed') {
      throw new BadRequestException('Task is already in progress or completed');
    }

    await this.pauseOtherRunningTasks(task.userId, taskId);

    return this.updateTaskAndGetAll(taskId, {
      startTime: new Date(),
      status: 'in_progress',
    });
  }

  async pauseTask(taskId: number): Promise<{ task: Task; allTasks: Task[] }> {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    if (task.status === 'paused') {
      throw new BadRequestException('Task is already paused');
    }

    return this.updateTaskAndGetAll(taskId, {
      pauseStartTime: {
        push: new Date(),
      },
      status: 'paused',
    });
  }

  async resumeTask(taskId: number): Promise<{ task: Task; allTasks: Task[] }> {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    await this.pauseOtherRunningTasks(task.userId, taskId);

    return this.updateTaskAndGetAll(taskId, {
      pauseEndTime: {
        push: new Date(),
      },
      status: 'in_progress',
    });
  }

  async endTask(taskId: number): Promise<{ task: Task; allTasks: Task[] }> {
    const task = await this.prismaService.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new BadRequestException('Task not found');
    }

    if (task.status === 'completed') {
      throw new BadRequestException('Task is already completed');
    }

    return this.updateTaskAndGetAll(taskId, {
      endTime: new Date(),
      status: 'completed',
    });
  }
}
